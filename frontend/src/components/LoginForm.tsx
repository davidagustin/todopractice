import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useLogin } from '../hooks/useAuth';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: FormData) => {
    login(data);
  };

  // Helper to parse backend error
  function getErrorMessage(error: unknown) {
    if (!error || typeof error !== 'object') return null;
    const msg = (error as { message?: string }).message || '';
    if (msg.includes('Invalid email or password')) return 'Invalid email or password';
    if (msg.includes('validation failed')) {
      if (msg.includes('Email')) return 'Invalid email format';
      if (msg.includes('Password') && msg.includes('min')) return 'Password must be at least 6 characters';
      return 'Validation error';
    }
    return msg;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Paper 
            elevation={8} 
            sx={{ 
              padding: { xs: 3, sm: 4, md: 5 },
              width: '100%',
              maxWidth: 500,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h4" gutterBottom>
                Sign in to your account
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field }: { field: Record<string, unknown> }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  }}
                  render={({ field }: { field: Record<string, unknown> }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {getErrorMessage(error)}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isPending}
                  startIcon={isPending ? <CircularProgress size={20} /> : null}
                >
                  {isPending ? 'Signing in...' : 'Sign in'}
                </Button>
                
                <Box textAlign="center">
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Don't have an account? Sign up
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm; 