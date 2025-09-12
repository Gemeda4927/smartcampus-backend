// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String, // e.g., "4 years", "6 months"
      trim: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University', 
      required: true,
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

module.exports = mongoose.model('Course', courseSchema);
