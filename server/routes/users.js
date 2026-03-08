const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, bio, hourly_rate FROM users WHERE role = $1', ['teacher']);
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, bio, hourly_rate FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, bio, hourly_rate } = req.body;
    await db.query(
      'UPDATE users SET name = $1, bio = $2, hourly_rate = $3 WHERE id = $4',
      [name, bio, hourly_rate, req.params.id]
    );
    const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
