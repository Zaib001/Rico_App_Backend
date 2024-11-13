const { verifyToken } = require('../config/jwt');
const User = require('../models/User'); // Import User model

/**
 * Simple authentication middleware.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check for Authorization header and extract token
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Access denied.' });
    }

    // Verify token and extract user ID
    const decoded = verifyToken(token);
    req.userId = decoded.userId;

    // Check if user exists in the database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Attach user to request for next handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    // Handle JWT-specific errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Authentication failed.' });
    }

    // Handle other potential errors
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

module.exports = authMiddleware;
