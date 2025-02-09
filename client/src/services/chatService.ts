import axios from 'axios';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
  autoConnect: false,
});

export class ChatService {
  static async getConversations() {
    const response = await axios.get(`${API_URL}/conversations`);
    return response.data;
  }

  static async getMessages(conversationId: string) {
    const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`);
    return response.data;
  }

  static async sendMessage(conversationId: string, content: string) {
    const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
      content,
    });
    return response.data;
  }

  static async createConversation(participants: string[]) {
    const response = await axios.post(`${API_URL}/conversations`, { participants });
    return response.data;
  }

  static connectToWebSocket(token: string) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  static disconnectFromWebSocket() {
    socket.disconnect();
  }

  static onNewMessage(callback: (message: any) => void) {
    socket.on('new_message', callback);
  }

  static onUserTyping(callback: (data: { user: string; conversationId: string }) => void) {
    socket.on('user_typing', callback);
  }

  static emitTyping(conversationId: string) {
    socket.emit('typing', { conversationId });
  }
}
