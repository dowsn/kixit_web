import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const CardSchema = new Schema({
  _id: { type: String, required: true },
  prompt: { type: String, required: true },
  playerId: { type: String, required: true },
  path: { type: String, required: true },
});

export default mongoose.model('card', CardSchema);
