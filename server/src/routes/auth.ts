import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', auth, AuthController.getCurrentUser);

export default router;
