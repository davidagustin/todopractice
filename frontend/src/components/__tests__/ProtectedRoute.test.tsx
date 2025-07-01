import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    mockUseAuth.mockClear();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('shows loading state when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // The Navigate component should be rendered
    expect(container.innerHTML).toContain('Navigate');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and not loading', () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('handles multiple children correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('calls useAuth hook correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      token: 'mock-token',
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(mockUseAuth).toHaveBeenCalledTimes(1);
  });
}); 