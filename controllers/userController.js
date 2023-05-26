const { login, signup, logout, updateUser, deleteUser } = require("../models/user.js");

module.exports = {
    login: ({ body }, res) => {},
    signup: ({ body }, res) => {},
    logout: (req, res) => {},
    updateUser: ({ params, body }, res) => {},
    deleteUser: ({ params }, res) => {},
};
