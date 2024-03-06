import axios from 'axios';
import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { getGameAndUser, handleResponse } from '../client_utils/safety_utils';
import { checkOneName } from '../client_utils/text_utils';
import ErrorMessage from './PlayHeader/ErrorMessage.js';
import Message from './PlayHeader/Message.js';
import PlayerInfo from './PlayHeader/PlayerInfo';
import StateInfo from './PlayHeader/StateInfo';
import Archive from './playViews/Archive';
import ArtistsBar from './playViews/ArtistsBar';
import Atelier from './playViews/Atelier';
import Auction from './playViews/Auction';
import Exhibition from './playViews/Exhibition';
import Gallery from './playViews/Gallery';
import Lobby from './playViews/Lobby';

export default function Play() {
  const [errorMessage, setErrorMessage] = useState('');
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [exhibitionTitle, setExhibitionTitle] = "";
  const [gameState, setGameState] = "";
  const [instructions, setInstructions] = "";
  const [playerNames, setPlayerNames] = [];
  const [numberOfRounds, setNumberOfRounds] = 0;




  const [game, setGame] = useState({});
  const [player, setPlayer] = useState({});

useEffect(() => {
  const { gameId, playerId, gameData, playerData } = getGameAndUser();

  setGame(gameData);
  setPlayer(playerData);

  gameData.players.forEach((player) => {
    setPlayerNames(prevPlayerNames => [...prevPlayerNames, player.name])
  });

  setExhibitionTitle(gameData.currentPlayer.exhibitionTitle);
  setNumberOfRounds(gameData.numberOfPlayers * gameData.numberOfImages);
}, [game, player]);



 //
 //
 //
 // async function getGameAndPlayer() {
 //   try {
 //     const response = await axios.get(
 //       'http://localhost:4000/play_game/game_and_player',
 //       {
 //         headers: {
 //           'Content-Type': 'application/json',
 //           gameId: gameId,
 //           playerId: playerId,
 //         },
 //       },
 //     );
 //
 //     const data = response.data;
 //     if (data.success === true) {
 //       setGame(data.game);
 //       setPlayer(data.player);
 //
 //       game.players.forEach((player) => {
 //          setPlayerNames(prevPlayerNames => [...prevPlayerNames, player.name])
 //       });
 //
 //       setExhibitionTitle(game.currentPlayer.exhibitionTitle)
 //
 //       setNumberOfRounds(game.numberOfPlayers * game.numberOfImages);
 //
 //     } else {
 //       setErrorMessage(
 //         'Something went wrong',
 //       );
 //       // push to join game
 //     }
 //     // Assuming the API returns a list of players and their readiness status
 //   } catch (error) {
 //     console.error(`Error: ${error}`);
 //     return false;
 //   }
 // }

 useEffect(() => {
  const client = new W3CWebSocket('ws://localhost:4000');

    client.onopen = () => {

      getGameAndPlayer()

      // sending
      client.send(
        JSON.stringify({
          type: 'WAITING_ROOM',
          gameId: gameId,
          playerId: playerId,
        })
      );

  };

  // receiving
  client.onmessage = (response) => {

     getGameAndPlayer();

    const dataFromServer = JSON.parse(response.data);

    if (dataFromServer.type == 'WAITING_ROOM') {
      if (dataFromServer.ready) {
        setReady(true);
        setPlayerNames(playerNames => [...playerNames, dataFromServer.playerName])
        setMessage(dataFromServer.message);
      } else {
        setReady(false)
        setMessage(dataFromServer.message);
      }
    }

    if (dataFromServer.type == 'UPDATE') {
      setGame(dataFromServer.game);
      setPlayer(dataFromServer.player);
    }

  };

  // Cleanup function
  return () => {
    client.close();
  };

  }, []);



  function cardSelected(playerId) {
    if (playerId == player.playerId) {
      player.score += 1;

      client.send(
        JSON.stringify({
          type: 'NEXT_ROUND',
          game: game,
          player: player,
        })
      );
    }
  }

  const [countdown60, setCountdown60] = useState(60);
  const [countdown30, setCountdown30] = useState(30);
  const [isActive60, setIsActive60] = useState(false);
  const [isActive30, setIsActive30] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive60 && countdown60 > 0) {
      timer = setInterval(() => {
        setCountdown60(countdown60 - 1);
      }, 1000);
    } else if (isActive60 && countdown60 === 0) {
      setIsActive60(false);
      handleStart30();
    }
    return () => clearInterval(timer);
  }, [isActive60, countdown60]);

  useEffect(() => {
    let timer;
    if (isActive30 && countdown30 > 0) {
      timer = setInterval(() => {
        if (countdown30 > 0) {
          setCountdown30(countdown30 - 1);
        } else {
          setIsActive30(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive30, countdown30]);


  const handleStart60 = () => {
    setIsActive60(true);
  };

  const handleStart30 = () => {
    setIsActive30(true);
  };


  const conditionGallery =
    player._id === game.players[game.currentExhibitionIndex]._id &&
    game.currentExhibitionDeck.length !== game.numbeOfPlayers;

  const conditionAtelier = ready === true &&
    player._id !== game.players[game.currentExhibitionIndex]._id &&
    countdown60 <= 60 &&
    countdown60 > 0 &&
    player.currentExhibitionDeck.length === 0;
  // activate whenever needed

  const conditionArchive =
    player._id !== game.players[game.currentExhibitionIndex]._id &&  countdown30 <= 30 && countdown30 > 0;

  const conditionLobby = ready === false;

  const conditionAuction =
    player._id === game.players[game.currentExhibitionIndex]._id &&
    game.currentExhibitionDeck.length === game.numbeOfPlayers;


  const conditionArtistBar = player._id !== game.players[game.currentExhibitionIndex]._id &&
    game.currentExhibitionDeck.length === game.numbeOfPlayers;

  const conditionExhibition = player._id === game.player.numbeOfPlayers;


  function renderBasedOnConditions() {
  if (conditionGallery) {
    setGameState("Gallery");
    setInstructions("Hello curator! This is your gallery... It's empty at the moment. Please wait for the artists to present their creations(or rather generations?).");
    return <Gallery player={playerNames} />;
  }
  else if (conditionAtelier) {
    setGameState("Atelier");
    setInstructions("Hello artist. Please generate an image for exhibition using original prompt.<br>Please, omit words from exhibition title.");
    return <Atelier handler={handleData} game={game} player={player} onStart60={handleStart60} />;
  } else if (conditionArchive) {
    setGameState("Archive");
    setInstructions("Great job! Now, please select an image you want to exhibit.");
    return <Archive handler={handleData} game={game} player={player} />;
  } else if (conditionLobby) {
    setGameState("Lobby");
    setInstructions("");
    return <Lobby player={playerNames}  />;
  } else if (conditionAuction) {
    setGameState("Auction");
    setInstructions("Your artist worked hard on their images. Now, it's time to select the best one. You are the curator after all.");
    return <Auction handler={handleData} game={game} player={player} />;
  } else if (conditionArtistBar) {
    setGameState("Artist Bar");
    setInstructions("Now it's time for break with a glass of wine. Please wait for the curator to select the best image. In the meantime you can compare your images with other artists.");
    return <ArtistsBar player={playerNames} />;
  } else if (conditionExhibition) {
    setGameState("Exhibition");
    setInstructions(game.winningPlayer + " is a winner! See also winning images of other players.");
    return <Exhibition handler={handleData} game={game} player={player} />; // all images and score
  } else {
    return null; // hcange to something else
  }
}


const mainView = renderBasedOnConditions();

  return (
    <div>
     <PlayerInfo score={player.score} exhibitionTitle={exhibitionTitle} username={player.name} />
      <StateInfo  gameState={gameState} instructions={instructions} />

      {mainView}

    <Message message={message} />
    <ErrorMessage errorMessage={errorMessage} />

    </div>

  );
}
