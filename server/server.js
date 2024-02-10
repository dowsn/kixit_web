import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js'; // to connect to db
import gamesRouter from './routes/games.js';

// Create Express server
const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());

connectDB();


app.use(express.json());

app.use(gamesRouter);

// Get MongoDB driver connection

app.listen(port, () => {
  // Perform a database connection when server starts
  console.log(`Server is running on port: ${port}`);
});
