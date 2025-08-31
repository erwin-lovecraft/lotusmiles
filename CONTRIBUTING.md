# Contributing to LotusMiles

Thank you for your interest in contributing to LotusMiles! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Go** ≥ 1.20 (for backend development)
- **Node.js** ≥ 16 (for frontend development)
- **Bun** (package manager and CLI tool) [[memory:6855833]]
- **Docker** & **docker-compose** (for local development)
- **Git** (for version control)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/lotusmiles.git
   cd lotusmiles
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/erwin-lovecraft/aegismiles.git
   ```

## Development Setup

### Backend (Go API)

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Copy the environment template:
   ```bash
   cp config.env.template config.env
   ```

3. Configure your environment variables in `config.env`

4. Install dependencies:
   ```bash
   go mod download
   ```

5. Run database migrations:
   ```bash
   make migrate-up
   ```

6. Start the API server:
   ```bash
   go run ./cmd/serverd
   ```

The API will be available at `http://localhost:8080`

### Frontend (Web Application)

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies using Bun:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

The web application will be available at `http://localhost:5173`

### Admin Panel

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies using Bun:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

The admin panel will be available at `http://localhost:5174`

### Full Stack with Docker

For a complete development environment:

```bash
# From the project root
make setup
```

This will start all services using Docker Compose.

## Project Structure

```
lotusmiles/
├── api/                    # Go backend API
│   ├── cmd/               # Application entry points
│   │   └── serverd/       # Main server application
│   ├── internal/          # Internal packages (Clean Architecture)
│   │   ├── adapters/      # External adapters (REST, Repository, External Services)
│   │   │   ├── auth0/     # Auth0 authentication adapter
│   │   │   ├── repository/ # Database repository adapters
│   │   │   │   ├── customer/    # Customer data access
│   │   │   │   ├── membership/  # Membership data access
│   │   │   │   └── mileage/     # Mileage data access
│   │   │   ├── rest/      # REST API adapters
│   │   │   │   ├── middleware/  # HTTP middleware (auth, roles)
│   │   │   │   ├── v1/          # API version 1 controllers
│   │   │   │   └── v2/          # API version 2 controllers
│   │   │   └── sessionm/  # Session management adapter
│   │   ├── config/        # Application configuration
│   │   ├── constants/     # Application constants
│   │   ├── core/          # Core business logic (Clean Architecture)
│   │   │   ├── domain/    # Domain entities
│   │   │   ├── dto/       # Data Transfer Objects
│   │   │   ├── ports/     # Interface definitions (Dependency Inversion)
│   │   │   └── services/  # Business logic services
│   │   │       ├── customer/  # Customer business logic
│   │   │       └── mileage/   # Mileage business logic
│   │   └── pkg/           # Shared utility packages
│   │       ├── generator/     # ID generation utilities
│   │       └── pagination/    # Pagination utilities
│   ├── data/              # Database migrations and seeds
│   │   ├── migrations/    # Database schema migrations
│   │   └── seeds/         # Database seed data
│   ├── config.env         # Environment configuration
│   ├── config.env.template # Environment template
│   ├── go.mod            # Go module dependencies
│   └── go.sum            # Go module checksums
├── web/                   # React frontend (member portal)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── page/          # Page components
│   │   ├── lib/           # Utilities and services
│   │   └── types/         # TypeScript type definitions
├── admin/                 # React admin panel
│   ├── src/
│   │   ├── components/    # Admin-specific components
│   │   ├── pages/         # Admin pages
│   │   └── lib/           # Admin utilities
└── build/                 # Docker configurations
```

### API Architecture Overview

The API follows **Clean Architecture** principles with clear separation of concerns:

#### Core Layer (`internal/core/`)
- **Domain**: Contains business entities and domain models
- **Services**: Implements business logic and use cases
- **Ports**: Defines interfaces for external dependencies (Repository, Gateways)
- **DTOs**: Data Transfer Objects for API communication

#### Adapters Layer (`internal/adapters/`)
- **REST**: HTTP controllers and middleware for API endpoints
- **Repository**: Database access implementations
- **External Services**: Integrations with Auth0, SessionM, etc.

#### Key Benefits
- **Testability**: Business logic is isolated and easily testable
- **Maintainability**: Clear boundaries between layers
- **Flexibility**: Easy to swap implementations (e.g., different databases)
- **Dependency Inversion**: Core doesn't depend on external frameworks

#### API Versioning
- **v1**: Legacy API endpoints
- **v2**: Current API endpoints with improved structure
- Both versions coexist to support backward compatibility

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

1. Ensure you're on the latest main branch:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add OAuth2 integration
fix(api): resolve database connection timeout
docs(readme): update installation instructions
```

## Coding Standards

### Go (Backend)

- Follow Go naming conventions: `camelCase` for variables, `PascalCase` for exported functions/types
- Use meaningful variable and function names
- Add comprehensive comments for exported functions and types
- Keep functions small and focused (max 20-30 lines)
- Use `context.Context` for request cancellation and timeouts
- Handle errors explicitly - never ignore errors
- Use GORM struct tags for database mapping
- Implement proper table names with `TableName()` method
- Use migrations for database schema changes

### TypeScript/React (Frontend)

- Use functional components with hooks
- Implement proper TypeScript interfaces for props
- Use React.memo() for performance optimization when needed
- Keep components small and focused
- Use composition over inheritance
- Follow the mobile-first UI approach [[memory:6794280]]
- Use Tailwind CSS for styling
- Follow the existing design system with Radix UI components

### General

- Write self-documenting code
- Add JSDoc comments for complex functions
- Use proper TypeScript types throughout
- Follow consistent naming conventions
- Use ESLint and Prettier for code formatting

## Testing

### Backend Testing

```bash
cd api
go test ./...
```

### Frontend Testing

```bash
cd web
bun run test
```

```bash
cd admin
bun run test
```

### Integration Testing

```bash
# Run full stack tests
make test
```

## Submitting Changes

### Pull Request Process

1. Ensure your branch is up to date with the latest main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. Run tests to ensure everything passes:
   ```bash
   make test
   ```

3. Push your changes to your fork:
   ```bash
   git push origin your-feature-branch
   ```

4. Create a Pull Request on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all CI checks pass

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Documentation

### API Documentation

API documentation is automatically generated using Swagger and available at:
- Swagger UI: `http://localhost:8080/swagger/index.html`
- OpenAPI JSON: `http://localhost:8080/docs/swagger.json`

To update API documentation:
```bash
cd api
make swagger
```

### Code Documentation

- Add JSDoc comments for complex functions
- Update README files when adding new features
- Document API changes in the Swagger annotations

## Release Process

1. Update version numbers in relevant files
2. Update CHANGELOG.md with new features and fixes
3. Create a release tag
4. Deploy to staging for testing
5. Deploy to production after approval

## Getting Help

- Check existing issues and discussions
- Join our community discussions
- Contact maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to LotusMiles! 🚀
