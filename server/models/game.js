import mongoose from 'mongoose';

// use ids instead of indexes

const Schema = mongoose.Schema;
const GameSchema = new Schema({
  identifier: String,
  steps: [Step],
  currentStep: Number,
});

export default mongoose.model('game', GameSchema);
