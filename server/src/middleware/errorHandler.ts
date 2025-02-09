import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      error: error.message,
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: error.message,
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      error: error.message,
    });
  }

  // Default error
  return res.status(500).json({
    message: 'Internal Server Error',
    error: error.message,
  });
};
