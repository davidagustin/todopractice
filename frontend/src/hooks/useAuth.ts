import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import type { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      login(response.token, response.user);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/dashboard');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      login(response.token, response.user);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/dashboard');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return () => {
    logout();
    navigate('/login');
  };
}; 