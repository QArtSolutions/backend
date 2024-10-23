const express = require('express');
const { registerUser } = require('../../application/services/userService');
const router = express.Router();

// POST /register - Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await registerUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
