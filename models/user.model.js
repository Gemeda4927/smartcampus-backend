const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email!'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password!'],
      minlength: 8,
      select: false // never show password in queries
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,

    // 🔑 Role for access control
    role: {
      type: String,
      enum: ['student', 'admin', 'super-admin'],
      default: 'user'
    },

    // Campus & Department
    campus: {
      type: String,
      default: null
    },
    department: {
      type: String,
      default: null
    },

    // Payment / Subscription
    subscription: {
      type: String, // "free" or "premium"
      enum: ['free', 'premium'],
      default: 'free'
    },
    subscriptionExpires: {
      type: Date,
      default: null
    },
    chapaTransactionId: {
      type: String,
      default: null
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },

    // Wallet
    walletBalance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

/* 🔐 MIDDLEWARES */
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; // remove confirm field
  next();
});

// Update passwordChangedAt if password was modified
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // 1 sec earlier
  next();
});

/* 🔑 METHODS */
// Compare entered password with hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user changed password after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
