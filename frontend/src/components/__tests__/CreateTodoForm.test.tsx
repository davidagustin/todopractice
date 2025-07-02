/** @jsxImportSource react */
import React from 'react'
import type { ReactNode } from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CreateTodoForm from '../CreateTodoForm'

// Mock the useCreateTodo hook
const mockCreateTodo = vi.fn()
const mockUseCreateTodo = vi.fn()

vi.mock('../../hooks/useTodos', () => ({
  useCreateTodo: () => mockUseCreateTodo(),
}))

const theme = createTheme()

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: ReactNode }): React.ReactElement {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    ) as React.ReactElement;
  }

  return Wrapper;
}

describe('CreateTodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCreateTodo.mockReturnValue({
      mutate: mockCreateTodo,
      isPending: false,
      error: null,
    })
  })

  it('should render form elements', () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Create New Todo')).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create todo/i })).toBeInTheDocument()
  })

  it('should show validation error for empty title', async () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const submitButton = screen.getByRole('button', { name: /create todo/i })
    await userEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('should show validation error for description exceeding max length', async () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    
    await userEvent.type(titleInput, 'Valid Title')
    
    // Use fireEvent to directly set the value and bypass maxlength restriction
    const longDescription = 'a'.repeat(1001)
    fireEvent.change(descriptionInput, { target: { value: longDescription } })
    
    const submitButton = screen.getByRole('button', { name: /create todo/i })
    await userEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Description must be less than 1000 characters')).toBeInTheDocument()
    })
  })

  it('should call createTodo with form data on valid submission', async () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /create todo/i })

    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Test Todo')
    await userEvent.clear(descriptionInput)
    await userEvent.type(descriptionInput, 'Test Description')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
      }, expect.any(Object))
    })
  })

  it('should call createTodo with only title when description is empty', async () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const submitButton = screen.getByRole('button', { name: /create todo/i })

    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Test Todo')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: '',
      }, expect.any(Object))
    })
  })

  it('should trim whitespace from title and description', async () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const submitButton = screen.getByRole('button', { name: /create todo/i })

    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, '  Test Todo  ')
    await userEvent.clear(descriptionInput)
    await userEvent.type(descriptionInput, '  Test Description  ')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
      }, expect.any(Object))
    })
  })

  it('should accept title at maximum length', async () => {
    render(<CreateTodoForm />, { wrapper: createWrapper() })
    
    const titleInput = screen.getByLabelText(/title/i)
    const maxLengthTitle = 'a'.repeat(200) // Exactly 200 characters (at the limit)
    
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, maxLengthTitle)
    
    const submitButton = screen.getByRole('button', { name: /create todo/i })
    await userEvent.click(submitButton)
    
    // Should accept title at maximum length
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: maxLengthTitle,
        description: '',
      }, expect.any(Object))
    })
  })
}) 