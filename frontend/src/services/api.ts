import type {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetProfileResponse,
  GetTodosResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '../types/index';

const API_BASE_URL =
  typeof process !== 'undefined' && process.env && process.env.VITE_API_URL
    ? process.env.VITE_API_URL
    : 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.error || 'Request failed');
  }

  return response.json();
};

const authenticatedRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
};

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (): Promise<GetProfileResponse> => authenticatedRequest('/auth/profile'),
};

// Todo API
export const todoApi = {
  getAll: (): Promise<GetTodosResponse> => authenticatedRequest('/todos'),

  create: (data: CreateTodoRequest): Promise<CreateTodoResponse> =>
    authenticatedRequest('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateTodoRequest): Promise<UpdateTodoResponse> =>
    authenticatedRequest(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number): Promise<DeleteTodoResponse> =>
    authenticatedRequest(`/todos/${id}`, {
      method: 'DELETE',
    }),
};
