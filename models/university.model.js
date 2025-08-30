// models/University.js
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '', 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('University', universitySchema);
