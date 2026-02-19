import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load local config.env in development
// In production (Railway), environment variables are set in the platform
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../config.env') });
}
