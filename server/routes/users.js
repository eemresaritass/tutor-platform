const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    db.all('SELECT id, name, bio, hourly_rate FROM users WHERE role = ?', ['teacher'], (err, teachers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(teachers || []);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    db.get('SELECT id, name, email, role, bio, hourly_rate FROM users WHERE id = ?', [req.params.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, bio, hourly_rate } = req.body;
    db.run(
      'UPDATE users SET name = ?, bio = ?, hourly_rate = ? WHERE id = ?',
      [name, bio, hourly_rate, req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.get('SELECT id, name, email, role FROM users WHERE id = ?', [req.params.id], (err, user) => {
          res.json(user);
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
