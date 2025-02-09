import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ChatService } from '../../services/chatService';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { activeConversation } = useSelector((state: RootState) => state.chat);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    try {
      await ChatService.sendMessage(activeConversation, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (activeConversation) {
      ChatService.emitTyping(activeConversation);
    }
  };

  if (!activeConversation) return null;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <IconButton color="primary" size="large">
        <EmojiIcon />
      </IconButton>
      <IconButton color="primary" size="large">
        <AttachFileIcon />
      </IconButton>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                type="submit"
                disabled={!message.trim()}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
          },
        }}
      />
    </Box>
  );
};

export default MessageInput;
