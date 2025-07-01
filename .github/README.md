# GitHub Actions Workflows

This repository contains comprehensive GitHub Actions workflows for CI/CD, security, and performance testing of the fullstack todo application.

## 📋 Workflow Overview

### 1. **CI/CD Pipeline** (`ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests
**Purpose:** Main continuous integration pipeline

**Jobs:**
- **Backend Testing & Build**: Go tests, linting, coverage, build
- **Frontend Testing & Build**: Node.js tests, linting, coverage, build
- **E2E Testing**: Cypress end-to-end tests
- **Security Scan**: Trivy vulnerability scanning
- **Quality Gates**: Final validation

### 2. **Docker Build & Push** (`docker-build.yml`)
**Triggers:** Push to `main`, tags, Pull Requests
**Purpose:** Build and push Docker images to GitHub Container Registry

**Features:**
- Multi-platform builds (amd64, arm64)
- Automatic tagging based on branch/tag
- Release-specific builds for version tags
- Caching for faster builds

### 3. **Deployment** (`deploy.yml`)
**Triggers:** Push to `main`, tags, manual dispatch
**Purpose:** Deploy to staging and production environments

**Environments:**
- **Staging**: Automatic deployment from `main` branch
- **Production**: Deployment from version tags
- **Manual**: Workflow dispatch for manual deployments

### 4. **Security Analysis** (`security.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests, weekly schedule
**Purpose:** Comprehensive security scanning

**Scans:**
- Dependency vulnerability scanning (npm audit, govulncheck)
- CodeQL analysis for JavaScript and Go
- Container image security scanning
- Secret scanning with TruffleHog
- SAST analysis with ESLint and gosec

### 5. **Performance Testing** (`performance.yml`)
**Triggers:** Push to `main`, Pull Requests, manual dispatch
**Purpose:** Performance and load testing

**Tests:**
- Load testing with Artillery
- Lighthouse performance testing
- API performance testing
- Performance metrics collection

## 🚀 Getting Started

### Prerequisites

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

### Workflow Usage

#### Automatic Triggers
- **Push to `main`**: Triggers CI/CD, Docker build, deployment to staging
- **Push to `develop`**: Triggers CI/CD and security scans
- **Pull Requests**: Triggers CI/CD and security scans
- **Version Tags**: Triggers full pipeline including production deployment

#### Manual Triggers
1. **Deploy to Environment**
   - Go to Actions → Deploy
   - Click "Run workflow"
   - Select environment (staging/production)

2. **Performance Testing**
   - Go to Actions → Performance Testing
   - Click "Run workflow"

## 📊 Monitoring & Artifacts

### Coverage Reports
- Backend coverage: Uploaded to Codecov
- Frontend coverage: Uploaded to Codecov
- Coverage badges available in repository

### Security Results
- All security scan results uploaded to GitHub Security tab
- SARIF format for integration with security tools
- Weekly automated scans

### Performance Results
- Lighthouse reports stored as artifacts
- Load test results available for download
- Performance metrics tracked over time

### Test Artifacts
- Cypress screenshots and videos on test failure
- Build artifacts for debugging
- Docker images available in GitHub Container Registry

## 🔧 Customization

### Environment Variables
Modify environment variables in workflow files:
```yaml
env:
  GO_VERSION: '1.24'
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
```

### Database Configuration
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

### Deployment Configuration
Customize deployment steps in `deploy.yml`:
```yaml
- name: Deploy to staging environment
  run: |
    # Add your deployment commands here
    # Example: kubectl apply, docker-compose, etc.
```

## 🛠️ Troubleshooting

### Common Issues

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

### Debugging

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

## 📈 Best Practices

### Code Quality
- Maintain high test coverage (>80%)
- Address linting issues promptly
- Follow security best practices

### Performance
- Monitor performance metrics
- Set appropriate performance thresholds
- Optimize build and test times

### Security
- Regular dependency updates
- Address security vulnerabilities promptly
- Follow least privilege principle

### Deployment
- Use blue-green deployments
- Implement rollback procedures
- Monitor deployment health

## 🔗 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Buildx Documentation](https://docs.docker.com/buildx/)
- [CodeQL Documentation](https://docs.github.com/en/code-security)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

## 📞 Support

For issues with these workflows:
1. Check the workflow logs for detailed error messages
2. Review the troubleshooting section above
3. Create an issue in the repository with workflow details
4. Include relevant logs and error messages 