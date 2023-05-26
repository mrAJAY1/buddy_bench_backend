const bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');

module.exports = {
  // LOGIN
  login: async ({ body }, res) => {
    const { username, password } = body;

    // Check if both username and password are present in request body
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    try {
      // Find user by username in database
      const user = await UserModel.findOne({ username });

      // If user is not found in database, return error response
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Compare the password provided in the request with the user's stored password hash
      const isEqual = bcrypt.compare(password, user.password);

      // If passwords match, return public user details in response
      if (isEqual) {
        const { password, __v, createdAt, updatedAt, ...publicUserDetails } =
          user._doc;
        return res.json({ data: publicUserDetails });
      }

      // If passwords do not match, return error response
      return res.status(401).json({ message: 'Invalid password' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // SIGNUP
  signup: async ({ body }, res) => {
    // Check if both username and password are present in request body
    if (!body.username || !body.password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    try {
      // Find user by username in database
      const user = await UserModel.findOne({ username: body.username });

      // If user already exists in database, return error response
      if (user) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create a new user in the database with provided username and password
      const newUser = await UserModel.create({
        username: body.username,
        password: body.password,
      });

      // Return public user details in response
      const { password, __v, createdAt, updatedAt, ...publicUserDetails } =
        newUser._doc;
      return res.json({ data: publicUserDetails });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Logout functionality is not implemented yet
  logout: async (req, res) => {},

  // Update user functionality is not implemented yet
  updateUser: async ({ params, body }, res) => {},

  // Delete user functionality is not implemented yet
  deleteUser: async ({ params }, res) => {},
};
