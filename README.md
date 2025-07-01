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

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

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

### Test Configuration

#### Frontend Test Configuration

The frontend tests are configured with:
- **Jest** as the test runner
- **@testing-library/react** for component testing
- **@testing-library/jest-dom** for custom matchers
- **Legacy JSX runtime** for React 19 compatibility
- **Cypress** for E2E testing with Vite integration

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
│   ├── Dockerfile            # Frontend Docker image
│   ├── nginx.conf            # Nginx configuration
│   └── CSS_BEST_PRACTICES.md # CSS guidelines
├── docker-compose.yml        # Docker orchestration
├── deploy.sh                 # Deployment script
├── run-e2e-complete.sh       # E2E test automation script
├── TESTING.md                # Testing documentation
├── TESTING_STRATEGY.md       # Testing strategy
└── README.md                 # This file
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

## 🚀 GitHub Actions CI/CD

The project includes comprehensive GitHub Actions workflows for automated testing, building, and deployment.

### 📋 Workflow Overview

#### 1. **CI/CD Pipeline** (`ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests
**Purpose:** Main continuous integration pipeline

**Jobs:**
- **Backend Testing & Build**: Go tests, linting, coverage, build
- **Frontend Testing & Build**: Node.js tests, linting, coverage, build
- **E2E Testing**: Cypress end-to-end tests
- **Security Scan**: Trivy vulnerability scanning
- **Quality Gates**: Final validation

#### 2. **Docker Build & Push** (`docker-build.yml`)
**Triggers:** Push to `main`, tags, Pull Requests
**Purpose:** Build and push Docker images to GitHub Container Registry

**Features:**
- Multi-platform builds (amd64, arm64)
- Automatic tagging based on branch/tag
- Release-specific builds for version tags
- Caching for faster builds

#### 3. **Deployment** (`deploy.yml`)
**Triggers:** Push to `main`, tags, manual dispatch
**Purpose:** Deploy to staging and production environments

**Environments:**
- **Staging**: Automatic deployment from `main` branch
- **Production**: Deployment from version tags
- **Manual**: Workflow dispatch for manual deployments

#### 4. **Security Analysis** (`security.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests, weekly schedule
**Purpose:** Comprehensive security scanning

**Scans:**
- Dependency vulnerability scanning (npm audit, govulncheck)
- CodeQL analysis for JavaScript and Go
- Container image security scanning
- Secret scanning with TruffleHog
- SAST analysis with ESLint and gosec

#### 5. **Performance Testing** (`performance.yml`)
**Triggers:** Push to `main`, Pull Requests, manual dispatch
**Purpose:** Performance and load testing

**Tests:**
- Load testing with Artillery
- Lighthouse performance testing
- API performance testing
- Performance metrics collection

### 🚀 Getting Started with GitHub Actions

#### Prerequisites

1. **Repository Setup**
   - Ensure your repository has the correct branch structure (`main`, `develop`)
   - Set up branch protection rules if needed

2. **Secrets Configuration**
   Add the following secrets to your repository:
   ```
   GITHUB_TOKEN (automatically available)
   DOCKER_REGISTRY_TOKEN (if using external registry)
   DEPLOYMENT_KEYS (for deployment environments)
   ```

3. **Environment Setup**
   Create environments in GitHub:
   - `staging` - for staging deployments
   - `production` - for production deployments

#### Workflow Usage

**Automatic Triggers:**
- **Push to `main`**: Triggers CI/CD, Docker build, deployment to staging
- **Push to `develop`**: Triggers CI/CD and security scans
- **Pull Requests**: Triggers CI/CD and security scans
- **Version Tags**: Triggers full pipeline including production deployment

**Manual Triggers:**
1. **Deploy to Environment**
   - Go to Actions → Deploy
   - Click "Run workflow"
   - Select environment (staging/production)

2. **Performance Testing**
   - Go to Actions → Performance Testing
   - Click "Run workflow"

### 📊 Monitoring & Artifacts

#### Coverage Reports
- Backend coverage: Uploaded to Codecov
- Frontend coverage: Uploaded to Codecov
- Coverage badges available in repository

#### Security Results
- All security scan results uploaded to GitHub Security tab
- SARIF format for integration with security tools
- Weekly automated scans

#### Performance Results
- Lighthouse reports stored as artifacts
- Load test results available for download
- Performance metrics tracked over time

#### Test Artifacts
- Cypress screenshots and videos on test failure
- Build artifacts for debugging
- Docker images available in GitHub Container Registry

### 🔧 Customization

#### Environment Variables
Modify environment variables in workflow files:
```yaml
env:
  GO_VERSION: '1.24'
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
```

#### Database Configuration
Update PostgreSQL service configuration:
```yaml
services:
  postgres:
    image: postgres:15-alpine
    env:
      POSTGRES_DB: todoapp_test
      POSTGRES_USER: todouser
      POSTGRES_PASSWORD: todopassword
```

#### Deployment Configuration
Customize deployment steps in `deploy.yml`:
```yaml
- name: Deploy to staging environment
  run: |
    # Add your deployment commands here
    # Example: kubectl apply, docker-compose, etc.
```

### 🛠️ Troubleshooting GitHub Actions

#### Common Issues

1. **Build Failures**
   - Check Go/Node.js version compatibility
   - Verify dependency installation
   - Review test failures in logs

2. **Docker Build Issues**
   - Ensure Dockerfiles are properly configured
   - Check multi-platform build support
   - Verify registry authentication

3. **Security Scan Failures**
   - Review vulnerability reports
   - Update dependencies if needed
   - Address high/critical severity issues

4. **Performance Test Failures**
   - Check application startup time
   - Verify database connectivity
   - Review performance thresholds

#### Debugging

1. **Enable Debug Logging**
   Add to workflow:
   ```yaml
   env:
     ACTIONS_STEP_DEBUG: true
   ```

2. **Check Artifacts**
   - Download and review test artifacts
   - Examine screenshots and videos
   - Review performance reports

3. **Local Testing**
   - Run workflows locally with `act`
   - Test individual components
   - Verify environment setup

### 📈 Best Practices

#### Code Quality
- Maintain high test coverage (>80%)
- Address linting issues promptly
- Follow security best practices

#### Performance
- Monitor performance metrics
- Set appropriate performance thresholds
- Optimize build and test times

#### Security
- Regular dependency updates
- Address security vulnerabilities promptly
- Follow least privilege principle

#### Deployment
- Use blue-green deployments
- Implement rollback procedures
- Monitor deployment health

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

## 📚 Additional Resources

- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library Documentation](https://testing-library.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Buildx Documentation](https://docs.docker.com/buildx/)
- [CodeQL Documentation](https://docs.github.com/en/code-security)

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ using Test-Driven Development principles. 