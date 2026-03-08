const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const user = { id: this.lastID, name, email, role };
        res.status(201).json({ message: 'User registered successfully', user });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({ 
        token, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role } 
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
