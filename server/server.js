import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { server as WebSocketServer } from 'websocket';
import connectDB from './config/db.js'; // to connect to db
import setupWebSocketServer from './helpers/websockets.js';
import apiRouter from './routes/apiRouter.js';
import playGameRouter from './routes/playGameRouter.js';
import startGameRouter from './routes/startGameRouter.js';

// Create Express server
const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());

connectDB();

app.use(express.json());

app.use('/start_game', startGameRouter);
app.use('/play_game', playGameRouter);
app.use('/api', apiRouter);

// Create HTTP server
const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

setupWebSocketServer(server);