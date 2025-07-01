import React, { type ReactNode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthProvider } from '../../contexts/AuthContext'
import LoginForm from '../LoginForm'

// Mock the useLogin hook
const mockLogin = vi.fn()
vi.mock('../../hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: mockLogin,
    isPending: false,
    error: null,
  }),
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

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
          <AuthProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    ) as React.ReactElement;
  }

  return Wrapper;
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    render(<LoginForm />, { wrapper: createWrapper() })
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should call login mutation with form data on valid submission', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should prevent form submission with invalid email format', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    // Should not call login mutation
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should show password length validation error', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, '123')
    await userEvent.click(submitButton)

    // Should not call login mutation
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('should prevent form submission with empty fields', async () => {
    render(<LoginForm />, { wrapper: createWrapper() })
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await userEvent.click(submitButton)

    // Should not call login mutation
    expect(mockLogin).not.toHaveBeenCalled()
  })
}) 