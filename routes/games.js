const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/auth');

// Obtener todos los juegos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un juego por ID (solo del usuario autenticado)
router.get('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.id, userId: req.user._id });
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un juego (requiere autenticación)
router.post('/', auth, async (req, res) => {
  try {
    const gameData = { ...req.body, userId: req.user._id };
    const game = new Game(gameData);
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un juego (solo del usuario autenticado)
router.put('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un juego (solo del usuario autenticado)
router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json({ message: 'Juego eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
