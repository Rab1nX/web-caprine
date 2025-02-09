import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        name,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user._id }, env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(201).json({
        user: { id: user._id, email: user.email, name: user.name },
        token,
      });
    } catch (error) {
      logger.error('Registration error:', error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId: user._id }, env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        user: { id: user._id, email: user.email, name: user.name },
        token,
      });
    } catch (error) {
      logger.error('Login error:', error);
      return res.status(500).json({ message: 'Error logging in' });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }

      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
      const token = jwt.sign({ userId: decoded.userId }, env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token });
    } catch (error) {
      logger.error('Token refresh error:', error);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  static async logout(_req: Request, res: Response): Promise<Response> {
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out successfully' });
  }

  static async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      logger.error('Get current user error:', error);
      return res.status(500).json({ message: 'Error fetching user' });
    }
  }
}
