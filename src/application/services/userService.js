const bcrypt = require('bcrypt');
const User = require('../../domain/entities/user_model');

// Register a new user
async function registerUser(username, email, password) {
  const userWithEmail = await User.findOne({ where: { email: email } });
  if (userWithEmail) {
    throw new Error('User with this email already exists.');
  }
  const userWithUsername = await User.findOne({ where: { username: username } });
  if (userWithUsername) {
    throw new Error('User with this username already exists.');
  }

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

async function loginUser(email, password) {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // If no user is found with the provided email
      throw new Error('User not found');
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // If the password is incorrect
      throw new Error('Incorrect password');
    }

    // If both email and password are correct, return the user
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = {
  registerUser,
  loginUser
};
