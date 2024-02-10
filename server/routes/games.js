import axios from 'axios';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import openaiController from '../controllers/openai.js';

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const gamesRouter = express.Router();

const Game = mongoose.model('Game', new mongoose.Schema({}), 'games');

const Record = mongoose.model(
  'Record',
  new mongoose.Schema({
    name: String,
    position: String,
    level: String,
  }),
  'records',
);

// This section will help you get a list of all the records.
// gamesRouter.route('/').get(async function (req, res) {
//   try {
//     const games = await Game.find({});
//     res.json(games);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

gamesRouter.route('/record').get(async (req, res) => {
  try {
    const records = await Record.find({});
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Get a single record by id
gamesRouter.route('/record/:id').get(async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

gamesRouter.route('/game/:id').get(async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

gamesRouter.route('/getImages').get(async (req, res) => {
    const prompt = 'love';

    // Now you can use the prompt to generate images
    const images = await openaiController.generateImages(prompt);
});


gamesRouter.route('/getImages').post(async (req, res) => {

   const prompt = req.body.prompt;


   // Now you can use the prompt to generate images
  const images = await openaiController.generateImages(prompt);
  console.log(images);

   res.json({ images });
});

gamesRouter.route('/downloadImage').get(async (req, res) => {
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

gamesRouter.route('/exhibitions').get(async (req, res) => {
  var exhibitions = [];
  var numberOfPlayers = 2;

  for (var i = 0; i < numberOfPlayers; i++) {
    openaiController.setSystemPrompt(
      'You are an experienced galerist and you want to open a new exhibition.',
    );
    openaiController.setUserPrompt('Give me an original title for exhibition');

    try {
      var response = await openaiController.simpleChat();
      exhibitions.push({ name: response });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
      return; // Stop execution if there's an error
    }
  }

  res.json(exhibitions); // Send the exhibitions array, not response
});


// Create a new record
gamesRouter.route('/record/add').post(async (req, res) => {
  try {
    const newRecord = new Record({
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    });
    const record = await newRecord.save();
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update a record by id
gamesRouter.route('/update/:id').post(async (req, res) => {
  try {
    const updatedRecord = await Record.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    }, { new: true });
    res.json(updatedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a record
gamesRouter.route('/:id').delete(async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);
    res.json(deletedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default gamesRouter;
