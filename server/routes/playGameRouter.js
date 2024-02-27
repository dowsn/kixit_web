import axios from 'axios';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import openaiController from '../controllers/openaiController.js';
import { getGame, getPlayer } from '../helpers/middleware.js';
import { randomString } from '../helpers/utilities.js';
import { connections } from '../helpers/websockets.js';
import game from '../models/game.js';
import Game from '../models/game.js'; // adjust the path to match the location of your Game.js file
import Player from '../models/player.js'; // adjust the path to match the location of your Player.js file

// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const playGameRouter = express.Router();

playGameRouter.use(getGame, getPlayer);

playGameRouter.route('/game_and_player').get(async (req, res) => {
  const player = req.player;
  const game = req.game;

  const currentPlayerId = game.players[game.currentExhibitionIndex];

  const currentPlayer = await Player.findOne({ _id: currentPlayerId });


  if (game && player) {
    res
      .status(200)
      .json({ success: true, player, game, currentPlayer });
  } else {
    res.status(200).json({ success: false });
  }
});

playGameRouter.route('/exhibition_title').get(async (req, res) => {
  const player = req.player;

  if (player.exhibitionTitle) {
    res.status(200).json({ success: true, exhibitionTitle: player.exhibitionTitle });
  } else {
    res.status(200).json({ success: false });
  }
});

playGameRouter.route('/waiting_room').get(async (req, res) => {
  const game = req.game;
  console.log('size' + connections.size);
  console.log('number of players' + game.numberOfPlayers);

if (Number(game.numberOfPlayers) === Number(connections.size)) {
  res.status(200).json({ success: true });
} else {
  res.status(200).json({ success: false });
}
});

playGameRouter.route('/name_artworks').post(async (req, res) => {

  let player = req.player;

  const { names } = req.body;

   player.artworkTitles = names;

try {
  await Player.updatePlayer(player._id, player);
  res.status(200).json({ message: 'Artwork names saved' });
} catch (error) {
  res.status(500).json({ message: 'Error saving artwork names: ' + error.message });
}
});


playGameRouter.route('/getImages').get(async (req, res) => {
    const prompt = 'love';

    // Now you can use the prompt to generate images
    const images = await openaiController.generateImages(prompt);
});


playGameRouter.route('/getImages').post(async (req, res) => {

   const prompt = req.body.prompt;


   // Now you can use the prompt to generate images
  const images = await openaiController.generateImages(prompt);
  console.log(images);

   res.json({ images });
});

playGameRouter.route('/downloadImage').get(async (req, res) => {
  const image = req.body.image;
  const filename = req.body.filename;

  const data = image.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFile(`./images/${filename}`, data, { encoding: 'base64' }, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    res.json('Image downloaded');
  });
});







// Delete a record
playGameRouter.route('/:id').delete(async (req, res) => {

  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);
    res.json(deletedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default playGameRouter;
