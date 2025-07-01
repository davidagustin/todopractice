import { AddTask } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import type React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useCreateTodo } from '../hooks/useTodos';

interface FormData {
  title: string;
  description: string;
}

const CreateTodoForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const { mutate: createTodo, isPending, error } = useCreateTodo();

  const onSubmit = (data: FormData) => {
    createTodo(
      {
        title: data.title.trim(),
        description: data.description.trim(),
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        height: 'fit-content',
        borderRadius: 3,
        boxShadow: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        maxWidth: { xs: '100%', sm: 480 },
        mx: 'auto',
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
          fontSize: { xs: '1.1rem', sm: '1.5rem' },
          textAlign: { xs: 'center', sm: 'left' },
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
              message: 'Title must be less than 200 characters',
            },
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
              inputProps={{ maxLength: 200 }}
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: {
              value: 1000,
              message: 'Description must be less than 1000 characters',
            },
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
              inputProps={{ maxLength: 1000 }}
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            />
          )}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Error: {error.message}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, fontSize: { xs: '1rem', sm: '1.1rem' }, py: { xs: 1, sm: 1.5 } }}
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
