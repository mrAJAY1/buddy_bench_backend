// Import necessary modules and helper functions
const { verify } = require('jsonwebtoken');
const {
  verifyAccessToken,
  verifyRefreshToken,
  exchangeRefreshToken,
} = require('../helpers/authFunctions');

// Middleware function to check if user is authorized
async function authMiddleware(req, res, next) {
  // Get access token from cookies
  const accessToken = req.cookies?.access_token;

  // If access token not found, return error response
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    // Verify access token
    const decoded = await verifyAccessToken(accessToken);
    req.userId = decoded.id;
    return next(); // User is authorized, proceed to next middleware/controller
  } catch (err) {
    // Access token has expired or is invalid - check if refresh token exists in cookies
    const refreshToken = req.cookies?.refresh_token;

    // If refresh token not found, return error response
    if (!refreshToken) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Verify refresh token
    const [decoded, isRefreshTokenValid] = await Promise.all([
      verify(accessToken, process.env.JWT_SECRET),
      verifyRefreshToken(refreshToken),
    ]);

    // If refresh token is invalid, return error response
    if (!isRefreshTokenValid) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    try {
      // Exchange refresh token for new access token
      const { accessToken: newAccessToken, newRefreshToken } = await exchangeRefreshToken(
        refreshToken
      );

      // Set new access token and refresh token in cookies
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        maxAge: 900000, // 15 minutes
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        maxAge: 604800000, // 7 days
      });

      // Set user ID from new access token in request object
      const decoded = await verify(newAccessToken, process.env.JWT_SECRET);
      req.userId = decoded.id;

      return next(); // User is authorized, proceed to next middleware/controller
    } catch (err) {
      return res.status(401).json({
        message: 'Error in exchanging refresh token for new access token',
      });
    }
  }
}

// Export authMiddleware function for use in other modules
module.exports = authMiddleware;
