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
      <AppBar 
        position="static" 
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <ChecklistRtlOutlined sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
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
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
        {user && (
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: 3
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome back, {user.name}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Ready to tackle your todos today?
            </Typography>
          </Paper>
        )}

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: { xs: 3, md: 4 },
          alignItems: 'flex-start'
        }}>
          {/* Create Todo Form */}
          <Box sx={{ 
            flex: { xs: '1', lg: '0 0 420px' },
            width: '100%',
            position: { lg: 'sticky' },
            top: { lg: 24 }
          }}>
            <CreateTodoForm />
          </Box>

          {/* Todo List */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                minHeight: '500px',
                borderRadius: 3,
                boxShadow: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 3
                }}
              >
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