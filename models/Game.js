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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Índice compuesto para optimizar consultas por usuario
gameSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Game', gameSchema);
