async function addPlayer(username) {
  const newPlayer = new Player({
    name: username,
    score: 0,
    cards: [],
  });

  try {
    const savedPlayer = await newPlayer.save();
    console.log('Player saved:', savedPlayer);
  } catch (error) {
    console.log('Error saving player:', error);
  }
}
