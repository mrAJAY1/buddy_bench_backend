const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Token = require('../models/token');

// This module exports an object that contains a single function
module.exports = {
  //   verifyToken: async (req, res, next) => {
  //     // The "Authorization" header contains the bearer token
  //     const authHeader = req.headers.authorization;
  //     if (typeof authHeader !== 'undefined') {
  //       // We split the authorization header into two parts:
  //       // "Bearer" and the actual token value.
  //       const parts = authHeader.split(' ');
  //       // If the authorization header is well-formed,
  //       // we extract the token from the second part
  //       if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
  //         const token = parts[1];
  //         try {
  //           // We use JWT verify method to validate the token.
  //           // If verification is successful, we can assume that the token is valid
  //           const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  //           req.user = decoded;
  //           next();
  //         } catch (error) {
  //           // If verification fails, we return a 401 Unauthorized error
  //           res.status(401).json({ message: 'Invalid or expired token', error });
  //         }
  //       }
  //     } else {
  //       // If the authorization header is missing, we return a 401 Unauthorized error
  //       res.status(401).json({ message: 'Missing Authorization header' });
  //     }
  //   },
};

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
  const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  return accessToken;
}
