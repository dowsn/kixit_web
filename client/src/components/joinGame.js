import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleResponse } from '../client_utils/safety_utils';
import { checkOneName } from '../client_utils/text_utils';

export default function JoinGame() {
  const [gameId, setGameId] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();
    // check if id ok

let missingFields = [];

if (checkOneName(username) !== null) {
  missingFields.push('Username');
}

if (checkOneName(gameId) !== null) {
  missingFields.push('Game ID');
}

if (missingFields.length > 0) {
  setErrorMessage(`${missingFields.join(' and ')} is missing or invalid`);
  setTimeout(() => {
    setMessage('');
  }, 2000);
  return;
}


  try {
  const response = await fetch(`http://localhost:4000/start_game/join_game/${gameId}/${username}`);
  const data = await handleResponse(response, 'Something went wrong. Please try again.');

  setMessage('Success!');
  localStorage.setItem('gameId', data.gameId);
  setGameId(data.gameId);
  localStorage.setItem('playerId', data.playerId);
} catch (error) {
  setErrorMessage(error.message);

  setTimeout(() => {
    setErrorMessage('');
  }, 2000);
}

    // waiting room for the game
    // navigate('/' + gameId);

  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      {message === '' && (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={gameId}
              placeholder="Enter the game ID"
              onChange={(event) => setGameId(event.target.value)}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <br />

            <button type="submit">Submit</button>
          </form>
          <div className='error'>{errorMessage}</div>
        </div>
      )}

      {message !== '' && (
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
