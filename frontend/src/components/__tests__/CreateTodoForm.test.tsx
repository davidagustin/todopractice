import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import CreateTodoForm from '../CreateTodoForm'

// Mock the useCreateTodo hook
const mockCreateTodo = vi.fn()

vi.mock('../../hooks/useTodos', () => ({
  useCreateTodo: () => ({
    mutate: mockCreateTodo,
    isPending: false,
    error: null,
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

describe('CreateTodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form elements', () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Create New Todo')).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create todo/i })).toBeInTheDocument()
  })

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup()
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const submitButton = screen.getByRole('button', { name: /create todo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('should show validation error for title exceeding max length', async () => {
    const user = userEvent.setup()
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const longTitle = 'a'.repeat(201) // Exceeds 200 character limit
    
    await user.type(titleInput, longTitle)
    
    const submitButton = screen.getByRole('button', { name: /create todo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Title must be less than 200 characters')).toBeInTheDocument()
    })
  })

  it('should show validation error for description exceeding max length', async () => {
    const user = userEvent.setup()
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const longDescription = 'a'.repeat(1001) // Exceeds 1000 character limit
    
    await user.type(titleInput, 'Valid Title')
    await user.type(descriptionInput, longDescription)
    
    const submitButton = screen.getByRole('button', { name: /create todo/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Description must be less than 1000 characters')).toBeInTheDocument()
    })
  })

  it('should call createTodo with form data on valid submission', async () => {
    const user = userEvent.setup()
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /create todo/i })

    await user.type(titleInput, 'Test Todo')
    await user.type(descriptionInput, 'Test Description')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
      }, expect.any(Object))
    })
  })

  it('should call createTodo with only title when description is empty', async () => {
    const user = userEvent.setup()
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', { name: /create todo/i })

    await user.type(titleInput, 'Test Todo')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
      }, expect.any(Object))
    })
  })

  it('should trim whitespace from title and description', async () => {
    const user = userEvent.setup()
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /create todo/i })

    await user.type(titleInput, '  Test Todo  ')
    await user.type(descriptionInput, '  Test Description  ')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
      }, expect.any(Object))
    })
  })
}) 