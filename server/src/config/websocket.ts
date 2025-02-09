import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const setupWebSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.data.userId}`);

    // Join user to their own room for private messages
    socket.join(socket.data.userId);

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
      logger.info(`User ${socket.data.userId} joined conversation: ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(conversationId);
      logger.info(`User ${socket.data.userId} left conversation: ${conversationId}`);
    });

    socket.on('typing', ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit('user_typing', {
        user: socket.data.userId,
        conversationId,
      });
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
};
