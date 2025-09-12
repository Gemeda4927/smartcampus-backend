const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');

// Helper: sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '90d' });
};

// Helper: send token in response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
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
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// PROTECT middleware
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return res.status(401).json({ status: 'fail', message: 'User no longer exists.' });

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: err.message });
  }
};

// RESTRICT TO
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ status: 'fail', message: 'No user with that email' });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send link to a browser-friendly page
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword.html?token=${resetToken}`;

    const message = `Forgot your password? Click this link to reset it: ${resetURL}\nIf not requested, ignore this email.`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD // Use App Password here
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset Token',
      text: message
    });

    res.status(200).json({ status: 'success', message: 'Password reset link sent to email!' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ status: 'fail', message: 'Token invalid or expired' });

    // Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
