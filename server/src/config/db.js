const mongoose = require('mongoose');
const config = require('./index');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue in limited mode. Please check MongoDB credentials.');
    isConnected = false;
    // Don't exit - let server continue for other endpoints
  }
};

const getConnectionStatus = () => isConnected;

module.exports = { connectDB, getConnectionStatus };
