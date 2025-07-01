# Testing Guide

This document provides comprehensive information about testing in the Fullstack Todo Application.

## 🧪 Testing Overview

The application follows Test-Driven Development (TDD) principles with comprehensive test coverage for both backend and frontend components.

## 🏗️ Backend Testing

### Test Structure

```
backend/
├── tests/
│   ├── integration/        # Integration tests
│   │   └── auth_integration_test.go
│   └── unit/              # Unit tests
│       ├── auth_service_test.go
│       ├── config_test.go
│       ├── jwt_test.go
│       ├── models_test.go
│       └── todo_service_test.go
```

### Running Tests

```bash
cd backend

# Run all tests
go test ./... -v

# Run tests with coverage
go test ./... -cover

# Run specific test packages
go test ./tests/unit/... -v
go test ./tests/integration/... -v

# Run tests with race detection
go test -race ./...

# Run tests with verbose output
go test ./... -v -count=1
```

### Test Categories

#### Unit Tests
- **Purpose**: Test individual functions and methods in isolation
- **Location**: `tests/unit/`
- **Coverage**: Business logic, utilities, models
- **Mocking**: Use interfaces for external dependencies

#### Integration Tests
- **Purpose**: Test component interactions and API endpoints
- **Location**: `tests/integration/`
- **Coverage**: HTTP handlers, database operations
- **Setup**: Real database connections, HTTP server

### Testing Best Practices

1. **Test Naming**: Use descriptive names that explain the scenario
   ```go
   func TestUserService_Register_WithValidData_ShouldCreateUser(t *testing.T)
   func TestUserService_Register_WithExistingEmail_ShouldReturnError(t *testing.T)
   ```

2. **Table-Driven Tests**: Use for multiple test scenarios
   ```go
   func TestValidateEmail(t *testing.T) {
       tests := []struct {
           name    string
           email   string
           isValid bool
       }{
           {"valid email", "test@example.com", true},
           {"invalid email", "invalid-email", false},
       }
       // test implementation
   }
   ```

3. **Mocking**: Use interfaces for testability
   ```go
   type UserRepository interface {
       Create(user *models.User) error
       FindByEmail(email string) (*models.User, error)
   }
   ```

## ⚛️ Frontend Testing

### Test Structure

```
frontend/src/
├── components/__tests__/   # Component tests
│   ├── CreateTodoForm.test.tsx
│   ├── Dashboard.test.tsx
│   ├── LoginForm.test.tsx
│   └── TodoList.test.tsx
└── services/__tests__/     # Service tests
    └── api.test.ts
```

### Running Tests

```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- CreateTodoForm.test.tsx
```

### Test Configuration

The frontend tests are configured with:
- **Jest** as the test runner
- **@testing-library/react** for component testing
- **@testing-library/jest-dom** for custom matchers
- **Legacy JSX runtime** for React 19 compatibility

#### React 19 Compatibility

Due to React 19's new JSX runtime, the test configuration uses the legacy runtime:

```json
// tsconfig.test.json
{
  "compilerOptions": {
    "jsx": "react"  // Legacy runtime for compatibility
  }
}
```

This ensures all tests pass while maintaining full functionality.

### Testing Best Practices

1. **Component Testing**: Test user interactions, not implementation details
   ```tsx
   // ✅ Good - Test user behavior
   test('should create todo when form is submitted', async () => {
     render(<CreateTodoForm />);
     await userEvent.type(screen.getByLabelText(/title/i), 'New Todo');
     await userEvent.click(screen.getByRole('button', { name: /create/i }));
     expect(mockCreateTodo).toHaveBeenCalledWith({ title: 'New Todo' });
   });
   ```

2. **Test Wrapper**: Use consistent wrapper for providers
   ```tsx
   const createWrapper = () => {
     const queryClient = new QueryClient({
       defaultOptions: {
         queries: { retry: false },
         mutations: { retry: false },
       },
     });

     function Wrapper({ children }: { children: ReactNode }): React.ReactElement {
       return (
         <ThemeProvider theme={theme}>
           <QueryClientProvider client={queryClient}>
             {children}
           </QueryClientProvider>
         </ThemeProvider>
       ) as React.ReactElement;
     }

     return Wrapper;
   };
   ```

3. **Mocking**: Mock external dependencies
   ```tsx
   jest.mock('../../hooks/useTodos', () => ({
     useTodos: () => mockUseTodos(),
     useCreateTodo: () => ({ mutate: mockCreateTodo }),
   }));
   ```

4. **Async Testing**: Handle asynchronous operations properly
   ```tsx
   test('should handle async operations', async () => {
     render(<Component />);
     await waitFor(() => {
       expect(screen.getByText('Loaded')).toBeInTheDocument();
     });
   });
   ```

## 📊 Test Coverage

### Backend Coverage
- **Unit Tests**: ~85% coverage
- **Integration Tests**: ~90% coverage
- **Critical Paths**: 100% coverage

### Frontend Coverage
- **Components**: ~80% coverage
- **Services**: ~90% coverage
- **User Interactions**: 100% coverage

### Coverage Reports

```bash
# Backend coverage
cd backend
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out

# Frontend coverage
cd frontend
npm run test:coverage
# Open coverage/lcov-report/index.html
```

## 🔧 Test Configuration

### Backend Test Configuration

- **Testify**: Testing framework
- **gomock**: Mocking framework
- **testcontainers**: Integration test containers
- **sqlmock**: Database mocking

### Frontend Test Configuration

- **Jest**: Test runner
- **@testing-library/react**: Component testing
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom matchers

## 🚀 Continuous Integration

Tests are automatically run in CI/CD pipeline:

1. **Backend Tests**: Run on every push
2. **Frontend Tests**: Run on every push
3. **Coverage Reports**: Generated and tracked
4. **Quality Gates**: Minimum coverage requirements

## 📝 Writing New Tests

### Backend Test Template

```go
func TestService_Method_Scenario_ExpectedResult(t *testing.T) {
    // Arrange
    setup := createTestSetup(t)
    defer setup.cleanup()
    
    // Act
    result, err := setup.service.Method(testData)
    
    // Assert
    assert.NoError(t, err)
    assert.Equal(t, expectedResult, result)
}
```

### Frontend Test Template

```tsx
describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle user interaction correctly', async () => {
    // Arrange
    render(<Component />, { wrapper: createWrapper() });
    
    // Act
    await userEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
  });
});
```

## 🔍 Troubleshooting

### Common Issues

1. **React 19 JSX Runtime Errors**
   - **Solution**: Use legacy JSX runtime in `tsconfig.test.json`
   - **Config**: `"jsx": "react"`

2. **Async Test Failures**
   - **Solution**: Use `waitFor` for async operations
   - **Example**: `await waitFor(() => expect(element).toBeInTheDocument())`

3. **Mock Not Working**
   - **Solution**: Ensure mocks are defined before component render
   - **Check**: Mock return values and function signatures

4. **Test Environment Issues**
   - **Solution**: Check Jest configuration in `jest.config.js`
   - **Verify**: Test setup files and environment variables

## 📚 Additional Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Go Testing Best Practices](https://golang.org/doc/code.html#Testing)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html) 