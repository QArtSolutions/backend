const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/database'); // Adjust path as needed

// Define UserHistory model
const UserHistory = sequelize.define('UserHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // Name of the referenced table (make sure it matches your actual table name)
      key: 'id',
    },
  },
  searched_brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  search_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'user_history', // Table name in your database
  timestamps: false, // No automatic `createdAt` and `updatedAt`
});

// Sync with PostgreSQL database
UserHistory.sync({ alter: true })
  .then(() => {
    console.log('UserHistory table created successfully.');
  })
  .catch((error) => {
    console.error('Error creating UserHistory table:', error);
  });

module.exports = UserHistory;
