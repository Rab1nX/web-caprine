import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchMessages } from '../../store/slices/chatSlice';

interface MessageListProps {
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ isTyping }) => {
  const dispatch = useDispatch<AppDispatch>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, activeConversation, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (activeConversation) {
      dispatch(fetchMessages(activeConversation));
    }
  }, [activeConversation, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start chatting
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {messages.map((message: any) => {
        const isOwnMessage = message.sender._id === user?.id;

        return (
          <Box
            key={message._id}
            sx={{
              display: 'flex',
              justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {!isOwnMessage && (
              <Avatar
                sx={{ width: 32, height: 32, mr: 1 }}
                alt={message.sender.name}
              >
                {message.sender.name.charAt(0)}
              </Avatar>
            )}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
                color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  color: isOwnMessage ? 'primary.contrastText' : 'text.secondary',
                  opacity: 0.8,
                }}
              >
                {new Date(message.createdAt).toLocaleTimeString()}
              </Typography>
            </Paper>
            {isOwnMessage && (
              <Avatar
                sx={{ width: 32, height: 32, ml: 1 }}
                alt={message.sender.name}
              >
                {message.sender.name.charAt(0)}
              </Avatar>
            )}
          </Box>
        );
      })}
      {isTyping && (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Someone is typing...
          </Typography>
          <CircularProgress size={16} sx={{ ml: 1 }} />
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
