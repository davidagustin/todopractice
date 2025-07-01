# GitHub Actions Workflows

Quick reference for the GitHub Actions workflows in this repository. For detailed documentation, see the main [README.md](../README.md#-github-actions-cicd).

## 📋 Workflow Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **ci.yml** | Push/PR | Main CI/CD pipeline with tests and builds |
| **docker-build.yml** | Push/PR | Build and push Docker images |
| **deploy.yml** | Push/Tags | Deploy to staging/production |
| **security.yml** | Push/PR/Weekly | Security scanning and analysis |
| **performance.yml** | Push/PR | Performance and load testing |

## 🚀 Quick Start

### Prerequisites
- Repository secrets configured
- Environments set up (staging, production)
- Branch protection rules (optional)

### Manual Triggers
1. **Deploy**: Actions → Deploy → Run workflow
2. **Performance Test**: Actions → Performance Testing → Run workflow

## 📊 Artifacts

- **Coverage Reports**: Codecov integration
- **Security Results**: GitHub Security tab
- **Performance Reports**: Lighthouse and load test results
- **Test Artifacts**: Screenshots, videos, build artifacts

## 🔧 Configuration

### Environment Variables
```yaml
env:
  GO_VERSION: '1.24'
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
```

### Database Service
```yaml
services:
  postgres:
    image: postgres:15-alpine
    env:
      POSTGRES_DB: todoapp_test
      POSTGRES_USER: todouser
      POSTGRES_PASSWORD: todopassword
```

## 🛠️ Troubleshooting

### Common Issues
- **Build Failures**: Check Go/Node.js versions and dependencies
- **Docker Issues**: Verify Dockerfile configuration and registry auth
- **Security Failures**: Review vulnerability reports and update dependencies
- **Performance Failures**: Check app startup time and database connectivity

### Debug Mode
Add to workflow for detailed logging:
```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

## 📚 Resources

- [Main README - GitHub Actions Section](../README.md#-github-actions-cicd)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Buildx Documentation](https://docs.docker.com/buildx/)
- [CodeQL Documentation](https://docs.github.com/en/code-security)

## 📞 Support

For workflow issues:
1. Check workflow logs for error details
2. Review troubleshooting section above
3. Create issue with workflow details and logs 