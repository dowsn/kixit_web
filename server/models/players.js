import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
  username: String,
  score: Number,
  exhibitionTitle: String,
  ArtworkTitle: String,
  cartDeck: [Card],
  currentCardIndex: Card,
});

export default mongoose.model('player', PlayerSchema);
