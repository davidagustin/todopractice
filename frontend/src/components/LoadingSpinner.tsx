import { Box, CircularProgress, Typography } from '@mui/material';
import type React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false,
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  const spinner = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }),
      }}
    >
      <CircularProgress
        size={sizeMap[size]}
        thickness={4}
        sx={{
          color: 'primary.main',
        }}
        aria-label="Loading spinner"
      />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: 200,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  return spinner;
};

export default LoadingSpinner;
