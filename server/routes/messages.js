const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get messages between two users
router.get('/:other_user_id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
      [req.user.id, req.params.other_user_id, req.params.other_user_id, req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [req.user.id, receiver_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
