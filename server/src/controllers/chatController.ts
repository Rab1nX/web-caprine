import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { logger } from '../utils/logger';

export class ChatController {
  static async getConversations(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const conversations = await Conversation.find({
        participants: new Types.ObjectId(req.user.userId),
      })
        .populate('participants', 'name email')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

      return res.json(conversations);
    } catch (error) {
      logger.error('Get conversations error:', error);
      return res.status(500).json({ message: 'Error fetching conversations' });
    }
  }

  static async getMessages(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { conversationId } = req.params;
      const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'name email')
        .sort({ createdAt: 1 });

      return res.json(messages);
    } catch (error) {
      logger.error('Get messages error:', error);
      return res.status(500).json({ message: 'Error fetching messages' });
    }
  }

  static async sendMessage(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { conversationId } = req.params;
      const { content } = req.body;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      const userObjectId = new Types.ObjectId(req.user.userId);
      if (!conversation.participants.some(p => p.equals(userObjectId))) {
        return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
      }

      const message = new Message({
        conversation: conversationId,
        sender: userObjectId,
        content,
      });

      await message.save();

      conversation.lastMessage = message._id;
      await conversation.save();

      const populatedMessage = await Message.findById(message._id).populate(
        'sender',
        'name email'
      );

      // Emit the message through WebSocket
      req.app.get('io').to(conversationId).emit('new_message', populatedMessage);

      return res.status(201).json(populatedMessage);
    } catch (error) {
      logger.error('Send message error:', error);
      return res.status(500).json({ message: 'Error sending message' });
    }
  }

  static async createConversation(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { participants } = req.body;
      const userObjectId = new Types.ObjectId(req.user.userId);

      // Convert participant strings to ObjectIds
      const participantIds = participants.map((id: string) => new Types.ObjectId(id));
      if (!participantIds.some((id: Types.ObjectId) => id.equals(userObjectId))) {
        participantIds.push(userObjectId);
      }

      const existingConversation = await Conversation.findOne({
        participants: { $all: participantIds, $size: participantIds.length },
      });

      if (existingConversation) {
        return res.json(existingConversation);
      }

      const conversation = new Conversation({
        participants: participantIds,
      });

      await conversation.save();

      const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email')
        .populate('lastMessage');

      return res.status(201).json(populatedConversation);
    } catch (error) {
      logger.error('Create conversation error:', error);
      return res.status(500).json({ message: 'Error creating conversation' });
    }
  }
}
