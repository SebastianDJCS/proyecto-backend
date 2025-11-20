const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Obtener todas las reseñas con información del juego y usuario
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('gameId', 'title')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener reseñas por gameId (con populate de usuario)
router.get('/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear reseña (requiere auth)
router.post('/', auth, async (req, res) => {
  try {
    const reviewData = { ...req.body, userId: req.user._id };
    const review = new Review(reviewData);
    const newReview = await review.save();
    await newReview.populate('userId', 'username');
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar reseña (solo autor)
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });
    if (!review.userId.equals(req.user._id)) return res.status(403).json({ message: 'No autorizado' });

    ['title', 'content', 'rating'].forEach(field => {
      if (req.body[field] !== undefined) review[field] = req.body[field];
    });

    const updated = await review.save();
    await updated.populate('userId', 'username');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar reseña (solo autor)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });
    if (!review.userId.equals(req.user._id)) return res.status(403).json({ message: 'No autorizado' });

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
