// server/middleware/authMiddleware.js
// JWT verification middleware — protects private routes

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Extract Bearer token from the Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the authenticated user to the request object (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    next();
  } catch (error) {
    console.error('[authMiddleware]', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired — please log in again' });
    }

    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
};

module.exports = protect;
