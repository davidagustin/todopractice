import { ChecklistRtlOutlined, LogoutOutlined } from '@mui/icons-material';
import { AppBar, Avatar, Box, Button, Container, Paper, Toolbar, Typography } from '@mui/material';
import type React from 'react';
import { useAuth, useLogout } from '../hooks/useAuth';
import CreateTodoForm from './CreateTodoForm';
import TodoList from './TodoList';

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
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 }, minHeight: { xs: 56, sm: 64 } }}>
          <ChecklistRtlOutlined sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 22, sm: 28 } }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
              whiteSpace: { xs: 'normal', sm: 'nowrap' },
            }}
          >
            Todo App
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, bgcolor: 'secondary.main', fontSize: { xs: 16, sm: 20 } }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  px: { xs: 1, sm: 2 },
                  minWidth: { xs: 32, sm: 64 },
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Welcome Message */}
      <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        {user && (
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              mb: { xs: 2, sm: 4 },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: 3,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', sm: '2rem' } }}>
              Welcome back, {user.name}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Ready to tackle your todos today?
            </Typography>
          </Paper>
        )}

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: 'stretch',
          }}
        >
          {/* Create Todo Form */}
          <Box
            sx={{
              flex: { xs: '1', lg: '0 0 420px' },
              width: '100%',
              mb: { xs: 2, lg: 0 },
              position: { lg: 'sticky' },
              top: { lg: 24 },
              zIndex: { lg: 2 },
            }}
          >
            <CreateTodoForm />
          </Box>

          {/* Todo List */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Paper
              sx={{
                p: { xs: 1.5, sm: 2, md: 4 },
                minHeight: { xs: 320, sm: 400, md: 500 },
                borderRadius: 3,
                boxShadow: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                overflowX: 'auto',
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
                  mb: 3,
                  fontSize: { xs: '1.2rem', sm: '2rem' },
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
