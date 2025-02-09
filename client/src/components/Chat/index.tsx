import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchConversations } from '../../store/slices/chatSlice';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatService } from '../../services/chatService';

const Chat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations());

    // Connect to WebSocket
    if (token) {
      const socket = ChatService.connectToWebSocket(token);

      // Listen for typing events
      ChatService.onUserTyping(({ user, conversationId }) => {
        if (conversationId === activeConversation) {
          setIsTyping(true);
          // Reset typing indicator after 3 seconds
          setTimeout(() => setIsTyping(false), 3000);
        }
      });

      return () => {
        ChatService.disconnectFromWebSocket();
      };
    }
  }, [dispatch, token]);

  return (
    <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid
          item
          xs={3}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            height: '100%',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              bgcolor: 'background.default',
              overflow: 'auto',
            }}
          >
            <ConversationList />
          </Paper>
        </Grid>
        <Grid item xs={9} sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: 'background.default',
            }}
          >
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <MessageList isTyping={isTyping} />
            </Box>
            <Box sx={{ p: 2 }}>
              <MessageInput />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;
