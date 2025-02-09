import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/slices/themeSlice';

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Web Caprine
          </Typography>
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => dispatch(toggleTheme())}
            color="inherit"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
