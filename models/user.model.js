const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please tell us your name!'] },
    email: { type: String, required: [true, 'Please provide your email!'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'Please provide a password!'], minlength: 8, select: false },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      validate: { validator: function (el) { return el === this.password; }, message: 'Passwords are not the same!' }
    },
    passwordChangedAt: Date,
    role: { type: String, enum: ['student', 'admin', 'super-admin'], default: 'user' },
    campus: { type: String, default: null },
    department: { type: String, default: null },
    subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
    subscriptionExpires: { type: Date, default: null },
    chapaTransactionId: { type: String, default: null },
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    walletBalance: { type: Number, default: 0 },

    // Password reset fields
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { timestamps: true }
);

/* 🔐 MIDDLEWARES */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/* 🔑 METHODS */
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
