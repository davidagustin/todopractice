import { authApi, todoApi, ApiError } from '../api'

// Mock fetch globally
;(globalThis as typeof globalThis & { fetch: jest.Mock }).fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
  })

  describe('authApi', () => {
    describe('login', () => {
      it('should make a POST request to login endpoint', async () => {
        const mockResponse = {
          message: 'Login successful',
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          token: 'mock-token'
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await authApi.login({
          email: 'test@example.com',
          password: 'password123'
        })

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123'
            }),
          }
        )
        expect(result).toEqual(mockResponse)
      })

      it('should throw ApiError on failed login', async () => {
        jest.mocked(fetch).mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ error: 'Invalid credentials' }),
        } as Response)

        await expect(
          authApi.login({ email: 'test@example.com', password: 'wrong' })
        ).rejects.toThrow(ApiError)
      })
    })

    describe('register', () => {
      it('should make a POST request to register endpoint', async () => {
        const mockResponse = {
          message: 'User registered successfully',
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          token: 'mock-token'
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await authApi.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        })

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123',
              name: 'Test User'
            }),
          }
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe('getProfile', () => {
      it('should include authorization header when token exists', async () => {
        localStorageMock.getItem.mockReturnValue('mock-token')
        
        const mockResponse = {
          user: { id: 1, email: 'test@example.com', name: 'Test User' }
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await authApi.getProfile()

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/auth/profile',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
          }
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })

  describe('todoApi', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('mock-token')
    })

    describe('getAll', () => {
      it('should fetch all todos with authorization header', async () => {
        const mockResponse = {
          todos: [
            {
              id: 1,
              title: 'Test Todo',
              description: 'Test Description',
              completed: false,
              user_id: 1,
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z'
            }
          ]
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await todoApi.getAll()

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/todos',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
          }
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe('create', () => {
      it('should create a new todo', async () => {
        const mockResponse = {
          message: 'Todo created successfully',
          todo: {
            id: 1,
            title: 'New Todo',
            description: 'New Description',
            completed: false,
            user_id: 1,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          }
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await todoApi.create({
          title: 'New Todo',
          description: 'New Description'
        })

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/todos',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
            body: JSON.stringify({
              title: 'New Todo',
              description: 'New Description'
            }),
          }
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe('update', () => {
      it('should update a todo', async () => {
        const mockResponse = {
          message: 'Todo updated successfully',
          todo: {
            id: 1,
            title: 'Updated Todo',
            description: 'Updated Description',
            completed: true,
            user_id: 1,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          }
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await todoApi.update(1, {
          title: 'Updated Todo',
          completed: true
        })

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/todos/1',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
            body: JSON.stringify({
              title: 'Updated Todo',
              completed: true
            }),
          }
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe('delete', () => {
      it('should delete a todo', async () => {
        const mockResponse = {
          message: 'Todo deleted successfully'
        }

        jest.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        const result = await todoApi.delete(1)

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/v1/todos/1',
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer mock-token',
            },
          }
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })
}) 