const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT b.*, l.subject, u.name as teacher_name FROM bookings b JOIN lessons l ON b.lesson_id = l.id JOIN users u ON l.teacher_id = u.id WHERE b.student_id = $1 ORDER BY b.scheduled_date DESC',
      [req.user.id]
    );
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { lesson_id, scheduled_date } = req.body;
    const result = await db.query(
      'INSERT INTO bookings (student_id, lesson_id, scheduled_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, lesson_id, scheduled_date, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
