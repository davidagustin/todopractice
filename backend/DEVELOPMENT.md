# Development Guide

This document provides guidelines and best practices for developing the Todo application backend.

## 🚀 Quick Start

1. **Setup development environment**
   ```bash
   make dev-setup
   ```

2. **Start PostgreSQL** (using Docker)
   ```bash
   docker run --name postgres-dev \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=todoapp \
     -p 5432:5432 \
     -d postgres:15-alpine
   ```

3. **Run the application**
   ```bash
   make run
   ```

## 📋 Development Workflow

### 1. Before Starting Work

- Ensure you have the latest code: `git pull origin main`
- Run tests to ensure everything works: `make test`
- Run linter to check code quality: `make lint`

### 2. During Development

- Write tests for new features
- Follow Go best practices and idioms
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### 3. Before Committing

- Run all tests: `make test`
- Run linter: `make lint`
- Format code: `make fmt`
- Organize imports: `make imports`

### 4. Commit and Push

- Use conventional commit format
- Write descriptive commit messages
- Push to your feature branch
- Create a pull request

## 🏗️ Architecture Guidelines

### Package Structure

- **`internal/`**: Private packages, not importable by other modules
- **`pkg/`**: Public packages, can be imported by other modules
- **`cmd/`**: Application entry points

### Code Organization

1. **Handlers**: HTTP request/response handling
2. **Services**: Business logic
3. **Models**: Data structures and DTOs
4. **Middleware**: HTTP middleware functions
5. **Utils**: Helper functions and utilities

### Dependency Injection

Use dependency injection for better testability:

```go
type Service struct {
    db       *gorm.DB
    jwtUtil  *utils.JWTUtil
    validate *validator.Validate
}

func NewService(db *gorm.DB, jwtUtil *utils.JWTUtil) *Service {
    return &Service{
        db:       db,
        jwtUtil:  jwtUtil,
        validate: validator.New(),
    }
}
```

## 🧪 Testing Guidelines

### Test Structure

- **Unit tests**: Test individual functions and methods
- **Integration tests**: Test component interactions
- **End-to-end tests**: Test complete workflows

### Test Naming

Use descriptive test names that explain what is being tested:

```go
func TestUserService_Register_WithValidData_ShouldCreateUser(t *testing.T) {
    // test implementation
}

func TestUserService_Register_WithExistingEmail_ShouldReturnError(t *testing.T) {
    // test implementation
}
```

### Test Coverage

- Aim for at least 80% test coverage
- Focus on critical business logic
- Test error conditions and edge cases
- Use table-driven tests for multiple scenarios

### Mocking

Use interfaces for dependencies to enable mocking:

```go
type UserRepository interface {
    Create(user *models.User) error
    FindByEmail(email string) (*models.User, error)
}

type Service struct {
    repo UserRepository
}
```

## 🔍 Code Quality Standards

### Linting

The project uses `golangci-lint` with strict configuration:

- **Code Style**: Consistent formatting and style
- **Error Handling**: Proper error checking
- **Security**: Security vulnerability detection
- **Performance**: Performance optimization suggestions
- **Complexity**: Cyclomatic complexity analysis

### Code Review Checklist

- [ ] Code follows Go best practices
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Tests are written and passing
- [ ] Linter checks pass
- [ ] Documentation is updated
- [ ] No sensitive data in code
- [ ] Proper logging is implemented

### Common Issues to Avoid

1. **Error Handling**
   ```go
   // ❌ Bad
   result, _ := someFunction()
   
   // ✅ Good
   result, err := someFunction()
   if err != nil {
       return fmt.Errorf("failed to call someFunction: %w", err)
   }
   ```

2. **Context Usage**
   ```go
   // ❌ Bad
   func GetUser(id uint) (*User, error)
   
   // ✅ Good
   func GetUser(ctx context.Context, id uint) (*User, error)
   ```

3. **Variable Naming**
   ```go
   // ❌ Bad
   var u User
   var s string
   
   // ✅ Good
   var user User
   var email string
   ```

## 🔧 Configuration Management

### Environment Variables

Use environment variables for configuration:

```go
type Config struct {
    Server   ServerConfig   `mapstructure:"server"`
    Database DatabaseConfig `mapstructure:"database"`
    JWT      JWTConfig      `mapstructure:"jwt"`
}
```

### Configuration Validation

Validate configuration on startup:

```go
func (c *Config) Validate() error {
    if c.JWT.Secret == "" {
        return errors.New("JWT secret is required")
    }
    return nil
}
```

## 📊 Logging Guidelines

### Structured Logging

Use Zap for structured logging:

```go
logger.Info("User registered successfully",
    zap.Uint("user_id", user.ID),
    zap.String("email", user.Email),
    zap.String("ip", clientIP))
```

### Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General information about application flow
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error messages for error conditions
- **FATAL**: Fatal errors that cause application termination

### Sensitive Data

Never log sensitive information:

```go
// ❌ Bad
logger.Info("User login attempt", zap.String("password", password))

// ✅ Good
logger.Info("User login attempt", zap.String("email", email))
```

## 🔒 Security Guidelines

### Input Validation

Always validate user input:

```go
type UserRegisterRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=6"`
    Name     string `json:"name" validate:"required,min=2"`
}
```

### Authentication

- Use JWT tokens for authentication
- Implement proper token expiration
- Validate tokens on protected endpoints
- Use secure password hashing (bcrypt)

### Authorization

- Implement role-based access control
- Validate user permissions for resources
- Use middleware for authorization checks

## 🚀 Performance Guidelines

### Database Operations

- Use connection pooling
- Implement proper indexing
- Use transactions for multiple operations
- Avoid N+1 query problems

### Caching

- Cache frequently accessed data
- Use appropriate cache invalidation strategies
- Consider Redis for distributed caching

### Monitoring

- Implement health checks
- Use structured logging for monitoring
- Set up metrics collection
- Monitor application performance

## 📚 Resources

### Go Best Practices

- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Go Proverbs](https://go-proverbs.github.io/)

### Testing

- [Go Testing Package](https://golang.org/pkg/testing/)
- [Testify](https://github.com/stretchr/testify)
- [GoConvey](https://github.com/smartystreets/goconvey)

### Code Quality

- [golangci-lint](https://golangci-lint.run/)
- [Go Report Card](https://goreportcard.com/)
- [Go Vet](https://golang.org/cmd/vet/)

### Security

- [OWASP Go Security](https://owasp.org/www-project-go-secure-coding-practices-guide/)
- [Go Security Best Practices](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Go_Security_Cheat_Sheet.md) 