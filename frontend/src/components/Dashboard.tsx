import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  ChecklistRtlOutlined,
  LogoutOutlined,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  Paper,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type React from 'react';
import { useAuth, useLogout } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import CreateTodoForm from './CreateTodoForm';
import LoadingSpinner from './LoadingSpinner';
import TodoList from './TodoList';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const logout = useLogout();
  const { data: todos, isLoading, error } = useTodos();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate statistics
  const totalTodos = todos?.length || 0;
  const completedTodos = todos?.filter((todo) => todo.completed).length || 0;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const handleLogout = () => {
    // Add confirmation dialog in a real app
    logout();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <LoadingSpinner size="large" message="Loading your dashboard..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Failed to load todos
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please try refreshing the page or contact support if the problem persists.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Refresh Page
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Enhanced Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar sx={{ px: 0, minHeight: { xs: 64, sm: 72 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <ChecklistRtlOutlined
                sx={{
                  mr: { xs: 1.5, sm: 2 },
                  fontSize: { xs: 24, sm: 28 },
                  color: 'white',
                }}
              />
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                Todo App
              </Typography>
            </Box>

            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                {/* User Stats - Hidden on mobile */}
                {!isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${completionRate}%`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                  </Box>
                )}

                {/* User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      bgcolor: 'secondary.main',
                      fontSize: { xs: 14, sm: 16 },
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Logout Button */}
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutOutlined />}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    minWidth: { xs: 'auto', sm: 80 },
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.6)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
        <Fade in timeout={600}>
          <Box>
            {/* Welcome Section */}
            {user && (
              <Slide direction="up" in timeout={800}>
                <Paper
                  sx={{
                    p: { xs: 3, sm: 4 },
                    mb: { xs: 3, sm: 4 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        mb: 1,
                      }}
                    >
                      Welcome back, {user.name}! 👋
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        opacity: 0.9,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        mb: 2,
                      }}
                    >
                      Ready to tackle your todos today?
                    </Typography>

                    {/* Quick Stats */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: { xs: 1, sm: 2 },
                        flexWrap: 'wrap',
                        mt: 2,
                      }}
                    >
                      <Chip
                        icon={<AssignmentIcon />}
                        label={`${totalTodos} Total`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' },
                        }}
                      />
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={`${completedTodos} Completed`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' },
                        }}
                      />
                      <Chip
                        icon={<ScheduleIcon />}
                        label={`${pendingTodos} Pending`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Slide>
            )}

            {/* Main Content Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '400px 1fr' },
                gap: { xs: 3, sm: 4, md: 5 },
                alignItems: 'start',
              }}
            >
              {/* Create Todo Form */}
              <Slide direction="left" in timeout={1000}>
                <Box>
                  <CreateTodoForm />
                </Box>
              </Slide>

              {/* Todo List */}
              <Slide direction="right" in timeout={1200}>
                <Box>
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3, md: 4 },
                      minHeight: { xs: 400, sm: 500, md: 600 },
                      borderRadius: 3,
                      boxShadow: 2,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0,0,0,0.05)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        pb: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontWeight: 700,
                          color: 'primary.main',
                          fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                      >
                        <ChecklistRtlOutlined />
                        Your Todos
                      </Typography>

                      {totalTodos > 0 && (
                        <Chip
                          label={`${completionRate}% Complete`}
                          color={completionRate === 100 ? 'success' : 'primary'}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>

                    <TodoList />
                  </Paper>
                </Box>
              </Slide>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Dashboard;
