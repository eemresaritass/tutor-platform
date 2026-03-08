const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    db.all(
      'SELECT b.*, l.subject, u.name as teacher_name FROM bookings b JOIN lessons l ON b.lesson_id = l.id JOIN users u ON l.teacher_id = u.id WHERE b.student_id = ? ORDER BY b.scheduled_date DESC',
      [req.user.id],
      (err, bookings) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(bookings || []);
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { lesson_id, scheduled_date } = req.body;
    const booking = await db.one(
      'INSERT INTO bookings (student_id, lesson_id, scheduled_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, lesson_id, scheduled_date, 'pending']
    );
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
