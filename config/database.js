const mongoose = require('mongoose');

/**
 * MongoDB Database Connection with Auto-Retry
 * Connects to MongoDB Atlas with automatic reconnection on failure
 */
const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Reset retry count on successful connection
    retryCount = 0;

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => connectDB(0), retryDelay);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} signal received`);
      console.log('🛑 Closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed gracefully');
      process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error(`❌ MongoDB connection failed (Attempt ${retryCount + 1}/${maxRetries}):`, error.message);

    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), retryDelay);
    } else {
      console.error('❌ Max retries reached. Could not connect to MongoDB.');
      console.error('💡 Please check your MONGODB_URI in .env file');
      
      // In production with PM2, this will trigger auto-restart
      // In development with nodemon, this will wait for file changes
      process.exit(1);
    }
  }
};

module.exports = connectDB;
