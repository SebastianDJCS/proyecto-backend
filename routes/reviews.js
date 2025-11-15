const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Obtener reseñas por gameId
router.get('/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear reseña
router.post('/', async (req, res) => {
  const review = new Review(req.body);
  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar reseña
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar reseña
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
