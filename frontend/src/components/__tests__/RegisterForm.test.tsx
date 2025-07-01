import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterForm from '../RegisterForm';
import { useRegister } from '../../hooks/useAuth';

// Mock the useRegister hook
jest.mock('../../hooks/useAuth', () => ({
  useRegister: jest.fn(),
  useAuth: jest.fn(),
}));

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

describe('RegisterForm Component', () => {
  const mockMutate = jest.fn();
  const mockIsPending = false;
  const mockError = null;

  beforeEach(() => {
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: mockIsPending,
      error: mockError,
      isError: false,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders register form with all fields', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('allows typing in form fields', () => {
    renderWithProviders(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct data', async () => {
    renderWithProviders(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  it('shows loading state when form is submitting', () => {
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: mockError,
      isError: false,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
    });

    renderWithProviders(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/registering/i);
  });

  it('shows error message when registration fails', () => {
    const mockError = new Error('Registration failed');
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
    });

    renderWithProviders(<RegisterForm />);

    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    renderWithProviders(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('validates password minimum length', async () => {
    renderWithProviders(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('clears form after successful submission', async () => {
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: true,
      data: undefined,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
    });

    renderWithProviders(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  it('handles form reset', () => {
    renderWithProviders(<RegisterForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Reset form
    fireEvent.reset(nameInput.form!);

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });
}); 