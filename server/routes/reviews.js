const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get reviews for a teacher
router.get('/teacher/:teacher_id', async (req, res) => {
  try {
    db.all(
      'SELECT r.*, u.name as student_name FROM reviews r JOIN users u ON r.student_id = u.id WHERE r.teacher_id = ? ORDER BY r.created_at DESC',
      [req.params.teacher_id],
      (err, reviews) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(reviews || []);
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { teacher_id, rating, comment } = req.body;
    const review = await db.one(
      'INSERT INTO reviews (student_id, teacher_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, teacher_id, rating, comment]
    );
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
