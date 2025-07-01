# Fullstack Todo Application

A modern fullstack todo application built with Test-Driven Development (TDD) principles.

## 🚀 Tech Stack

### Backend
- **Go** with Gin web framework
- **GORM** for database ORM
- **PostgreSQL** database
- **JWT** authentication
- **Zap** structured logging
- **Viper** configuration management
- **Testify** for testing

### Frontend
- **React 18** with TypeScript
- **Vite** build tool
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **TanStack Query** for server state management
- **React Router** for client-side routing
- **Vitest** for testing

## 📋 Features

- ✅ User authentication (register/login)
- ✅ Create, read, update, delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Comprehensive test coverage
- ✅ JWT-based authentication
- ✅ Protected routes

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Deploy the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fullstackpractice
   ```

2. **Run the deployment script**
   ```bash
   ./deploy.sh
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - Database: localhost:5432

### Manual Docker Commands

If you prefer to run commands manually:

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove everything including volumes
docker-compose down --volumes --rmi all
```

## 🛠️ Development Setup

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up PostgreSQL** (or use Docker)
   ```bash
   # Using Docker
   docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todoapp -p 5432:5432 -d postgres:15-alpine
   ```

4. **Run the server**
   ```bash
   go run cmd/server/main.go
   ```

5. **Run tests**
   ```bash
   go test ./...
   ```

### Frontend Development

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

5. **Build for production**
   ```bash
   npm run build
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
go test ./... -v
```

### Frontend Tests
```bash
cd frontend
npm run test
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
├── backend/                 # Go backend application
│   ├── cmd/server/         # Application entry point
│   │   ├── internal/           # Internal packages
│   │   │   ├── auth/          # Authentication logic
│   │   │   ├── config/        # Configuration
│   │   │   ├── database/      # Database connection
│   │   │   └── todo/          # Todo business logic
│   │   ├── pkg/               # Public packages
│   │   │   ├── middleware/    # HTTP middleware
│   │   │   ├── models/        # Data models
│   │   │   └── utils/         # Utilities
│   │   ├── tests/             # Test files
│   │   ├── Dockerfile         # Backend Docker image
│   │   └── config.yaml        # Configuration file
│   ├── frontend/               # React frontend application
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── contexts/      # React contexts
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── services/      # API services
│   │   │   └── types/         # TypeScript types
│   │   ├── Dockerfile         # Frontend Docker image
│   │   └── nginx.conf         # Nginx configuration
│   ├── docker-compose.yml     # Docker orchestration
│   ├── deploy.sh             # Deployment script
│   └── README.md             # This file
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

### Cloud Deployment Options

1. **Digital Ocean App Platform**
2. **AWS ECS/Fargate**
3. **Google Cloud Run**
4. **Heroku**
5. **Railway**
6. **Render**

### Environment-Specific Configuration

For production deployment, make sure to:

1. Change the JWT secret
2. Use strong database passwords
3. Enable SSL/TLS
4. Configure proper CORS origins
5. Set up monitoring and logging
6. Configure backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ using Test-Driven Development principles. 