import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleResponse } from '../client_utils/safety_utils';
import { checkOneName, useTimeoutOverlay } from '../client_utils/text_utils';

export default function NewGame() {

  const navigate = useNavigate();

  const [gameId, setGameId] = useState('');
  const [username, setUsername] = useState('');
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');

  // const { showOverlay, text } = useTimeoutOverlay(
  //   true,
  //   'Welcome galerist',
  // );

  async function createNewGame(e) {
    e.preventDefault();

    if (checkOneName(username) !== null) {
      setErrorMessage('Username is misssing or invalid');
      setTimeout(() => {
        setMessage('');
      }, 2000);
      return;
    }

try {
  const response = await fetch(
    `http://localhost:4000/start_game/new_game/${username}/${numberOfPlayers}/${numberOfImages}`,
  );
  const data = await handleResponse(response, 'Something went wrong');
  localStorage.setItem('gameId', data.gameId);
  localStorage.setItem('playerId', data.playerId);
  setGameId(data.gameId);
  setMessage(
    'Success! Your game was created. Share this code with your friends: ' +
      data.gameId,
  );
} catch (error) {
  setError(error.message);
}
    // go to some waiting room for the game
    // navigate('/name_artworks'); // probably some parameter here

  }

  return (
    <div>

      {gameId === '' && (
        <form>
          <input
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <br /><br />
          <label value="">Select number of players</label>
          <select
            value={numberOfPlayers}
            onChange={(event) => setNumberOfPlayers(event.target.value)}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          <br /><br />
          <label>Number of images per player</label>
          <select
            value={numberOfImages}
            onChange={(event) => setNumberOfImages(event.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
            <br /><br />
          <button type="submit" onClick={createNewGame}>
            Create New Game
          </button>
          <div className="error">{errorMessage}</div>
          <div className="error">{error}</div>
        </form>
      )}

      {gameId !== '' && (
        <div>
          <p></p>
          <div className="message">{message}</div>
          <Link to="/name_artworks">
            <button>Next</button>
          </Link>
        </div>
      )}
    </div>
  );
}
