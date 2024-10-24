const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userController = require('./infrastructure/controllers/userController');
require('dotenv').config();

const app = express();

// Logging middleware to check all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use cors middleware
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userController);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
