import {useState} from "react";
import axios from 'axios';

export default function Auction() {
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    const cardSelected = async(playerId) => {

        // here I do all stuff and then send back to update

        // update player score playerId + 1 and save the card

        for (let card in game.currentExhibitionDeck) {

            if (card.playerId == playerId) {
                // update


                // putting to gallery
                game.gallery.push(card);

                try {
                    const response = await axios.get(
                        'http://localhost:4000/play_game/moveImageToGallery',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                gameId: game._id,
                                playerId: playerId,
                                path: card.path
                            },
                        },
                    );

                    const data = response.data;
                    if (data.success === true) {
                        console.log(data);
                    }

                } catch (error) {
                    console.error(`Error: ${error}`);
                }

                // update player score
                game.players.find(player => player._id == playerId).score += 1;


            }
        }


        // move to next round gameCurrentRound + 1

        game.currentExhibitionDeck = [];


        try {
            const response = await axios.get(
                'http://localhost:4000/play_game/deleteImages',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        gameId: game._id,
                        playerId: playerId,
                    },
                },
            );

            const data = response.data;
            if (data.success === true) {
                console.log(data);
            }

        } catch (error) {
            console.error(`Error: ${error}`);
        }



        let currentPlayerIndex = game.currentExhibitionIndex
        let maxPlayerIndex = game.numberOfPlayers - 1;
        let maxImageIndex = game.numberOfImages - 1;

        if(currentPlayerIndex == maxPlayerIndex) {
            game.currentImageIndex += 1;
            if(game.currentImageIndex == maxImageIndex) {
                // end game
                game.winningPlayer = game.players.reduce((highestScoringPlayer, player) => {
                    return (player.score > highestScoringPlayer.score) ? player : highestScoringPlayer;
                }, game.players[0]);

                return game;
            }
        }

        game.round += 1;

        game.currentImageIndex = (currentPlayerIndex + 1) % game.numberOfPlayers;

        return game;
        // update game

    }


    return (
        <div>
            {game.currentExhibitionDeck.map((card) => {
                return (
                    <div className="card" key={card.playerId}>
                        <img player={card.playerId} src={card.url} alt={card.prompt}/>
                        <button className="selectCard" onClick={() => cardSelected(card.playerId)}>Select</button>
                    </div>
                )
            })}
        </div>
    );


}
