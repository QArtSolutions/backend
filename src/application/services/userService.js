const bcrypt = require('bcrypt');
const User = require('../../domain/entities/user_model');

// Register a new user
async function registerUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw new Error('User registration failed.');
  }
}

module.exports = {
  registerUser,
};
