const express = require('express');
const { registerUser } = require('../../application/services/userService');
const { loginUser } = require('../../application/services/userService');
const router = express.Router();
const userHistory  = require('../../domain/entities/userHistory_model.js');
const User = require('../../domain/entities/user_model'); 
const UserPreferences = require('../../domain/entities/userPreferences_model');



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



router.post('/save-preferences', async (req, res) => {
  const { userId, company, industry, competitors } = req.body;

  if (!userId || !company || !industry || !competitors) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [preferences, created] = await UserPreferences.upsert({
      user_id: userId,
      company,
      industry,
      competitors: JSON.stringify(competitors), // Save competitors as a JSON string
    });

    res.status(200).json({ message: 'Preferences saved successfully', preferences });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Failed to save preferences' });
  }
});

// POST /api/users/get-preferences - Retrieve user preferences
router.post('/get-preferences', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const preferences = await UserPreferences.findOne({ where: { user_id: userId } });

    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    res.status(200).json({
      company: preferences.company,
      industry: preferences.industry,
      competitors: JSON.parse(preferences.competitors),
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Failed to fetch preferences' });
  }
});

// API to fetch user details by userId
router.post('/details', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch user details from the database
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['username', 'email'], // Only fetch username and email
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/search-history', async (req, res) => {
  const { userId, searchedBrand } = req.body;
  console.log(req.body);
  try {
    // Check if the user has already searched for the brand
    const existingRecord = await userHistory.findOne({
      where: {
        user_id: userId,
        searched_brand: searchedBrand
      }
    });

    if (existingRecord) {
      // If the brand exists in the user's search history, update the timestamp
      await userHistory.update(
        { created_at: new Date() }, // Update the timestamp
        {
          where: {
            user_id: userId,
            searched_brand: searchedBrand
          }
        }
      );
      res.status(200).json({ message: 'Search history updated successfully' });
    } else {
      // If the brand does not exist, create a new record
      await userHistory.create({
        user_id: userId,
        searched_brand: searchedBrand,
      });
      res.status(201).json({ message: 'Search history recorded successfully' });
    }
    
  } catch (error) {
    console.error('Error recording search history:', error);
    res.status(500).json({ error: 'Failed to record search history' });
  }
});

router.post('/search-history_user', async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.body;

  try {
    // Fetch search history using Sequelize
    const history = await userHistory.findAll({
      where: {
        user_id: userId
      },
      attributes: ['searched_brand'],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });

    if (history.length === 0) {
      return res.status(404).json({ message: 'No search history found for this user.' });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Failed to fetch search history' });
  }
});


module.exports = router;
