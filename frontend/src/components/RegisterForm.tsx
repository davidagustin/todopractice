import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import type { RegisterRequest } from '../types';

const RegisterForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useRegister();
  const password = watch('password');

  const onSubmit = (data: RegisterRequest & { confirmPassword: string }) => {
    registerMutation.mutate(data);
  };

  // Helper to parse backend error
  function getErrorMessage(error: unknown) {
    if (!error || typeof error !== 'object') {
      return null;
    }
    const msg = (error as { message?: string }).message || '';
    if (msg.includes('validation failed')) {
      if (msg.includes('Email')) {
        return 'Invalid email format';
      }
      if (msg.includes('Password') && msg.includes('min')) {
        return 'Password must be at least 6 characters';
      }
      if (msg.includes('Name')) {
        return 'Name is required';
      }
      return 'Validation error';
    }
    if (msg.includes('User already exists')) {
      return 'User already exists';
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
      <Container
        component="main"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          minHeight: '100vh',
          m: 0,
          p: 0,
        }}
      >
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
              mx: 'auto',
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
                Create your account
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  }}
                  render={({ field }: { field: Record<string, unknown> }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
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
                      message: 'Password must be at least 6 characters',
                    },
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
                      autoComplete="new-password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: 'Please confirm your password',
                    validate: (value: string) => value === password || 'Passwords do not match',
                  }}
                  render={({ field }: { field: Record<string, unknown> }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      autoComplete="new-password"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  )}
                />

                {registerMutation.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {getErrorMessage(registerMutation.error)}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={registerMutation.isPending}
                  startIcon={registerMutation.isPending ? <CircularProgress size={20} /> : null}
                >
                  {registerMutation.isPending ? 'Creating account...' : 'Sign up'}
                </Button>

                <Box textAlign="center">
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Already have an account? Sign in
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

export default RegisterForm;
