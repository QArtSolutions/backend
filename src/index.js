const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./infrastructure/controllers/userController');
require('dotenv').config();
const cors = require('cors');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// Routes
app.use('/api/users', userController);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// test