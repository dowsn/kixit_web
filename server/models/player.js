import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  score: { type: Number, default: 0 },
  exhibitionTitle: { type: String, default: '' },
  artworkTitles: { type: Array, default: [] },
  cartDeck: { type: Array, default: [] },
  gameId: { type: String, required: true },
});

PlayerSchema.statics.updatePlayer = async function (updatedPlayer) {
  return await this.findOneAndUpdate({ _id: updatedPlayer._id }, updatedPlayer, {
    upsert: false,
    new: true,
    runValidators: true,
  });
};


export default mongoose.model('player', PlayerSchema);
