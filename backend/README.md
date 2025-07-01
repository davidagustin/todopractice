# Backend - Todo Application

A robust Go backend for the Todo application built with clean architecture principles and comprehensive testing.

## 🚀 Tech Stack

- **Go 1.24.4** - Programming language
- **Gin** - HTTP web framework
- **GORM** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Zap** - Structured logging
- **Viper** - Configuration management
- **Testify** - Testing framework
- **golangci-lint** - Code linting and quality checks

## 📁 Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go          # Application entry point
├── internal/                # Internal packages (not importable)
│   ├── auth/               # Authentication handlers and services
│   ├── config/             # Configuration management
│   ├── database/           # Database connection and migrations
│   └── todo/               # Todo business logic
├── pkg/                    # Public packages (importable)
│   ├── middleware/         # HTTP middleware
│   ├── models/             # Data models and DTOs
│   └── utils/              # Utility functions
├── tests/                  # Test files
│   ├── integration/        # Integration tests
│   └── unit/               # Unit tests
├── config.yaml             # Configuration file
├── go.mod                  # Go module file
├── go.sum                  # Go module checksums
├── .golangci.yml           # Linter configuration
└── README.md               # This file
```

## 🛠️ Development Setup

### Prerequisites

- Go 1.24.4 or later
- PostgreSQL 12 or later
- golangci-lint (for code quality)

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install Go dependencies**
   ```bash
   go mod download
   ```

3. **Install golangci-lint** (if not already installed)
   ```bash
   curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.61.0
   ```

4. **Set up PostgreSQL**
   ```bash
   # Using Docker
   docker run --name postgres-dev \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=todoapp \
     -p 5432:5432 \
     -d postgres:15-alpine
   ```

5. **Run the application**
   ```bash
   go run cmd/server/main.go
   ```

### Using Makefile (Recommended)

The project includes a Makefile for common development tasks:

```bash
# Show all available commands
make help

# Setup development environment
make dev-setup

# Run the application
make run

# Run tests
make test

# Run linter
make lint

# Auto-fix linting issues
make lint-fix

# Run pre-commit checks
make pre-commit
```

## 🧪 Testing

### Run All Tests
```bash
go test ./... -v
```

### Run Tests with Coverage
```bash
go test ./... -cover
```

### Run Specific Test Packages
```bash
# Unit tests
go test ./tests/unit/... -v

# Integration tests
go test ./tests/integration/... -v
```

### Run Tests with Race Detection
```bash
go test -race ./...
```

## 🔍 Code Quality

### Linting

This project uses `golangci-lint` for comprehensive code quality checks.

#### Run Linter
```bash
golangci-lint run ./...
```

#### Run Linter with Specific Linters
```bash
# Run only specific linters
golangci-lint run --disable-all --enable=govet,errcheck,staticcheck ./...

# Run with specific configuration
golangci-lint run --config=.golangci.yml ./...
```

#### Auto-fix Issues
```bash
# Format code
go fmt ./...

# Run gofumpt (stricter formatting)
gofumpt -w .

# Run goimports (organize imports)
goimports -w .
```

### Code Quality Checks

The linter configuration includes:

- **Code Style**: `gofmt`, `gofumpt`, `goimports`
- **Error Handling**: `errcheck`, `errorlint`
- **Security**: `gosec`
- **Performance**: `staticcheck`, `gosimple`
- **Complexity**: `gocyclo`, `cyclop`
- **Documentation**: `godot`
- **Best Practices**: `revive`, `gocritic`

## 🏗️ Architecture

### Clean Architecture Principles

The backend follows clean architecture principles with clear separation of concerns:

1. **Handlers** (`internal/auth/handler.go`, `internal/todo/handler.go`)
   - Handle HTTP requests and responses
   - Input validation and error handling
   - Call appropriate services

2. **Services** (`internal/auth/service.go`, `internal/todo/service.go`)
   - Business logic implementation
   - Data validation and processing
   - Database operations through repositories

3. **Models** (`pkg/models/`)
   - Data structures and DTOs
   - Database models with GORM tags
   - Request/Response structures

4. **Middleware** (`pkg/middleware/`)
   - Authentication middleware
   - CORS handling
   - Request logging

5. **Utilities** (`pkg/utils/`)
   - JWT token management
   - Helper functions

### Dependency Injection

The application uses dependency injection for better testability:

```go
// Services depend on interfaces, not concrete implementations
type Service struct {
    db       *gorm.DB
    jwtUtil  *utils.JWTUtil
    validate *validator.Validate
}
```

## 🔧 Configuration

### Environment Variables

The application supports configuration through environment variables and config files:

```bash
# Server configuration
PORT=8080
HOST=localhost

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=todoapp
DB_SSLMODE=disable

# JWT configuration
JWT_SECRET=your-secret-key
JWT_EXPIRY_HOUR=24
```

### Configuration File

The application uses `config.yaml` for default configuration:

```yaml
server:
  port: "8080"
  host: "localhost"

database:
  host: "localhost"
  port: "5432"
  user: "postgres"
  password: "password"
  dbname: "todoapp"
  sslmode: "disable"

jwt:
  secret: "your-secret-key"
  expiry_hour: 24
```

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Todos
- `GET /api/v1/todos` - Get all todos (protected)
- `POST /api/v1/todos` - Create new todo (protected)
- `GET /api/v1/todos/:id` - Get specific todo (protected)
- `PUT /api/v1/todos/:id` - Update todo (protected)
- `DELETE /api/v1/todos/:id` - Delete todo (protected)

### Health Check
- `GET /health` - Health check endpoint

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configurable CORS headers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: GORM parameterized queries
- **Error Handling**: Secure error responses

## 📊 Monitoring and Logging

### Structured Logging

The application uses Zap for structured logging:

```go
logger.Info("User registered successfully", 
    zap.Uint("user_id", user.ID),
    zap.String("email", user.Email))
```

### Health Checks

The application provides health check endpoints for monitoring:

```bash
curl http://localhost:8080/health
```

## 🚀 Production Deployment

### Docker

```bash
# Build the image
docker build -t todoapp-backend .

# Run the container
docker run -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-db-password \
  -e JWT_SECRET=your-jwt-secret \
  todoapp-backend
```

### Environment-Specific Configuration

For production deployment:

1. **Security**
   - Use strong JWT secrets
   - Enable SSL/TLS
   - Configure proper CORS origins
   - Use environment variables for sensitive data

2. **Database**
   - Use connection pooling
   - Configure proper indexes
   - Set up backup strategies

3. **Monitoring**
   - Set up application monitoring
   - Configure log aggregation
   - Set up health check monitoring

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
4. **Run tests and linter**
   ```bash
   go test ./... -v
   golangci-lint run ./...
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```

6. **Push and create a pull request**

### Code Standards

- Follow Go best practices and idioms
- Write comprehensive tests
- Ensure all linter checks pass
- Use meaningful commit messages
- Document public APIs

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📄 License

This project is licensed under the MIT License. 