import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[Database Error] Initial MongoDB connection failed:', error);
    console.warn('[Database] The server will remain active on port ' + config.port + '. Reconnecting in 5s...');
    setTimeout(() => {
      connectDB().catch(() => {});
    }, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection lost. Retrying...');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database Error] MongoDB runtime error:', err);
});

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('[Database] MongoDB connection closed gracefully.');
};
