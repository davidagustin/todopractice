import type React from 'react';
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  Assignment,
  Cancel,
  CheckCircle,
  Delete,
  Edit,
  RadioButtonUnchecked,
  Save,
} from '@mui/icons-material';
import { useDeleteTodo, useTodos, useUpdateTodo } from '../hooks/useTodos';
import type { Todo, UpdateTodoRequest } from '../types/index';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: UpdateTodoRequest) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = () => {
    onUpdate(todo.id, { title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(false);
  };

  const toggleCompleted = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleDelete = () => {
    onDelete(todo.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          mb: 3,
          opacity: todo.completed ? 0.8 : 1,
          borderLeft: todo.completed ? '4px solid #4caf50' : '4px solid #2196f3',
          borderRadius: 2,
          boxShadow: todo.completed ? 1 : 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Checkbox
              checked={todo.completed}
              onChange={toggleCompleted}
              icon={<RadioButtonUnchecked />}
              checkedIcon={<CheckCircle />}
              sx={{ mt: -1 }}
            />

            <Box sx={{ flex: 1 }}>
              {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Todo title"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Todo description"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? 'text.secondary' : 'text.primary',
                      mb: 1,
                    }}
                  >
                    {todo.title}
                  </Typography>
                  {todo.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.disabled' : 'text.secondary',
                        mb: 1,
                      }}
                    >
                      {todo.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      size="small"
                      label={todo.completed ? 'Completed' : 'Pending'}
                      color={todo.completed ? 'success' : 'primary'}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(todo.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button size="small" variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" onClick={() => setIsEditing(true)}>
                <Edit />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setDeleteDialogOpen(true)}>
                <Delete />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Todo</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{todo.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const TodoList: React.FC = () => {
  const { data: todosResponse, isLoading, error } = useTodos();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleUpdate = (id: number, data: UpdateTodoRequest) => {
    updateTodoMutation.mutate({ id, data });
  };

  const handleDelete = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
          minHeight: '300px',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 3, color: 'primary.main' }} />
          <Typography variant="h6" color="text.secondary">
            Loading todos...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">Error loading todos: {error.message}</Alert>
      </Box>
    );
  }

  const todos = todosResponse?.todos || [];

  if (todos.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
          minHeight: '300px',
        }}
      >
        <Assignment sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.6 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
          No todos yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Create your first todo to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {todos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={handleUpdate} onDelete={handleDelete} />
      ))}
    </Box>
  );
};

export default TodoList;
