import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthContext } from '../AuthContext';
import { authApi } from '../../services/api';

// Mock the API
jest.mock('../../services/api', () => ({
  authApi: {
    getProfile: jest.fn(),
  },
}));

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

describe('AuthContext', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('provides initial loading state', () => {
    renderWithProviders(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            expect(value?.isLoading).toBe(true);
            expect(value?.user).toBe(null);
            expect(value?.token).toBe(null);
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
  });

  it('initializes with stored token and valid user', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    const mockToken = 'valid-token';
    
    localStorage.setItem('token', mockToken);
    mockAuthApi.getProfile.mockResolvedValue({ user: mockUser });

    await act(async () => {
      renderWithProviders(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              if (!value?.isLoading) {
                expect(value?.user).toEqual(mockUser);
                expect(value?.token).toBe(mockToken);
              }
              return <div>Test</div>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    expect(mockAuthApi.getProfile).toHaveBeenCalled();
  });

  it('removes invalid token from localStorage', async () => {
    localStorage.setItem('token', 'invalid-token');
    mockAuthApi.getProfile.mockRejectedValue(new Error('Invalid token'));

    await act(async () => {
      renderWithProviders(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              if (!value?.isLoading) {
                expect(value?.user).toBe(null);
                expect(value?.token).toBe(null);
              }
              return <div>Test</div>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    expect(localStorage.getItem('token')).toBe(null);
  });

  it('provides login function', async () => {
    let authValue: any;
    
    await act(async () => {
      renderWithProviders(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              authValue = value;
              return <div>Test</div>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    const mockToken = 'new-token';

    act(() => {
      authValue?.login(mockToken, mockUser);
    });

    expect(authValue?.user).toEqual(mockUser);
    expect(authValue?.token).toBe(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('provides logout function', async () => {
    let authValue: any;
    
    // First login
    localStorage.setItem('token', 'existing-token');
    
    await act(async () => {
      renderWithProviders(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              authValue = value;
              return <div>Test</div>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    act(() => {
      authValue?.logout();
    });

    expect(authValue?.user).toBe(null);
    expect(authValue?.token).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
  });

  it('handles multiple login/logout cycles', async () => {
    let authValue: any;
    
    await act(async () => {
      renderWithProviders(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              authValue = value;
              return <div>Test</div>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    const user1 = { id: 1, email: 'user1@example.com', name: 'User 1' };
    const user2 = { id: 2, email: 'user2@example.com', name: 'User 2' };
    const token1 = 'token1';
    const token2 = 'token2';

    // First login
    act(() => {
      authValue?.login(token1, user1);
    });

    expect(authValue?.user).toEqual(user1);
    expect(authValue?.token).toBe(token1);

    // Logout
    act(() => {
      authValue?.logout();
    });

    expect(authValue?.user).toBe(null);
    expect(authValue?.token).toBe(null);

    // Second login
    act(() => {
      authValue?.login(token2, user2);
    });

    expect(authValue?.user).toEqual(user2);
    expect(authValue?.token).toBe(token2);
  });

  it('maintains loading state during initialization', () => {
    let loadingStates: boolean[] = [];
    
    renderWithProviders(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            loadingStates.push(value?.isLoading || false);
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Should start with loading true
    expect(loadingStates[0]).toBe(true);
  });

  it('provides consistent context structure', async () => {
    let authValue: any;
    
    await act(async () => {
      renderWithProviders(
        <AuthProvider>
          <AuthContext.Consumer>
            {(value) => {
              authValue = value;
              return <div>Test</div>;
            }}
          </AuthContext.Consumer>
        </AuthProvider>
      );
    });

    expect(authValue).toHaveProperty('user');
    expect(authValue).toHaveProperty('token');
    expect(authValue).toHaveProperty('login');
    expect(authValue).toHaveProperty('logout');
    expect(authValue).toHaveProperty('isLoading');
    expect(typeof authValue?.login).toBe('function');
    expect(typeof authValue?.logout).toBe('function');
    expect(typeof authValue?.isLoading).toBe('boolean');
  });
}); 