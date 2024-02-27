import axios from 'axios';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';

const apiRouter = express.Router();



apiRouter.route('/routes').get(async (req, res) => {


  res.json([
    {
      path: '/new_game',
      component: 'NewGame',
    },

    {
      path: '/join_game',
      component: 'JoinGame',
    },

    {
      path: '/name_artworks',
      component: 'NameArtworks',
    },
    {
      path: '/play',
      component: 'Play',
    }



    // {
    //   path: '/player_list',
    //   component: 'PlayerList',
    // },
  ]);


});


export default apiRouter;
