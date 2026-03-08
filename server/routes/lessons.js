const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM lessons ORDER BY created_at DESC');
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get lessons by teacher
router.get('/teacher/:teacher_id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM lessons WHERE teacher_id = $1 ORDER BY created_at DESC', [req.params.teacher_id]);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create lesson
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, level, description, hourly_rate } = req.body;
    const result = await db.query(
      'INSERT INTO lessons (teacher_id, subject, level, description, hourly_rate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, subject, level, description, hourly_rate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
