import {
  Add as AddIcon,
  Assignment,
  Cancel,
  CheckCircle,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Delete,
  Edit,
  Error as ErrorIcon,
  Inbox as InboxIcon,
  RadioButtonUnchecked,
  Save,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
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
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Skeleton,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import { useDeleteTodo, useTodos, useUpdateTodo } from '../hooks/useTodos';
import type { Todo, UpdateTodoRequest } from '../types/index';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: UpdateTodoRequest) => void;
  onDelete: (id: number) => void;
  index: number;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(todo.id, { title: title.trim(), description: description.trim() });
      setIsEditing(false);
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      <Slide direction="up" in timeout={300 + index * 100}>
        <Card
          sx={{
            mb: { xs: 2, sm: 3 },
            opacity: todo.completed ? 0.8 : 1,
            borderLeft: todo.completed ? '4px solid #4caf50' : '4px solid #2196f3',
            borderRadius: 2,
            boxShadow: todo.completed ? 1 : 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)',
            },
            width: '100%',
            minWidth: 0,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: todo.completed
                ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                : 'linear-gradient(90deg, #2196f3, #42a5f5)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 1,
            },
          }}
        >
          <CardContent sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, sm: 2 } }}>
              <Checkbox
                checked={todo.completed}
                onChange={toggleCompleted}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircle />}
                sx={{
                  mt: 0,
                  flexShrink: 0,
                  color: todo.completed ? 'success.main' : 'primary.main',
                  '&.Mui-checked': {
                    color: 'success.main',
                  },
                }}
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <Collapse in={isEditing}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 2 } }}>
                      <TextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Todo title"
                        variant="outlined"
                        size="small"
                        fullWidth
                        autoFocus
                        onKeyDown={handleKeyPress}
                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                      />
                      <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Todo description (optional)"
                        variant="outlined"
                        size="small"
                        multiline
                        rows={2}
                        fullWidth
                        onKeyDown={handleKeyPress}
                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                      />
                    </Box>
                  </Collapse>
                ) : (
                  <Fade in={!isEditing}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? 'text.secondary' : 'text.primary',
                          mb: 1,
                          fontSize: { xs: '1rem', sm: '1.2rem' },
                          wordBreak: 'break-word',
                          fontWeight: todo.completed ? 400 : 600,
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
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            wordBreak: 'break-word',
                            lineHeight: 1.5,
                          }}
                        >
                          {todo.description}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Chip
                          size="small"
                          label={todo.completed ? 'Completed' : 'Pending'}
                          color={todo.completed ? 'success' : 'primary'}
                          variant="outlined"
                          icon={todo.completed ? <CheckCircleOutlineIcon /> : <ScheduleIcon />}
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            fontWeight: 500,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            ml: 'auto',
                          }}
                        >
                          {new Date(todo.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                )}
              </Box>
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'flex-end', pt: 0, gap: { xs: 1, sm: 2 } }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={!title.trim()}
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    borderRadius: 1,
                  }}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    borderRadius: 1,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit todo"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                    },
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  aria-label="Delete todo"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </CardActions>
        </Card>
      </Slide>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            Delete Todo
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{todo.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 1 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useTodos();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const theme = useTheme();

  const handleUpdate = (id: number, data: UpdateTodoRequest) => {
    updateTodoMutation.mutate({ id, data });
  };

  const handleDelete = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[...Array(3)].map((_, index) => (
          <Card key={`skeleton-${index}`} sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: '0.875rem',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Failed to load todos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
      </Alert>
    );
  }

  // Empty state
  if (!todos || todos.todos.length === 0) {
    return (
      <Fade in timeout={800}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            textAlign: 'center',
            minHeight: 300,
          }}
        >
          <InboxIcon
            sx={{
              fontSize: 64,
              color: 'text.disabled',
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No todos yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            Get started by creating your first todo. Click the "Add Todo" button to begin organizing
            your tasks.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Create Your First Todo
          </Button>
        </Box>
      </Fade>
    );
  }

  // Success state with todos
  return (
    <Fade in timeout={600}>
      <Box>
        {todos.todos.map((todo: Todo, index: number) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            index={index}
          />
        ))}
      </Box>
    </Fade>
  );
};

export default TodoList;
