import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AddTask } from '@mui/icons-material';
import { useCreateTodo } from '../hooks/useTodos';

interface FormData {
  title: string;
  description: string;
}

const CreateTodoForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const { mutate: createTodo, isPending, error } = useCreateTodo();

  const onSubmit = (data: FormData) => {
    createTodo({
      title: data.title.trim(),
      description: data.description.trim(),
    }, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <Paper 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        height: 'fit-content',
        borderRadius: 3,
        boxShadow: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
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
        <AddTask />
        Create New Todo
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <Controller
          name="title"
          control={control}
          rules={{
            required: 'Title is required',
            maxLength: {
              value: 200,
              message: 'Title must be less than 200 characters'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Title"
              margin="normal"
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title?.message}
              autoFocus
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: {
              value: 1000,
              message: 'Description must be less than 1000 characters'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Description (optional)"
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error.message}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : <AddTask />}
        >
          {isPending ? 'Creating...' : 'Create Todo'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateTodoForm; 