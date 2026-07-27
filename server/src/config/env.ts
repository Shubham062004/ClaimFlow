import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/claimflow',
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret_key_claimflow_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(','),
  uploadDir: process.env.UPLOAD_DIR || 'src/uploads',
};

// Simple sanity check for critical env variables in production
if (config.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing in production mode.');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('FATAL: MONGO_URI environment variable is missing in production mode.');
  }
}
