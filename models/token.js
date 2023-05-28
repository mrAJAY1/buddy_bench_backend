const mongoose = require('mongoose');

// define the token schema and model
const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 604800 }, // expire in 7 days
});

module.exports = mongoose.model('Token', TokenSchema);
