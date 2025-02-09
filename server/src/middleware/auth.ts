import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = {
        userId: decoded.userId,
      };
      return next();
    } catch (error) {
      logger.error('Token verification error:', error);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
