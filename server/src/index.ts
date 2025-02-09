import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { setupWebSocket } from './config/websocket';
import { logger } from './utils/logger';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true
  }
});

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// WebSocket setup
setupWebSocket(io);
app.set('io', io);

httpServer.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
