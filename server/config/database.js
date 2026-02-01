import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DATABASE_NAME;

    await mongoose.connect(mongoUri, {
      dbName: dbName,
      retryWrites: true,
      w: 'majority',
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${dbName}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error && error.message ? error.message : error);
    // Don't exit the process in development — allow the server to continue running
    // Set EXIT_ON_DB_FAIL=true to restore previous behavior where the process exits.
    if (process.env.EXIT_ON_DB_FAIL === 'true') {
      process.exit(1);
    }
    return false;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error.message);
  }
};

export { connectDB, disconnectDB };
