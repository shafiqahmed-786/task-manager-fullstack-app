// server/controllers/authController.js
// Handles user registration, login, and profile retrieval

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ─── Helper: Generate signed JWT ─────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ─── Helper: Build safe user response object ──────────────────────────────────
const userResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token,
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const signup = async (req, res) => {
  // Check express-validator results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;

  try {
    // Prevent duplicate accounts
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Create user — password is hashed automatically via pre-save hook
    const user = await User.create({ name, email, password });

    res.status(201).json(userResponse(user, generateToken(user._id)));
  } catch (error) {
    console.error('[signup]', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Authenticate user and return JWT
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    // Explicitly select password since we set select: false in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Intentionally vague error message to prevent user enumeration
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(userResponse(user, generateToken(user._id)));
  } catch (error) {
    console.error('[login]', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get currently authenticated user's profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by authMiddleware
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

module.exports = { signup, login, getMe };
