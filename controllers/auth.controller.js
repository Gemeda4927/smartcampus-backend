// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Helper function to sign tokens
const signToken = (id) => {
  return jwt.sign({ id }, 'your_jwt_secret', {
    expiresIn: '90d',
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email & password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // 3) Send token
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// PROTECT (only logged-in users)
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, 'your_jwt_secret');

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does not exist.',
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: err.message });
  }
};

// RESTRICT TO (roles: admin, user, etc.)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
