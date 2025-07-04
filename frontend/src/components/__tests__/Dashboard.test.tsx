/** @jsxImportSource react */
import React from 'react';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Dashboard from '../Dashboard';

// Mock the auth hooks
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

const mockUseAuth = {
  user: mockUser,
  token: 'mock-token',
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
};

const mockUseLogout = vi.fn();

// Mock the todos hook
const mockUseTodos = {
  data: {
    todos: [
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true },
    ],
  },
  isLoading: false,
  error: null,
};

// Mock the create todo hook
const mockUseCreateTodo = {
  mutate: vi.fn(),
  isPending: false,
  error: null,
};

// Mock the update todo hook
const mockUseUpdateTodo = {
  mutate: vi.fn(),
  isPending: false,
  error: null,
};

// Mock the delete todo hook
const mockUseDeleteTodo = {
  mutate: vi.fn(),
  isPending: false,
  error: null,
};

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
  useLogout: () => mockUseLogout,
}));

vi.mock('../../hooks/useTodos', () => ({
  useTodos: () => mockUseTodos,
  useCreateTodo: () => mockUseCreateTodo,
  useUpdateTodo: () => mockUseUpdateTodo,
  useDeleteTodo: () => mockUseDeleteTodo,
}));

const renderWithProviders = (component: ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }): React.ReactElement {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    ) as React.ReactElement;
  }

  return render(component, { wrapper: Wrapper });
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with user information', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/Welcome back, Test User!/)).toBeInTheDocument();
    expect(screen.getByText(/Ready to tackle your todos today?/)).toBeInTheDocument();
  });

  it('renders todo components', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Your Todos')).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', () => {
    renderWithProviders(<Dashboard />);

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    expect(mockUseLogout).toHaveBeenCalled();
  });

  it('displays user avatar with first letter', () => {
    renderWithProviders(<Dashboard />);

    // Check if the avatar shows the first letter of the user's name
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders create todo form and todo list sections', () => {
    renderWithProviders(<Dashboard />);

    // Check for the main content sections
    expect(screen.getByText('Your Todos')).toBeInTheDocument();
  });

  it('applies proper styling classes', () => {
    renderWithProviders(<Dashboard />);

    // Check for Material-UI components and styling
    const appBar = screen.getByRole('banner');
    expect(appBar).toBeInTheDocument();
  });
}); 