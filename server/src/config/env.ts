import { cleanEnv, str, port } from 'envalid';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ default: 5000 }),
  MONGODB_USER: str(),
  MONGODB_PASSWORD: str(),
  MONGODB_DATABASE: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str(),
  CORS_ORIGIN: str(),
});
