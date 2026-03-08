const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    db.all('SELECT * FROM lessons ORDER BY created_at DESC', (err, lessons) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(lessons || []);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get lessons by teacher
router.get('/teacher/:teacher_id', async (req, res) => {
  try {
    db.all('SELECT * FROM lessons WHERE teacher_id = ? ORDER BY created_at DESC', [req.params.teacher_id], (err, lessons) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(lessons || []);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create lesson
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, level, description, hourly_rate } = req.body;
    const lesson = await db.one(
      'INSERT INTO lessons (teacher_id, subject, level, description, hourly_rate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, subject, level, description, hourly_rate]
    );
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
