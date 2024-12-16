const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/database/database');

const UserPreferences = sequelize.define('UserPreferences', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  competitors: {
    type: DataTypes.TEXT, // JSON string for competitors
    allowNull: false,
  },
});

UserPreferences.sync({ alter: true })
  .then(() => console.log('UserPreferences table created successfully'))
  .catch((error) => console.error('Error creating preferences table:', error));

module.exports = UserPreferences;
