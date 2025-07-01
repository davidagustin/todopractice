import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useAuth';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Avatar,
} from '@mui/material';
import { LogoutOutlined, ChecklistRtlOutlined } from '@mui/icons-material';
import TodoList from './TodoList';
import CreateTodoForm from './CreateTodoForm';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <ChecklistRtlOutlined sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                color="inherit"
                onClick={logout}
                startIcon={<LogoutOutlined />}
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Welcome Message */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {user && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h5" gutterBottom>
              Welcome back, {user.name}! 👋
            </Typography>
            <Typography variant="body1">
              Ready to tackle your todos today?
            </Typography>
          </Paper>
        )}

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Create Todo Form */}
          <Box sx={{ flex: { xs: '1', md: '0 0 400px' } }}>
            <CreateTodoForm />
          </Box>

          {/* Todo List */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, minHeight: '400px' }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChecklistRtlOutlined />
                Your Todos
              </Typography>
              <TodoList />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 