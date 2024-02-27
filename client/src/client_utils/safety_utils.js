import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCheckGameAndUser() {
  const navigation = useNavigate();
  const gameId = localStorage.getItem('gameId');
  const playerId = localStorage.getItem('playerId');

  useEffect(() => {
    if (!gameId || !playerId) {
      navigation.navigate('NewGame');
    }
  }, []);

  return { gameId, playerId };
}

export async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return await response.json();
}
