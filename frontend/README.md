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
- **Cypress** - End-to-end testing framework

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

### Current Test Status

- ✅ **Unit Tests**: 100% passing (36 tests)
- ✅ **E2E Tests**: 100% passing (10 tests)

### Running Tests

#### Unit Tests
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

#### E2E Tests (Automated - Recommended)
```bash
# From project root, run complete E2E suite
./run-e2e-complete.sh
```

#### E2E Tests (Manual)
```bash
# Ensure backend server is running first
cd ../backend && go run cmd/server/main.go

# Start frontend server
npm run dev

# Run E2E tests (in another terminal)
npm run cypress:run

# Run E2E tests in interactive mode
npm run cypress:open
```

### Test Configuration

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

This ensures all tests pass while maintaining full functionality.

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

### Test Structure

- **Component Tests**: Test user interactions and component behavior
- **Service Tests**: Test API service functions
- **Integration Tests**: Test component interactions with services
- **E2E Tests**: Test complete user workflows

### E2E Test Features

#### Authentication Tests (6 tests)
- Navigation between login and register pages
- Form element visibility and interaction
- Form validation and user input
- Basic form submission functionality

#### Todo Management Tests (4 tests)
- Dashboard navigation and accessibility
- Todo form element interactions
- User input handling in todo forms
- Basic todo management functionality

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
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:watch   # Run tests in watch mode
npm run cypress:run  # Run E2E tests
npm run cypress:open # Open Cypress test runner

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
- Responsive design for all devices
- Smooth animations and transitions
- Loading states and error handling
- Modern glassmorphism UI design
- Intuitive navigation and interactions

### Testing
- Comprehensive unit test coverage
- End-to-end testing with Cypress
- Automated test execution
- Test-driven development practices
- Continuous integration ready

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
