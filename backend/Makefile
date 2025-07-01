.PHONY: help build run test test-coverage lint lint-fix clean deps install-lint

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Build the application
build: ## Build the application
	go build -o server cmd/server/main.go

# Run the application
run: ## Run the application
	go run cmd/server/main.go

# Run tests
test: ## Run all tests
	go test ./... -v

# Run tests with coverage
test-coverage: ## Run tests with coverage report
	go test ./... -cover -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

# Run tests with race detection
test-race: ## Run tests with race detection
	go test -race ./...

# Run benchmarks
bench: ## Run benchmarks
	go test -bench=. ./...

# Install dependencies
deps: ## Install Go dependencies
	go mod download
	go mod tidy

# Install golangci-lint
install-lint: ## Install golangci-lint
	curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(shell go env GOPATH)/bin v1.61.0

# Run linter
lint: ## Run golangci-lint
	golangci-lint run ./...

# Run linter with specific configuration
lint-config: ## Run linter with specific configuration
	golangci-lint run --config=.golangci.yml ./...

# Auto-fix linting issues
lint-fix: ## Auto-fix linting issues
	go fmt ./...
	gofumpt -w .
	goimports -w .

# Format code
fmt: ## Format Go code
	go fmt ./...
	gofumpt -w .

# Organize imports
imports: ## Organize imports
	goimports -w .

# Clean build artifacts
clean: ## Clean build artifacts
	rm -f server
	rm -f coverage.out
	rm -f coverage.html

# Generate mocks (if using mockery)
mocks: ## Generate mocks
	@echo "Generating mocks..."
	@if command -v mockery >/dev/null 2>&1; then \
		mockery --all --keeptree --output=./mocks; \
	else \
		echo "mockery not found. Install with: go install github.com/vektra/mockery/v2@latest"; \
	fi

# Database operations
db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	@go run cmd/server/main.go migrate

# Development setup
dev-setup: deps install-lint ## Setup development environment
	@echo "Development environment setup complete!"

# Pre-commit checks
pre-commit: lint test ## Run pre-commit checks
	@echo "All pre-commit checks passed!"

# Docker operations
docker-build: ## Build Docker image
	docker build -t todoapp-backend .

docker-run: ## Run Docker container
	docker run -p 8080:8080 \
		-e DB_HOST=localhost \
		-e DB_PASSWORD=password \
		-e JWT_SECRET=your-secret-key \
		todoapp-backend

# Health check
health: ## Check application health
	curl -f http://localhost:8080/health || echo "Application is not running"

# Development with hot reload (requires air)
dev: ## Run with hot reload (requires air)
	@if command -v air >/dev/null 2>&1; then \
		air; \
	else \
		echo "air not found. Install with: go install github.com/cosmtrek/air@latest"; \
		echo "Or run with: make run"; \
	fi 