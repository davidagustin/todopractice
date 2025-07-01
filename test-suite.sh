#!/bin/bash

# 🧪 Comprehensive Test Suite for Fullstack Todo Application
# This script runs all tests: Backend, Frontend, and E2E

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for service at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "Service is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - Service not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Service failed to start within expected time"
    return 1
}

# Function to run backend tests
run_backend_tests() {
    print_status "Running Backend Tests..."
    
    cd backend
    
    # Check if Go is installed
    if ! command_exists go; then
        print_error "Go is not installed. Please install Go first."
        exit 1
    fi
    
    # Run unit tests
    print_status "Running unit tests..."
    go test ./tests/unit/... -v -cover
    
    # Run integration tests
    print_status "Running integration tests..."
    go test ./tests/integration/... -v -cover
    
    # Run all tests with coverage
    print_status "Running all tests with coverage..."
    go test ./... -v -coverprofile=coverage.out
    
    # Generate coverage report
    if command_exists go; then
        go tool cover -html=coverage.out -o coverage.html
        print_success "Coverage report generated: backend/coverage.html"
    fi
    
    cd ..
    
    print_success "Backend tests completed!"
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running Frontend Tests..."
    
    cd frontend
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Run unit tests
    print_status "Running unit tests..."
    npm run test
    
    # Run tests with coverage
    print_status "Running tests with coverage..."
    npm run test:coverage
    
    cd ..
    
    print_success "Frontend tests completed!"
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E Tests..."
    
    cd frontend
    
    # Check if Cypress is installed
    if ! command_exists npx; then
        print_error "npx is not available. Please install Node.js first."
        exit 1
    fi
    
    # Check if backend is running
    if ! port_in_use 8080; then
        print_warning "Backend server is not running on port 8080"
        print_status "Starting backend server..."
        
        # Start backend in background
        cd ../backend
        go run cmd/server/main.go &
        BACKEND_PID=$!
        cd ../frontend
        
        # Wait for backend to be ready
        wait_for_service "http://localhost:8080/health"
    fi
    
    # Check if frontend dev server is running
    if ! port_in_use 5173; then
        print_warning "Frontend dev server is not running on port 5173"
        print_status "Starting frontend dev server..."
        
        # Start frontend in background
        npm run dev &
        FRONTEND_PID=$!
        
        # Wait for frontend to be ready
        wait_for_service "http://localhost:5173"
    fi
    
    # Run E2E tests
    print_status "Running E2E tests..."
    npx cypress run
    
    # Clean up background processes
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "Stopping backend server..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        print_status "Stopping frontend dev server..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    cd ..
    
    print_success "E2E tests completed!"
}

# Function to run all tests
run_all_tests() {
    print_status "🧪 Starting Comprehensive Test Suite..."
    echo
    
    # Run backend tests
    run_backend_tests
    echo
    
    # Run frontend tests
    run_frontend_tests
    echo
    
    # Run E2E tests
    run_e2e_tests
    echo
    
    print_success "🎉 All tests completed successfully!"
}

# Function to show test status
show_test_status() {
    echo
    print_status "📊 Current Test Status:"
    echo
    
    # Backend test status
    if [ -d "backend" ]; then
        cd backend
        if go test ./... -v >/dev/null 2>&1; then
            print_success "Backend Tests: ✅ PASSING"
        else
            print_error "Backend Tests: ❌ FAILING"
        fi
        cd ..
    else
        print_warning "Backend Tests: ⚠️ NOT FOUND"
    fi
    
    # Frontend test status
    if [ -d "frontend" ]; then
        cd frontend
        if npm test >/dev/null 2>&1; then
            print_success "Frontend Tests: ✅ PASSING"
        else
            print_error "Frontend Tests: ❌ FAILING"
        fi
        cd ..
    else
        print_warning "Frontend Tests: ⚠️ NOT FOUND"
    fi
    
    # E2E test status
    if [ -d "frontend/cypress" ]; then
        print_status "E2E Tests: 🔄 MANUAL VERIFICATION REQUIRED"
    else
        print_warning "E2E Tests: ⚠️ NOT FOUND"
    fi
}

# Function to show help
show_help() {
    echo "🧪 Fullstack Todo Application Test Suite"
    echo
    echo "Usage: $0 [OPTION]"
    echo
    echo "Options:"
    echo "  backend     Run only backend tests"
    echo "  frontend    Run only frontend tests"
    echo "  e2e         Run only E2E tests"
    echo "  all         Run all tests (default)"
    echo "  status      Show current test status"
    echo "  help        Show this help message"
    echo
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 backend      # Run only backend tests"
    echo "  $0 frontend     # Run only frontend tests"
    echo "  $0 e2e          # Run only E2E tests"
    echo "  $0 status       # Show test status"
}

# Main script logic
case "${1:-all}" in
    "backend")
        run_backend_tests
        ;;
    "frontend")
        run_frontend_tests
        ;;
    "e2e")
        run_e2e_tests
        ;;
    "all")
        run_all_tests
        ;;
    "status")
        show_test_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac 