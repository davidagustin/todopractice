# Frontend - Todo Application

A modern React frontend for the Todo application built with TypeScript, featuring comprehensive testing and modern development practices.

## 🚀 Tech Stack

- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with easy validation
- **TanStack Query** - Powerful data synchronization
- **React Router** - Client-side routing
- **Material-UI (MUI)** - React component library
- **Jest & Testing Library** - Testing framework and utilities

## 📁 Project Structure

```
frontend/src/
├── components/           # React components
│   ├── __tests__/       # Component tests
│   ├── CreateTodoForm.tsx
│   ├── Dashboard.tsx
│   ├── LoginForm.tsx
│   ├── ProtectedRoute.tsx
│   ├── RegisterForm.tsx
│   └── TodoList.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   └── useTodos.ts
├── services/            # API services
│   ├── __tests__/       # Service tests
│   └── api.ts
├── styles/              # CSS styles
│   ├── components.css
│   └── utilities.css
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Main application component
└── main.tsx            # Application entry point
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

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

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 🧪 Testing

### Running Tests

```bash
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

Due to React 19's new JSX runtime, the test configuration uses the legacy runtime in `tsconfig.test.json`:

```json
{
  "compilerOptions": {
    "jsx": "react"  // Legacy runtime for compatibility
  }
}
```

This ensures all tests pass while maintaining full functionality.

### Test Structure

- **Component Tests**: Test user interactions and component behavior
- **Service Tests**: Test API service functions
- **Integration Tests**: Test component interactions with services

## 🎨 Styling & UI

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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8080
```

### Build Configuration

- **Development**: Fast refresh, source maps, hot module replacement
- **Production**: Optimized bundles, tree shaking, code splitting
- **Testing**: Isolated test environment with mocked dependencies

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
```

## 📊 Features

### Authentication
- User registration and login with modern UI
- JWT token management
- Protected routes with automatic redirection
- Automatic token refresh
- Beautiful glassmorphism login/register forms

### Todo Management
- Create, read, update, delete todos
- Mark todos as complete/incomplete
- Real-time updates with TanStack Query
- Optimistic updates for better UX
- Interactive todo cards with hover effects

### User Experience
- Responsive design for all devices (mobile-first)
- Modern glassmorphism UI with gradient backgrounds
- Loading states with beautiful animations
- Error handling with user-friendly messages
- Form validation with React Hook Form
- Accessible components with ARIA labels
- Smooth transitions and hover effects

## 🔍 Code Quality

### ESLint Configuration

The project uses a comprehensive ESLint configuration:

- **TypeScript**: Strict type checking
- **React**: React-specific rules and hooks
- **Accessibility**: Accessibility guidelines
- **Best Practices**: JavaScript and React best practices

### TypeScript Configuration

- **Strict mode**: Enabled for better type safety
- **Path mapping**: Clean import paths
- **Declaration files**: Proper type definitions
- **Module resolution**: Modern ES modules

## 🚦 API Integration

### TanStack Query

The application uses TanStack Query for server state management:

- **Automatic caching**: Intelligent cache management
- **Background updates**: Keep data fresh
- **Optimistic updates**: Immediate UI feedback
- **Error handling**: Graceful error states

### API Service Structure

```typescript
// services/api.ts
export const api = {
  auth: {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>,
    register: (userData: RegisterData) => Promise<AuthResponse>,
    logout: () => Promise<void>,
  },
  todos: {
    getAll: () => Promise<Todo[]>,
    create: (todo: CreateTodoData) => Promise<Todo>,
    update: (id: number, updates: UpdateTodoData) => Promise<Todo>,
    delete: (id: number) => Promise<void>,
  },
};
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: Sanitized user inputs
- **Secure Headers**: Security headers configuration

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build process:
1. **TypeScript compilation**: Convert TS to JS
2. **Bundling**: Create optimized bundles
3. **Minification**: Reduce bundle size
4. **Asset optimization**: Optimize images and fonts

### Docker Deployment

```bash
# Build Docker image
docker build -t todo-frontend .

# Run container
docker run -p 80:80 todo-frontend
```

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm run test
   npm run lint
   ```

3. **Commit changes**
   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Submit pull request**

### Code Standards

- Follow TypeScript best practices
- Write comprehensive tests
- Ensure accessibility compliance
- Use meaningful component and variable names
- Document complex logic

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
