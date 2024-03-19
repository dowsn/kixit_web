import mongoose from 'mongoose';

// use ids instead of indexes
const Schema = mongoose.Schema;
const GameSchema = new Schema({
  _id: { type: String, required: true },
  players: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
  currentExhibitionIndex: { type: Number, default: 0 },
  currentImageIndex: { type: Number, default: 0 },
  currentExhibitionDeck: { type: Array, default: [] },
  gallery: { type: Array, default: [] },
  numberOfPlayers: { type: Number, default: 0 },
  numberOfImages: { type: Number, default: 0 },
  winningPlayer: { type: String, default: '' },
  round: { type: Number, default: 1 },
});

GameSchema.statics.updateGame = async function (updatedGame) {
  return await this.findOneAndUpdate({ _id: updatedGame._id }, updatedGame, {
    upsert: false,
    new: true,
    runValidators: true,
  });
}


export default mongoose.model('Game', GameSchema);
