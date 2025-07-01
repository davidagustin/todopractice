import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import TodoList from '../TodoList'

// Mock the hooks
const mockUseTodos = vi.fn()
const mockUpdateTodo = vi.fn()
const mockDeleteTodo = vi.fn()

vi.mock('../../hooks/useTodos', () => ({
  useTodos: () => mockUseTodos(),
  useUpdateTodo: () => ({
    mutate: mockUpdateTodo,
  }),
  useDeleteTodo: () => ({
    mutate: mockDeleteTodo,
  }),
}))

const theme = createTheme()

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}

const mockTodoData = [
  {
    id: 1,
    title: 'Test Todo 1',
    description: 'Test Description 1',
    completed: false,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    user_id: 1,
  },
  {
    id: 2,
    title: 'Test Todo 2', 
    description: 'Test Description 2',
    completed: true,
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    user_id: 1,
  },
]

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state', () => {
    mockUseTodos.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(<TodoList />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
  })

  it('should render error state', () => {
    mockUseTodos.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch todos' },
    })

    render(<TodoList />, { wrapper: createWrapper() })
    
    expect(screen.getByText(/Error loading todos: Failed to fetch todos/)).toBeInTheDocument()
  })

  it('should render empty state when no todos', () => {
    mockUseTodos.mockReturnValue({
      data: { todos: [] },
      isLoading: false,
      error: null,
    })

    render(<TodoList />, { wrapper: createWrapper() })
    
    expect(screen.getByText('No todos yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first todo to get started!')).toBeInTheDocument()
  })

  it('should render list of todos', () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    render(<TodoList />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument()
    expect(screen.getByText('Test Description 1')).toBeInTheDocument()
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument()
    expect(screen.getByText('Test Description 2')).toBeInTheDocument()
  })

  it('should show status chips for todos', () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    render(<TodoList />, { wrapper: createWrapper() })
    
    // Check for status chips
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('should toggle todo completion when checkbox is clicked', async () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    const user = userEvent.setup()
    render(<TodoList />, { wrapper: createWrapper() })
    
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0]) // Click first todo checkbox
    
    expect(mockUpdateTodo).toHaveBeenCalledWith({
      id: 1,
      data: { completed: true }
    })
  })

  it('should show edit form when edit button is clicked', async () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    const user = userEvent.setup()
    render(<TodoList />, { wrapper: createWrapper() })
    
    // Find edit button by its icon
    const editButtons = screen.getAllByTestId('EditIcon')
    await user.click(editButtons[0].closest('button')!)
    
    // Should show save and cancel buttons
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should open delete dialog when delete button is clicked', async () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    const user = userEvent.setup()
    render(<TodoList />, { wrapper: createWrapper() })
    
    // Find delete button by its icon
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    await user.click(deleteButtons[0].closest('button')!)
    
    // Should show delete confirmation dialog
    expect(screen.getByText('Delete Todo')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
  })

  it('should delete todo when confirmed in dialog', async () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    const user = userEvent.setup()
    render(<TodoList />, { wrapper: createWrapper() })
    
    // Click delete button
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    await user.click(deleteButtons[0].closest('button')!)
    
    // Click the delete button in the dialog
    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(confirmDeleteButton)
    
    expect(mockDeleteTodo).toHaveBeenCalledWith(1)
  })

  it('should not delete todo when cancelled in dialog', async () => {
    mockUseTodos.mockReturnValue({
      data: { todos: mockTodoData },
      isLoading: false,
      error: null,
    })

    const user = userEvent.setup()
    render(<TodoList />, { wrapper: createWrapper() })
    
    // Click delete button
    const deleteButtons = screen.getAllByTestId('DeleteIcon')
    await user.click(deleteButtons[0].closest('button')!)
    
    // Click cancel in the dialog
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    expect(mockDeleteTodo).not.toHaveBeenCalled()
  })
}) 