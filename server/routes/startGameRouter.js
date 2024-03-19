import axios from 'axios';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import openaiController from '../controllers/openaiController.js';
import { randomString } from '../helpers/utilities.js';
import game from '../models/game.js';
import Game from '../models/game.js'; // adjust the path to match the location of your Game.js file
import Player from '../models/player.js';
import playGameRouter from "./playGameRouter.js"; // adjust the path to match the location of your Player.js file

// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const startGameRouter = express.Router();


startGameRouter.route('/getImages').get(async (req, res) => {

  const prompt = "love";


  // Now you can use the prompt to generate images
  try {
    const images = await openaiController.generateImages(prompt);
    console.log(images);
    res.json({ images });
  } catch (error) {
    res.status(500).json({ message: 'Error generating images' + error.message });

  }

});

startGameRouter.route('/new_game/:username/:numberofplayers/:numberofimages').get(async (req, res) => {
  //  res.status(200).json({ gameId: '12wwj3', playerId: '456' });
  const gameId = randomString();
  const playerId = randomString();
  const { username, numberofplayers, numberofimages } = req.params;

  const newPlayer = new Player({
    _id: playerId,
    gameId: gameId,
    username,
  });

  const newGame = new Game({
    _id: gameId,
    players: [newPlayer],
    numberOfPlayers: numberofplayers,
    numberOfImages: numberofimages
  });


  try {
    newPlayer.exhibitionTitle =
        await openaiController.generateExhibitionTitle();


    // Save the game and player to the database
    await Promise.all([newGame.save(), newPlayer.save()]);
    return res.status(200).json({ gameId, playerId});
  } catch (error) {
  if (error.message === 'Error generating exhibition title') {
    res.status(500).json({ message: 'Error generating exhibition title' });
  } else {
    res
      .status(500)
      .json({ message: 'Error making new game: ' + error.message });
  }
  }
});


startGameRouter.route('/join_game/:gameId/:username').get(async (req, res) => {

  const username = req.params.username;
  const gameId = req.params.gameId;

  const game = await Game.findById(gameId);

  if (game) {

    try {
      // Save the game and player to the database

      const playerId = randomString();

      const newPlayer = new Player({
        _id: playerId,
        gameId: gameId,
        username
      });

      await newPlayer.save();

      await Game.findOneAndUpdate(
        { _id: gameId },
        {
          $push: { players: newPlayer },
        },
        { new: true },
      );

      res.status(200).json({ gameId, playerId });
    } catch (error) {

      if (error.message === 'Error generating exhibition title') {
        res.status(500).json({ message: 'Error generating exhibition title' });
      } else {
        res
          .status(500)
          .json({ message: 'Error making new game: ' + error.message });
      }
    }
  } else {
    res.status(404).json({ message: 'Game not found' });
  }

});



// FINISH THIS ROUTE

startGameRouter.route('/load_game/:id/:username').get(async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});





export default startGameRouter;
