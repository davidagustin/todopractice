[![CI](https://github.com/davidagustin/todopractice/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/davidagustin/todopractice/actions/workflows/ci.yml)

# Fullstack Todo Application

A modern fullstack todo application built with Test-Driven Development (TDD) principles, featuring comprehensive testing, automation, and modern development practices.

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
- **Vite** build tool and development server
- **Material-UI (MUI)** for component library
- **Tailwind CSS** for utility styling
- **React Hook Form** for form handling
- **TanStack Query** for server state management
- **React Router** for client-side routing
- **Jest & Testing Library** for testing
- **Cypress** for E2E testing
- **Biome** for linting and formatting

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
- ✅ GitLab CI/CD pipeline
- ✅ Docker containerization
- ✅ Security scanning and analysis
- ✅ **Fully automated E2E testing**
- ✅ **Clean, organized codebase with proper import ordering**

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

5. **Run linter**
   ```bash
   npm run lint
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 🧪 Testing

### Current Test Status

- ✅ **Backend Tests**: 100% passing (comprehensive unit and integration tests)
- ✅ **Frontend Tests**: 100% passing (64 tests covering all components and hooks)
- ✅ **E2E Tests**: 100% passing (10 tests covering authentication and todo management)
- ✅ **Code Coverage**: High coverage across all components and services
- ✅ **Linting**: All code passes Biome linting rules

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

#### Frontend Linting
```bash
cd frontend
npm run lint
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

### Test Configuration

#### Frontend Test Configuration

The frontend tests are configured with:
- **Jest** as the test runner
- **@testing-library/react** for component testing
- **@testing-library/jest-dom** for custom matchers
- **Legacy JSX runtime** for React 19 compatibility
- **Cypress** for E2E testing with Vite integration
- **Biome** for linting and formatting

#### React 19 Compatibility

Due to React 19's new JSX runtime, the test configuration uses the legacy runtime in `tsconfig.test.json`:

```json
{
  "compilerOptions": {
    "jsx": "react"  // Legacy runtime for compatibility
  }
}
```

#### Vite Integration for E2E

The Vite configuration is optimized for E2E testing:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',    // Listen on all interfaces
    port: 5173,         // Fixed port for consistency
    strictPort: true,   // Fail if port is in use
  },
})
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
│   │   │   ├── __tests__/    # Component tests
│   │   │   ├── CreateTodoForm.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── TodoList.tsx
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useTodos.ts
│   │   ├── services/         # API services
│   │   │   ├── __tests__/    # Service tests
│   │   │   └── api.ts
│   │   ├── styles/           # CSS styles
│   │   │   ├── components.css
│   │   │   └── utilities.css
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   ├── cypress/              # E2E tests
│   ├── biome.json            # Biome linting configuration
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
├── docker-compose.yml        # Docker orchestration
├── deploy.sh                 # Deployment script
├── run-e2e-complete.sh       # E2E test automation script
├── run-e2e.sh               # Basic E2E test runner
├── test-suite.sh            # Complete test suite runner
├── TESTING.md               # Testing documentation
├── .gitignore               # Git ignore rules
├── .gitlab-ci.yml           # GitLab CI/CD configuration
└── README.md                # This file
```

## 🎨 Frontend Features

### Material-UI (MUI)

The application uses Material-UI as the primary component library:

- **Modern Components**: Pre-built, accessible components
- **Theme System**: Consistent design tokens and theming
- **Responsive Design**: Mobile-first responsive components
- **Glassmorphism Effects**: Modern UI with backdrop blur and transparency
- **Gradient Backgrounds**: Beautiful gradient themes throughout the app

### Tailwind CSS Integration

Tailwind CSS is used for utility styling and custom components:

- **Utility Classes**: Rapid UI development with utility-first approach
- **Custom Components**: Reusable component patterns
- **Responsive Utilities**: Mobile-first responsive design
- **Custom Properties**: CSS custom properties for consistent theming

### UI Features

- **Modern Login/Register Forms**: Glassmorphism design with gradient backgrounds
- **Responsive Dashboard**: Adaptive layout for all screen sizes
- **Interactive Todo Cards**: Hover effects and smooth transitions
- **Loading States**: Beautiful loading animations and spinners
- **Error Handling**: User-friendly error messages and alerts

### User Experience

- **Authentication**: User registration and login with modern UI
- **Todo Management**: Create, read, update, delete todos with real-time updates
- **Responsive Design**: Works seamlessly on all devices
- **Smooth Animations**: Modern transitions and hover effects
- **Intuitive Navigation**: Easy-to-use interface with clear navigation

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

## 🚀 CI/CD Pipelines

The project includes comprehensive CI/CD pipelines for both GitHub Actions and GitLab CI.

### GitHub Actions CI/CD

The project includes comprehensive GitHub Actions workflows for automated testing, building, and deployment.

#### 📋 Workflow Overview

1. **CI/CD Pipeline** (`ci.yml`)
   - Backend testing & build
   - Frontend testing & build
   - E2E testing
   - Security scanning
   - Quality gates

2. **Docker Build & Push** (`docker-build.yml`)
   - Multi-platform builds
   - Automatic tagging
   - Release-specific builds

3. **Deployment** (`deploy.yml`)
   - Staging and production deployments
   - Manual workflow dispatch

4. **Security Analysis** (`security.yml`)
   - Dependency vulnerability scanning
   - CodeQL analysis
   - Container security scanning

5. **Performance Testing** (`performance.yml`)
   - Load testing with Artillery
   - Lighthouse performance testing

### GitLab CI/CD

The project also includes a `.gitlab-ci.yml` for full GitLab CI/CD support:

#### Pipeline Stages

1. **Lint Stage**
   - Frontend: Biome linting
   - Backend: golangci-lint

2. **Test Stage**
   - Frontend: Jest tests with coverage
   - Backend: Go tests with coverage

3. **Build Stage**
   - Frontend: Vite production build
   - Backend: Go binary build

4. **Docker Stage**
   - Multi-service Docker builds

5. **Security Stage**
   - Backend: gosec security scanning
   - Frontend: Snyk vulnerability scanning

6. **Performance Stage**
   - Backend: Load testing with hey
   - Frontend: Lighthouse performance testing

#### Features

- **Change-based execution**: Jobs only run when relevant files change
- **Parallel execution**: Jobs run in parallel where possible
- **Artifact management**: Coverage reports and build artifacts saved
- **Failure handling**: Performance tests can fail without blocking pipeline

## 🚀 Production Deployment

### Docker Compose (Recommended)
The application is containerized and can be deployed using Docker Compose on any Docker-compatible environment.

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
7. Set up CI/CD secrets for deployment

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
- Maintain proper import ordering

### Commit Message Format

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🔍 Troubleshooting

### Common Issues

1. **React 19 JSX Runtime Errors**
   - **Solution**: Tests use legacy JSX runtime in `tsconfig.test.json`
   - **Config**: `"jsx": "react"`

2. **E2E Test Connection Issues**
   - **Solution**: Use automation script `./run-e2e-complete.sh`
   - **Check**: Vite config has `host: '0.0.0.0'` and `strictPort: true`

3. **Port Conflicts**
   - **Solution**: Vite uses fixed port 5173 with `strictPort: true`
   - **Check**: No other processes using port 5173

4. **Test Failures**
   - **Solution**: Ensure backend server is running for E2E tests
   - **Check**: Backend health endpoint at `http://localhost:8080/health`

5. **Linting Issues**
   - **Solution**: Run `npm run lint` to check for issues
   - **Auto-fix**: Run `npm run lint -- --write` to auto-fix issues

## 📚 Additional Resources

- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library Documentation](https://testing-library.com/)
- [Biome Documentation](https://biomejs.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [Docker Buildx Documentation](https://docs.docker.com/buildx/)
- [CodeQL Documentation](https://docs.github.com/en/code-security)

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ using Test-Driven Development principles.

## 🧹 Recent Cleanup

The repository has been cleaned up to remove unnecessary files and improve organization:

### Removed Files
- `backend/server` - Binary file (should be built, not committed)
- `backend/todoapp.db` - Database file (should be generated, not committed)
- `frontend/cypress.config.ts.bak` - Backup file
- `frontend/tsconfig.tsbuildinfo` - TypeScript build info
- `frontend/CSS_BEST_PRACTICES.md` - Moved content to main README
- `frontend/nginx.conf` - Not needed for development
- `frontend/Dockerfile` - Not needed for development
- `frontend/.dockerignore` - Not needed for development
- `init.sql` - Database initialization (handled by GORM)
- `TESTING_STRATEGY.md` - Content merged into TESTING.md
- `cypress/` - Duplicate Cypress directory (using frontend/cypress)
- `tests/` - Duplicate test directory (using backend/tests)
- `pkg/` - Duplicate package directory (using backend/pkg)

### Improvements
- **Clean .gitignore**: Removed duplication and organized rules
- **Fixed TypeScript config**: Separated test and build configurations
- **Updated GitLab CI**: Added change-based execution rules
- **Import ordering**: All imports are now properly ordered and consistent
- **Linting fixes**: All code passes Biome linting rules
- **Build fixes**: Frontend builds successfully without TypeScript errors 

## Test & Lint Status

- **Frontend**: All tests pass (81/81), high coverage, stable with Vitest and Biome.
- **Backend**: See backend/README.md for Go test status.

### Testing Tools
- **Vitest** for unit/integration tests
- **@testing-library/react** for component tests
- **Biome** for linting/formatting (replaces ESLint)

### Running Tests
```sh
cd frontend
npm run test:coverage
```

### Running Lint
```sh
npm run lint
```

### Troubleshooting
- If tests hang, check for async/await issues or infinite loops in hooks/components.
- If you see selector errors, use more specific queries (e.g., `getByLabelText`, `getByRole`).
- For mocking issues, ensure you use `vi.mock` and reset modules between tests if needed.
- For coverage, see the summary after running `npm run test:coverage`.

---

For backend and deployment, see respective READMEs. 