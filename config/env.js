import dotenv from 'dotenv';
import path from 'path';
import __dirname from '../utils/directory.js';

// Only load local config.env in development
// In production (Railway), environment variables are set in the platform
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../config.env') });
}
