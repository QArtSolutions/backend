require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userController = require('./infrastructure/controllers/userController');



const app = express();

// Logging middleware to check all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use cors middleware
app.use(cors());
app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


// Routes
app.use('/api/users', userController);


//Test
 app.use('/api/getusers', (req,res)=> {
     return res.status(200).json({
      message:'this got hit getuser'
     })
 });


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// test