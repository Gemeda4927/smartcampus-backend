const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  campus: {       
    type: String,
    default: null
  },
  department: {   
    type: String,
    default: null
  },
  bookmarks: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
  ],

  // Payment / Access Control
  subscription: {            
    type: String,           // "free" or "premium"
    enum: ["free", "premium"],
    default: "free"
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
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  // Optional wallet for future payments
  walletBalance: {           
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
