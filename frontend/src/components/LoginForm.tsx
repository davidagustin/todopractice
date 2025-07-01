import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending, error } = useLogin();
  const watchedFields = watch();

  const onSubmit = (data: FormData) => {
    login(data);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Helper to parse backend error
  function getErrorMessage(error: unknown) {
    if (!error || typeof error !== 'object') {
      return null;
    }
    const msg = (error as { message?: string }).message || '';
    if (msg.includes('Invalid email or password')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (msg.includes('validation failed')) {
      if (msg.includes('Email')) {
        return 'Please enter a valid email address.';
      }
      if (msg.includes('Password') && msg.includes('min')) {
        return 'Password must be at least 6 characters long.';
      }
      return 'Please check your input and try again.';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Connection error. Please check your internet connection and try again.';
    }
    return msg || 'An unexpected error occurred. Please try again.';
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Slide direction="up" in timeout={1000}>
              <Paper
                elevation={8}
                sx={{
                  padding: { xs: 3, sm: 4, md: 5 },
                  width: '100%',
                  maxWidth: 450,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  mx: 'auto',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Header */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      component="h1"
                      variant="h4"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      Sign in to your account to continue
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                    {/* Email Field */}
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      }}
                      render={({ field }) => (
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />

                    {/* Password Field */}
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          autoComplete="current-password"
                          error={!!errors.password}
                          helperText={errors.password?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleTogglePassword}
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />

                    {/* Error Alert */}
                    {error && (
                      <Alert
                        severity="error"
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          '& .MuiAlert-message': {
                            fontSize: '0.875rem',
                          },
                        }}
                      >
                        {getErrorMessage(error)}
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={
                        isPending || !isValid || !watchedFields.email || !watchedFields.password
                      }
                      startIcon={isPending ? <CircularProgress size={20} /> : <LoginIcon />}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        },
                        '&:disabled': {
                          background: 'rgba(0,0,0,0.12)',
                          transform: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {isPending ? 'Signing in...' : 'Sign in'}
                    </Button>

                    {/* Divider */}
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        or
                      </Typography>
                    </Divider>

                    {/* Register Link */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Don't have an account?
                      </Typography>
                      <Link to="/register" style={{ textDecoration: 'none' }}>
                        <MuiLink
                          component="span"
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Create a new account
                        </MuiLink>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginForm;
