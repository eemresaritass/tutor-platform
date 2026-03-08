const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get reviews for a teacher
router.get('/teacher/:teacher_id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT r.*, u.name as student_name FROM reviews r JOIN users u ON r.student_id = u.id WHERE r.teacher_id = $1 ORDER BY r.created_at DESC',
      [req.params.teacher_id]
    );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { teacher_id, rating, comment } = req.body;
    const result = await db.query(
      'INSERT INTO reviews (student_id, teacher_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, teacher_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
