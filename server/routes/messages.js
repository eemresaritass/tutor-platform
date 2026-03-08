const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

// Get messages
router.get('/:conversation_id', authMiddleware, async (req, res) => {
  try {
    const messages = await db.manyOrNone(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [req.params.conversation_id]
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    db.run(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [req.user.id, receiver_id, content],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, sender_id: req.user.id, receiver_id, content });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
