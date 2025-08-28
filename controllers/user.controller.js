const User = require('../models/user.model');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, campus, department } = req.body;
    const user = new User({ name, email, password, campus, department });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('bookmarks');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('bookmarks');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user info
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update subscription/payment after Chapa transaction
exports.updatePayment = async (req, res) => {
  try {
    const { userId, transactionId, subscription = 'premium', subscriptionExpires, paymentStatus = 'success', walletBalance = 0 } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        chapaTransactionId: transactionId,
        subscription,
        subscriptionExpires,
        paymentStatus,
        walletBalance
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Check if user can access questions
exports.canAccessQuestions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.subscription !== 'premium' || user.paymentStatus !== 'success') {
      return res.status(403).json({ success: false, message: 'Payment required to access questions' });
    }

    res.status(200).json({ success: true, message: 'Access granted', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
