const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// PostgreSQL connection details with SSL enabled
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  logging: false,  // Disable SQL query logging
  dialectOptions: {
    ssl: {
      require: true,                // Enforce SSL
      rejectUnauthorized: false     // For development, accept self-signed certificates
    }
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
