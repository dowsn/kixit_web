import React from 'react';
// We use Route in order to define the different routes of our application
import { Route, Routes } from 'react-router-dom';
import Create from './components/create';
import Edit from './components/edit';
import ExhibitionGenerator from './components/exhibitionGenerator';
import ImageGenerator from './components/imageGenerator';
// We import all the components we need in our app
import Navbar from './components/navbar';
import PlayerList from './components/playerList';

// require('dotenv').config();




const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route exact path="/" element={< SelectGame />} /> */}
        <Route exact path="/players" element={<PlayerList />} />
        <Route exact path="/exhibitions" element={<ExhibitionGenerator />} />
        <Route exact path="/image" element = {<ImageGenerator />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
};

export default App;
