import {useState} from "react";

export default function Auction() {
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    const cardSelected = (playerId) => {

        // here I do all stuff and then send back to update

        // update player score playerId + 1

        // move to next round gameCurrentRound + 1

        game.currentExhibitionDeck = [];

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

        game.currentImageIndex = (currentPlayerIndex + 1) % numberOfPlayers;

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
