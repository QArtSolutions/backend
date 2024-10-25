const express = require('express');
const { registerUser } = require('../../application/services/userService');
const router = express.Router();

// POST /register - Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (password.length < 7) {
    return res.status(400).json({ message: 'Password must be at least 7 characters long.' });
  }
  const usernamePattern = /^[a-zA-Z0-9 ]+$/;
  if (!usernamePattern.test(username)) {
    return res.status(400).json({ message: 'Username can only contain letters, numbers, and spaces.' });
  }
  try {
    const user = await registerUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
