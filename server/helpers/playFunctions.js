import axios from 'axios';

export async function checkAllPlayersReady(gameId, playerId) {

  try {
    const response = await axios.get(
      'http://localhost:4000/play_game/waiting_room',
      {
        headers: {
          'Content-Type': 'application/json',
          'gameId': gameId,
          'playerId': playerId,
        },
      },
    );

    const data = response.data;
    console.log(data);

    // Assuming the API returns a list of players and their readiness status
    return data.success;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
}
