import Game from '../models/game.js';
import Player from '../models/player.js';

export async function getGame(req, res, next) {


  const gameId = req.headers['gameid']; // get gameId from the request headers
  console.log(gameId);
  try {
    const game = await Game.findOne({ _id: gameId });
     if (game) {
      req.game = game;
      next();
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving game: ' + error.message });
  }
}

export async function getPlayer(req, res, next) {


  const playerId = req.headers['playerid'];

  console.log(playerId);
  try {
   const player = await Player.findOne({ _id: playerId });
    if (player) {
      req.player = player;
      next();
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Error retrieving player: ' + error.message });
  }
}
