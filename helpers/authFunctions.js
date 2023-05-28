const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

// generate access and refresh tokens for a user
async function generateTokens(user) {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_REFRESH);
  await Token.create({ userId: user._id, refreshToken });
  return { accessToken, refreshToken };
}

// verify an access token
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// verify a refresh token
async function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
  const result = await Token.findOne({ userId: decoded.id, refreshToken: token }).lean();
  return !!result;
}

// exchange a refresh token for a new access token
async function exchangeRefreshToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  const token = await Token.findOne({ userId: decoded.id, refreshToken }).exec();
  if (!token) throw new Error('Invalid refresh token');
  const user = await User.findById(decoded.id).exec();
  if (!user) throw new Error('User not found');
  // Replace old refresh token with a new one each time it's used
  const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET_REFRESH);
  token.refreshToken = newRefreshToken;
  await token.save();
  // Generate new access token
  const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  return { accessToken, newRefreshToken };
}

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken, exchangeRefreshToken };
