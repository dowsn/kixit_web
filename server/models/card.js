import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const CardSchema = new Schema({
  prompt: String,
  path: String,
});

export default mongoose.model('card', CardSchema);
