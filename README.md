# Fullstack Todo Application

A modern fullstack todo application built with Test-Driven Development (TDD) principles.

## 🚀 Tech Stack

### Backend
- **Go 1.24.4** with Gin web framework
- **GORM** for database ORM
- **SQLite** for local development (PostgreSQL for production)
- **JWT** authentication
- **Zap** structured logging
- **Viper** configuration management
- **Testify** for testing
- **golangci-lint** for code quality and linting

### Frontend
- **React 19** with TypeScript
- **Vite** build tool
- **Material-UI (MUI)** for component library
- **Tailwind CSS** for utility styling
- **React Hook Form** for form handling
- **TanStack Query** for server state management
- **React Router** for client-side routing
- **Jest & Testing Library** for testing
- **Cypress** for E2E testing

## 📋 Features

- ✅ User authentication (register/login)
- ✅ Create, read, update, delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Responsive design with Material-UI
- ✅ Form validation with React Hook Form
- ✅ Error handling and loading states
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Comprehensive test coverage
- ✅ Modern UI with glassmorphism effects
- ✅ GitHub Actions CI/CD pipeline
- ✅ Docker containerization
- ✅ Security scanning and analysis
- ✅ **Fully automated E2E testing**

## 🚀 Quick Start

### Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fullstackpractice
   ```

2. **Run the complete E2E test suite**
   ```bash
   ./run-e2e-complete.sh
   ```
   This script will:
   - Start the backend server with SQLite
   - Start the frontend development server
   - Run all E2E tests automatically
   - Clean up processes when done

### Manual Setup

#### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Run the server** (uses SQLite by default)
   ```bash
   go run cmd/server/main.go
   ```

4. **Run tests**
   ```bash
   go test ./...
   ```

#### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test
   ```

## 🧪 Testing

### Current Test Status

- ✅ **Backend Tests**: 100% passing (23 tests)
- ✅ **Frontend Tests**: 100% passing (36 tests)
- ✅ **E2E Tests**: 100% passing (10 tests)

### Running Tests

#### Backend Tests
```bash
cd backend
go test ./... -v
```

#### Frontend Tests
```bash
cd frontend
npm run test
```

#### E2E Tests (Automated)
```bash
# Run complete E2E suite with automation
./run-e2e-complete.sh
```

#### E2E Tests (Manual)
```bash
# Start backend server
cd backend && go run cmd/server/main.go

# Start frontend server (in another terminal)
cd frontend && npm run dev

# Run E2E tests (in another terminal)
cd frontend && npm run cypress:run
```

### Test Coverage
```bash
# Backend
cd backend
go test ./... -cover

# Frontend
cd frontend
npm run test:coverage
```

## 📁 Project Structure

```
fullstackpractice/
├── .github/                    # GitHub Actions workflows
│   ├── workflows/             # CI/CD pipelines
│   │   ├── ci.yml            # Main CI/CD pipeline
│   │   ├── docker-build.yml  # Docker build and push
│   │   ├── deploy.yml        # Deployment workflow
│   │   ├── security.yml      # Security analysis
│   │   └── performance.yml   # Performance testing
│   └── README.md             # GitHub Actions documentation
├── backend/                   # Go backend application
│   ├── cmd/server/           # Application entry point
│   │   └── main.go           # Server entry point
│   ├── internal/             # Internal packages (not importable)
│   │   ├── auth/             # Authentication handlers and services
│   │   ├── config/           # Configuration management
│   │   ├── database/         # Database connection and migrations
│   │   └── todo/             # Todo business logic
│   ├── pkg/                  # Public packages (importable)
│   │   ├── middleware/       # HTTP middleware
│   │   ├── models/           # Data models and DTOs
│   │   └── utils/            # Utility functions
│   ├── tests/                # Test files
│   │   ├── integration/      # Integration tests
│   │   └── unit/             # Unit tests
│   ├── config.yaml           # Configuration file
│   ├── .golangci.yml         # Linter configuration
│   ├── go.mod                # Go module file
│   ├── go.sum                # Go module checksums
│   ├── README.md             # Backend documentation
│   └── DEVELOPMENT.md        # Development guidelines
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── styles/           # CSS styles
│   │   └── types/            # TypeScript types
│   ├── cypress/              # E2E tests
│   ├── Dockerfile            # Frontend Docker image
│   ├── nginx.conf            # Nginx configuration
│   ├── README.md             # Frontend documentation
│   └── CSS_BEST_PRACTICES.md # CSS guidelines
├── docker-compose.yml        # Docker orchestration
├── deploy.sh                 # Deployment script
├── run-e2e-complete.sh       # E2E test automation script
├── TESTING.md                # Testing documentation
├── TESTING_STRATEGY.md       # Testing strategy
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: todoapp)
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 8080)
- `DB_TYPE` - Database type (sqlite/postgres, default: sqlite for local dev)

#### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080)

## 🚦 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile

### Todos
- `GET /api/v1/todos` - Get all todos
- `POST /api/v1/todos` - Create new todo
- `PUT /api/v1/todos/:id` - Update todo
- `DELETE /api/v1/todos/:id` - Delete todo

### Health Check
- `GET /health` - Health check endpoint

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention with GORM
- XSS protection headers
- Input validation and sanitization

## 🚀 Production Deployment

### Docker Compose (Recommended)
The application is containerized and can be deployed using Docker Compose on any Docker-compatible environment.

### GitHub Actions CI/CD
The project includes automated CI/CD pipelines for:
- **Automated Testing**: All tests run on every push/PR
- **Security Scanning**: Vulnerability detection and analysis
- **Docker Builds**: Multi-platform container images
- **Deployment**: Automated deployment to staging/production

### Cloud Deployment Options

1. **Digital Ocean App Platform**
2. **AWS ECS/Fargate**
3. **Google Cloud Run**
4. **Heroku**
5. **Railway**
6. **Render**
7. **GitHub Actions** (with self-hosted runners)

### Environment-Specific Configuration

For production deployment, make sure to:

1. Change the JWT secret
2. Use strong database passwords
3. Enable SSL/TLS
4. Configure proper CORS origins
5. Set up monitoring and logging
6. Configure backup strategies
7. Set up GitHub Actions secrets for deployment

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
   # Backend
   cd backend
   go test ./... -v
   golangci-lint run ./...
   
   # Frontend
   cd frontend
   npm run test
   npm run lint
   
   # E2E tests
   ./run-e2e-complete.sh
   ```

5. **Commit your changes** (use conventional commit format)
   ```bash
   git commit -m "feat: add new feature"
   ```

6. **Submit a pull request**

### Code Standards

- Follow language-specific best practices
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

## 👥 Authors

Built with ❤️ using Test-Driven Development principles. 