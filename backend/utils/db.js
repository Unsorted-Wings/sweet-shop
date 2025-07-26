import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getConnectionOptions = () => ({
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  maxPoolSize: 10, // Maximum number of connections
});

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!cached.promise) {
    const options = getConnectionOptions();
    cached.promise = mongoose.connect(process.env.MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    
    // Enhance error message with context
    const enhancedError = new Error(
      `Failed to connect to MongoDB: ${error.message}`
    );
    enhancedError.originalError = error;
    throw enhancedError;
  }
}