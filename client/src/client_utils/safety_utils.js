import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const fetchGameData = async (gameId, playerId) => {
  try {
    const response = await axios.get(
      'http://localhost:4000/play_game/game_and_player',
      {
        headers: {
          'Content-Type': 'application/json',
          gameId: gameId,
          playerId: playerId,
        },
      },
    );

    const data = response.data;
    if (data.success === true) {
      return data;
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
};

export function getGameAndUser() {
  const navigation = useNavigate();
  const gameId = localStorage.getItem('gameId');
  const playerId = localStorage.getItem('playerId');


  if (!gameId || !playerId) {
    navigation.navigate('NewGame');
  } else {
    fetchGameData(gameId, playerId)
        .then((data) => {
          return {gameData: data.game, playerData: data.player};
        })
        .catch((error) => {
          console.error(`Error: ${error}`);
        });


  }
}

export async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return await response.json();
}
