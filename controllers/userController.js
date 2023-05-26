const bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const {
  login,
  signup,
  logout,
  updateUser,
  deleteUser,
} = require('../models/user');

module.exports = {
  // LOGIN
  login: async ({ body }, res) => {
    // Check if both username and password are present in the request body
    if (!body.username || !body.password) {
      // Return a 400 Bad Request response with an error message if either of them is missing
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }
    const user = await UserModel.findOne({ username: body.username });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const isEqual = bcrypt.compare(body.password, user.password);
    if (isEqual) {
      const { password, __doc, ...publicUserDetails } = user;
      return res
        .status(200)
        .json({ message: 'login successful', data: publicUserDetails });
    }
  },
  // SIGNUP
  signup: async ({ body }, res) => {
    // Check if both username and password are present in the request body
    if (!body.username || !body.password) {
      // Return a 400 Bad Request response with an error message if either of them is missing
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    try {
      // Search for an existing user with the same username
      const existingUser = await UserModel.exists({ username: body.username });
      // If a user with the same username already exists, return a 409 Conflict error
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      // Use the UserModel to create a new user with the given username and password
      const user = await UserModel.create({
        username: body.username,
        password: body.password,
      });
      // Return a JSON response containing the newly created user object if successful
      return res.json(user);
    } catch (err) {
      // Log any errors to the console
      console.error(err);
      // Return a 500 Internal Server Error response with an error message if something went wrong
      return res.status(500).json({ message: 'Server error' });
    }
  },
  logout: async (req, res) => {},
  updateUser: async ({ params, body }, res) => {},
  deleteUser: async ({ params }, res) => {},
};
