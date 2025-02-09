import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { auth } from '../middleware/auth';

const router = Router();

// All chat routes are protected
router.use(auth);

router.get('/conversations', ChatController.getConversations);
router.get('/conversations/:conversationId/messages', ChatController.getMessages);
router.post('/conversations/:conversationId/messages', ChatController.sendMessage);
router.post('/conversations', ChatController.createConversation);

export default router;
