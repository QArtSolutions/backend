const express = require('express');
const { registerUser } = require('../../application/services/userService');
const { loginUser } = require('../../application/services/userService');
const router = express.Router();
const userHistory  = require('../../domain/entities/userHistory_model.js');


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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password); 

    res.status(200).json({ success: true, user });

  } catch (error) {
   
    if (error.message === 'User not found') {
      res.status(404).json({ success: false, message: 'User not found' });
    } else if (error.message === 'Incorrect password') {
      res.status(401).json({ success: false, message: 'Incorrect password' });
    } else {
      // General server error
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});


router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Backend is working!' });
});


router.post('/search-history', async (req, res) => {
  const { userId, searchedBrand } = req.body;
  console.log(req.body);
  try {
    await userHistory.create({
      user_id: userId,
      searched_brand: searchedBrand,
    });
    res.status(201).json({ message: 'Search history recorded successfully' });
  } catch (error) {
    console.error('Error recording search history:', error);
    res.status(500).json({ error: 'Failed to record search history' });
  }
});


module.exports = router;
