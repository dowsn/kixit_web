import axios from 'axios';
import React, { useEffect, useState } from 'react';
// We use Route in order to define the different routes of our application
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Create from './components/create';
import Edit from './components/edit';
import ImageGenerator from './components/imageGenerator';
import JoinGame from './components/joinGame';
import NameArtworks from './components/nameArtworks';
// We import all the components we need in our app
import Navbar from './components/navbar';
import NewGame from './components/newGame';
import Play from './components/play';
import PlayerList from './components/playerList';
import WaitingRoom from './components/waitingRoom';
import WelcomeScreen from './components/welcomeScreen';


const App = () => {

  const [routes, setRoutes] = useState([]);
  const location = useLocation();


  const components = {
    NewGame,
    JoinGame,
    NameArtworks,
    WaitingRoom,
    Play,
    // Add more components as needed
  };


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const currentPath = location.pathname; // This is the current path

        const server = 'http://localhost:4000/';

        const response = await axios.get(`${server}api/routes`);

        setRoutes(response.data);
      } catch (error) {
        console.error('Failed to fetch routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div>
      <Navbar />
        <Routes>
          {routes.map((route) => {
            const Component = components[route.component];
            if (Component) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Component />}
                />
              );
            } else {
              console.error('Component not found:', route.component);
              return null;
            }
          })}
          <Route path="/" element={<WelcomeScreen />} />
        </Routes>
    </div>
  );
};

export default App;
