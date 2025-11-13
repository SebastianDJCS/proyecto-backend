const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: String,
  platform: String,
  releaseDate: Date,
  rating: { type: Number, min: 0, max: 10, default: 0 },
  hoursPlayed: { type: Number, default: 0 },
  status: { type: String, enum: ['pendiente', 'jugando', 'completado'], default: 'pendiente' },
  coverImage: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
