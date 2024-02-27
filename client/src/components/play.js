import axios from 'axios';
import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {
  handleResponse,
  useCheckGameAndUser,
} from '../client_utils/safety_utils';
import { checkOneName } from '../client_utils/text_utils';

export default function Play() {
  const [errorMessage, setErrorMessage] = useState('');
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [exhibitionTitle, setExhibitionTitle] = "";
  const [gameState, setGameState] = "";
  const [instructions, setInstructions] = "";


  const { gameId, playerId } = useCheckGameAndUser();

    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});



  useEffect(() => {

 async function getGameAndPlayer() {
   try {
     const response = await axios.get(
       'http://localhost:4000/play_game/game_and_player',
       {
         headers: {
           'Content-Type': 'application/json',
           gameId: gameId,
           playerId: playerId,
         },
       },
     );

     const data = response.data;
     if (data.success === true) {
       setGame(data.game);
       setPlayer(data.player)
       setExhibitionTitle(data.currentPlayer.exhibitionTitle)
     } else {
       setErrorMessage(
         'Something went wrong',
       );
       // push to join game
     }
     // Assuming the API returns a list of players and their readiness status
   } catch (error) {
     console.error(`Error: ${error}`);
     return false;
   }
 }


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
        setMessage(dataFromServer.message);
      } else {
        setReady(false)
        setMessage(dataFromServer.message);
      }
    }

  };

  // Cleanup function
  return () => {
    client.close();
  };


  });

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
      setCountdown60(60);
      setIsActive60(false);
    }
    return () => clearInterval(timer);
  }, [isActive60, countdown60]);

  useEffect(() => {
    let timer;
    if (isActive30 && countdown30 > 0) {
      timer = setInterval(() => {
        setCountdown30(countdown30 - 1);
      }, 1000);
    } else if (isActive30 && countdown30 === 0) {
      setCountdown30(30);
      setIsActive30(false);
    }
    return () => clearInterval(timer);
  }, [isActive30, countdown30]);

  const handleStart60 = () => {
    setIsActive60(true);
  };

  const handleStart30 = () => {
    setIsActive30(true);
  };

// Define your conditions
const conditionCardGeneration = playerId != game.players[game.currentExhibitionIndex] && player.currentDeck.count == 0 && $timeout1 > 0;
const conditionCardDeck = playerId != game.players[game.currentExhibitionIndex] && $timeout1 == 60;
const conditionWaitingRoom = playerId == game.players[game.currentExhibitionIndex] && game.currentExhibitionDeck.length != game.numbeOfPlayers;
const conditionCardSelection = playerId == game.players[game.currentExhibitionIndex] && game.currentExhibitionDeck.length === game.numbeOfPlayers;
const conditionWinningTable = playerId != game.players[game.currentExhibitionIndex] && $timeout1 == 0;

// Define your function
function renderBasedOnConditions() {
  if (conditionCardGeneration) {
    setGameState("Card Generation");
    setInstructions("Please wait for the other players to put their cards");
    return <div>Card Generation</div>;
  } else if (conditionCardDeck) {
    setGameState("Card Deck");
    setInstructions("Please select a card from your deck");
    return <div>Card Deck</div>;
  } else if (conditionWaitingRoom) {
    setGameState("Waiting Room");
    setInstructions("Please wait for the other players to put their cards");
    return <div>Waiting Room</div>;
  } else if (conditionCardSelection) {
    setGameState("Card Selection");
    setInstructions("Please select a card from the table");
    return <div>Card Selection</div>;
  } else if (conditionWinningTable) {
    setGameState("Winning Table");
    setInstructions(game.winningPlayer + " is a winner!");
    return <div>Winning Table</div>;
  } else {
    return null;
  }
}

       {timeout1 != 0 && (<div className="timeout1">{timeout1}</div>)}
      {timeout2 == 0 && (<div className="timeout2">{timeout2}</div>)}

const mainView = renderBasedOnConditions();


  useEffect(() => {
    if (conditionCardGeneration) {
      handleStart60();
    }
  }, [playerId, game, player, $timeout1]);



  // This following section will display the table with the records of individuals.
  return (
    <div>
     <PlayerInfo exhibitionTitle={currentState} score={player.score} username={player.name} />
     <StateInfo exhibitionTitle={currentState} gameState={gameState} instructions={instructions} />


      <div className="timeout2">{timeout2}</div>


      {ready === false && (
        <div>
          <ul>
            <li></li>
          </ul>
          <div className="message">{message}</div>
        </div>
      )}

      {playerId == game.players[game.currentExhibitionIndex] &&
        game.currentExhibitionDeck.length != game.numbeOfPlayers && (
          <div>Waiting for other players to put their cards</div>
        )}

      {playerId == game.players[game.currentExhibitionIndex] &&
        game.currentExhibitionDeck.length === game.numbeOfPlayers && (
        game.currentExhibitionDeck.map((card) => {
            return <div class="card"><img player={card.playerId} src={card.url} alt={card.prompt}><button class="selectCard" onClick={cardSelected({card.playerId})}>Select</button></div>
        })

        {playerId != game.players[game.currentExhibitionIndex] && player.currentDeck.count == 0 && $timeout1 > 0 {

            <div>
      Countdown 60: {countdown60}
      <button onClick={handleStart60}>Start 60s Countdown</button>
      <br/>

        // generate image + countdown
        // say added

        // timeout 2 and full game
      }

            {playerId != game.players[game.currentExhibitionIndex] && $timeout1 == 60 {
        // generate image + countdown
   Countdown 30: {countdown30}
      <button onClick={handleStart30}>Start 30s Countdown</button>
    </div>
        }
    <Message message={message} />
     <Error errorMessage={errorMessage} />

    </div>

  );
}
