import React from 'react';

const Lobby = ({ players }) => {
  return (
    <ul>
      {players.map((player, index) => (
        <li key={index}>{player.name}</li> // Assuming each player object has a 'name' property
      ))}
    </ul>
  );
}

export default Lobby;