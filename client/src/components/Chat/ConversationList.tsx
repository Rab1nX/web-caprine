import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setActiveConversation } from '../../store/slices/chatSlice';

const ConversationList: React.FC = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversation, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getConversationName = (conversation: any) => {
    if (conversation.type === 'group') {
      return conversation.name;
    }
    const otherParticipant = conversation.participants.find(
      (p: any) => p._id !== user?.id
    );
    return otherParticipant?.name || 'Unknown User';
  };

  const getLastMessage = (conversation: any) => {
    if (!conversation.lastMessage) {
      return 'No messages yet';
    }
    return conversation.lastMessage.content.length > 30
      ? `${conversation.lastMessage.content.substring(0, 30)}...`
      : conversation.lastMessage.content;
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {conversations.map((conversation: any) => (
        <React.Fragment key={conversation._id}>
          <ListItem
            alignItems="flex-start"
            button
            selected={activeConversation === conversation._id}
            onClick={() => dispatch(setActiveConversation(conversation._id))}
          >
            <ListItemAvatar>
              <Avatar>{getConversationName(conversation).charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={getConversationName(conversation)}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {getLastMessage(conversation)}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default ConversationList;
