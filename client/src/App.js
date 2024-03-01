import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {  Route, Routes, useLocation } from 'react-router-dom';
import JoinGame from './components/joinGame';
import NameArtworks from './components/nameArtworks';
import Navbar from './components/navbar';
import NewGame from './components/newGame';
import Play from './components/play';
import WelcomeScreen from './components/welcomeScreen';


const App = () => {

  const [routes, setRoutes] = useState([]);
  const location = useLocation();


  const components = {
    NewGame,
    JoinGame,
    NameArtworks,
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
