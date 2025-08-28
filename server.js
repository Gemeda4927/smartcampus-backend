// server.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: './.env' });


const DB = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log('✅ DB connection successful!'))
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
