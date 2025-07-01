export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export interface GetProfileResponse {
  user: User;
}

export interface TodoResponse {
  message?: string;
  todo?: Todo;
  todos?: Todo[];
}

export interface GetTodosResponse {
  todos: Todo[];
}

export interface CreateTodoResponse {
  message: string;
  todo: Todo;
}

export interface UpdateTodoResponse {
  message: string;
  todo: Todo;
}

export interface DeleteTodoResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
} 