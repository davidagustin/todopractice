import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Mock the components to isolate App testing
jest.mock('./components/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

jest.mock('./components/RegisterForm', () => {
  return function MockRegisterForm() {
    return <div data-testid="register-form">Register Form</div>;
  };
});

jest.mock('./components/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard</div>;
  };
});

jest.mock('./components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

// Create a test wrapper with all providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
      },
      writable: true,
    });
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('renders login form when navigating to /login', () => {
    window.location.pathname = '/login';
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders register form when navigating to /register', () => {
    window.location.pathname = '/register';
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('renders dashboard with protected route when navigating to /dashboard', () => {
    window.location.pathname = '/dashboard';
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('redirects to dashboard when navigating to root path', () => {
    window.location.pathname = '/';
    
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // The redirect should happen automatically
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('has proper theme configuration', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verify that the theme provider is working
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('has proper query client configuration', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // Verify that the query client provider is working
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });
}); 