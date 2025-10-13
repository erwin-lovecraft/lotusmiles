<div align="center">

# 🌟 LotusMiles

### Enterprise-Grade Mileage & Loyalty Management System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.20+-00ADD8.svg)](https://golang.org/)
[![React](https://img.shields.io/badge/React-19.1+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-000000.svg)](https://bun.sh/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-tech-stack--architecture) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**LotusMiles** is a comprehensive, production-ready loyalty and mileage management platform designed for modern enterprises. Built with scalability, security, and user experience in mind, it provides a complete solution for managing customer loyalty programs, mileage accruals, and reward redemptions.

### Why LotusMiles?

LotusMiles bridges the gap between customers and businesses by providing an intuitive platform for tracking and managing loyalty points. Whether you're running an airline miles program, hotel rewards, or any customer loyalty initiative, LotusMiles offers the flexibility and power you need.

<div align="center">

![LotusMiles Dashboard](./docs/image-1.png)
*Member Dashboard - Track your miles and rewards at a glance*

</div>

### 🎯 Key Highlights

**For Members:**
- **Intuitive Dashboard**: Modern, user-friendly interface for tracking miles and viewing transaction history
- **Easy Claims Submission**: Submit mileage accrual requests with document uploads in seconds
- **Real-time Updates**: Instant notifications on request status changes
- **Multi-language Support**: Full internationalization with English and Vietnamese support
- **Mobile-Optimized**: Seamless experience across all devices

**For Administrators:**
- **Powerful Admin Panel**: Comprehensive tools for managing requests, users, and analytics
- **Streamlined Workflows**: Efficient approval processes with bulk operations support
- **Analytics & Insights**: Detailed reporting and metrics dashboard
- **SessionM Integration**: Direct integration with leading loyalty platform
- **Role-Based Access**: Granular permission controls for team management

**For Developers:**
- **Modern Tech Stack**: Built with Go, React 19, and TypeScript for performance and reliability
- **API-First Design**: Well-documented RESTful APIs with OpenAPI/Swagger support
- **Easy Deployment**: Docker-ready with comprehensive CI/CD support
- **Extensible Architecture**: Modular design for easy customization and scaling

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Go** ≥ 1.20 - [Download](https://golang.org/dl/)
- **Node.js** ≥ 16 - [Download](https://nodejs.org/)
- **Bun** - [Installation Guide](https://bun.sh/)
- **Docker** & **Docker Compose** - [Get Docker](https://www.docker.com/get-started)
- **Git** - [Download](https://git-scm.com/)

### 🐳 One-Click Setup with Docker (Recommended)

The fastest way to get LotusMiles up and running:

```bash
# Clone the repository
git clone https://github.com/erwin-lovecraft/aegismiles.git
cd lotusmiles

# Start all services with a single command
make setup

# 🎉 That's it! Your services are now running:
# 
# 🌐 Web App (Member Portal):  http://localhost:5173
# 🔧 Admin Panel:              http://localhost:5174
# 🚀 API Server:               http://localhost:8080
# 📚 API Documentation:        http://localhost:8080/swagger/index.html
```

### 🛠️ Manual Setup (Development)

For development and customization:

#### 1️⃣ Backend API Server

```bash
cd api

# Copy and configure environment variables
cp config.env.template config.env
# Edit config.env with your Auth0 and database credentials

# Install dependencies
go mod download

# Run database migrations
make migrate-up

# Start the API server
go run ./cmd/serverd
# Server will be available at http://localhost:8080
```

#### 2️⃣ Web Application (Member Portal)

```bash
cd web

# Install dependencies
bun install

# Copy environment configuration
cp .env.example .env.local
# Configure your Auth0 and API settings

# Start development server
bun run dev
# App will be available at http://localhost:5173
```

<div align="center">

![Member Portal](./docs/image-2.png)
*Web Application - Responsive member portal interface*

</div>

#### 3️⃣ Admin Panel

```bash
cd admin

# Install dependencies
bun install

# Copy environment configuration
cp .env.example .env.local
# Configure your Auth0 and API settings

# Start development server
bun run dev
# Admin panel will be available at http://localhost:5174
```

<div align="center">

![Admin Dashboard](./docs/image-3.png)
*Admin Panel - Comprehensive management dashboard*

</div>

### 🧪 Verify Installation

After setup, test your installation:

```bash
# Run backend tests
cd api && go test ./...

# Run frontend tests
cd web && bun test

# Check API health
curl http://localhost:8080/health
```

---

## 🧩 Features

### 🌐 Member Portal (Web Application)

A modern, responsive web application designed for end-users to manage their loyalty miles.

#### Core Features
- **🔐 Secure Authentication**: Enterprise-grade security with Auth0 integration
- **📊 Personal Dashboard**: Comprehensive overview of miles, tier status, and recent activity
- **📜 Transaction History**: Detailed, searchable history with advanced filtering options
- **📝 Request Submission**: Intuitive form for submitting mileage accrual requests
  - Multiple file attachment support (receipts, invoices, boarding passes)
  - Auto-validation and error handling
  - Draft saving functionality
- **🔔 Real-time Tracking**: Live status updates (Pending → Under Review → Approved/Rejected)
- **🌍 Internationalization**: Full support for English and Vietnamese languages
- **📱 Mobile-First Design**: Optimized responsive design for all screen sizes
- **♿ Accessibility**: WCAG 2.1 compliant for inclusive user experience

<div align="center">

![Request Submission](./docs/image-4.png)
*Easy request submission with file upload support*

</div>

### 🔧 Admin Panel

A powerful administrative interface for managing the entire loyalty program.

#### Core Features
- **👥 Request Management**: 
  - Queue-based review system
  - Bulk approval/rejection operations
  - Detailed request analysis and history
  - Comment and annotation support
  
- **📈 Analytics Dashboard**:
  - Real-time metrics and KPIs
  - Request volume trends
  - User engagement statistics
  - Performance analytics
  
- **👤 User Management**:
  - Member account administration
  - Role and permission controls
  - Tier management and upgrades
  - Account activity monitoring

<div align="center">

![Admin Analytics](./docs/image-5.png)
*Powerful analytics and reporting dashboard*

</div>

- **💳 Transaction Processing**:
  - Manual transaction entry
  - SessionM platform integration
  - Automated point posting
  - Transaction reconciliation
  
- **🔒 Role-Based Access Control**:
  - Granular permission system
  - Multiple admin roles (Reviewer, Approver, Super Admin)
  - Audit logging for compliance
  
- **📊 Reporting & Export**:
  - Custom report generation
  - CSV/Excel data export
  - Scheduled report delivery

<div align="center">

![Request Management](./docs/image-6.png)
*Streamlined request review and approval workflow*

</div>

### 🚀 Backend API

A robust, scalable REST API built with Go for high performance and reliability.

#### Technical Features
- **📡 RESTful Architecture**: Clean, intuitive API design following best practices
- **🔑 JWT Authentication**: Secure token-based authentication with Auth0
- **🗄️ Database Management**: 
  - GORM ORM with PostgreSQL (production) and SQLite (development)
  - Automated migrations
  - Connection pooling and optimization
- **📤 File Handling**: 
  - Secure multipart file uploads
  - File type validation and virus scanning
  - Cloud storage integration ready (S3, GCS)
- **⚡ Performance**: 
  - Efficient query optimization
  - Caching layer support (Redis ready)
  - Rate limiting and throttling
- **📚 API Documentation**: 
  - Auto-generated Swagger/OpenAPI specs
  - Interactive API explorer
  - Comprehensive endpoint documentation
- **🔍 Logging & Monitoring**:
  - Structured logging with contextual information
  - Request/response tracing
  - Performance metrics collection

#### Key API Endpoints

```
Authentication & User Management
├── POST   /api/v1/auth/login          - User authentication
├── POST   /api/v1/auth/register       - New user registration
├── GET    /api/v1/auth/me             - Current user profile
└── POST   /api/v1/auth/refresh        - Token refresh

Member Operations
├── GET    /api/v1/profile             - Get user profile
├── PUT    /api/v1/profile             - Update profile
├── GET    /api/v1/transactions        - Transaction history
└── GET    /api/v1/balance             - Current miles balance

Accrual Requests
├── GET    /api/v1/accrual-requests    - List user requests
├── POST   /api/v1/accrual-requests    - Create new request
├── GET    /api/v1/accrual-requests/:id - Get request details
└── DELETE /api/v1/accrual-requests/:id - Cancel request

Admin Operations
├── GET    /api/v1/admin/requests      - All requests (filtered)
├── PUT    /api/v1/admin/requests/:id  - Update request status
├── GET    /api/v1/admin/users         - User management
├── GET    /api/v1/admin/analytics     - Dashboard analytics
└── POST   /api/v1/admin/transactions  - Manual transaction entry
```

<div align="center">

![API Documentation](./docs/image-7.png)
*Interactive API documentation with Swagger*

</div> 

---

## 🛠️ Tech Stack & Architecture

### Frontend Technology Stack

#### Web & Admin Applications
- **⚛️ React 19.1+**: Latest React with concurrent features and automatic batching
- **📘 TypeScript 5.8+**: Type-safe development with advanced type inference
- **⚡ Vite**: Next-generation frontend tooling for blazing-fast HMR
- **🎨 Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **🧩 Radix UI**: Unstyled, accessible component primitives
- **🚦 React Router v6**: Declarative routing for React applications
- **🔄 TanStack Query v5**: Powerful async state management and data fetching
- **📋 React Hook Form**: Performant forms with easy validation
- **✅ Zod**: TypeScript-first schema validation
- **🌐 i18next**: Comprehensive internationalization framework
- **📊 Recharts**: Composable charting library for analytics
- **🎭 Framer Motion**: Production-ready animation library

### Backend Technology Stack

- **🐹 Go 1.20+**: High-performance, statically-typed programming language
- **🍸 Gin Framework**: Fast HTTP web framework with middleware support
- **💾 GORM**: Feature-rich ORM library with excellent PostgreSQL support
- **🐘 PostgreSQL 15+**: Robust, ACID-compliant relational database
- **🔐 Auth0 SDK**: Enterprise authentication and authorization
- **📝 Swagger/Swaggo**: Automated API documentation generation
- **🔄 SessionM SDK**: Integration with loyalty platform
- **🧪 Testify**: Comprehensive testing toolkit for Go

### Development & DevOps

- **🎯 Bun**: Fast all-in-one JavaScript runtime and package manager
- **🐳 Docker & Docker Compose**: Containerization for consistent environments
- **📏 ESLint & Prettier**: Code quality and formatting enforcement
- **🔍 Air**: Live reload for Go applications
- **📦 Make**: Build automation and task management
- **🌿 Git**: Version control with conventional commits

### System Architecture

<div align="center">

![System Architecture](./docs/image-8.png)
*High-level system architecture diagram*

</div>

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Web App       │   Admin Panel   │   Mobile App (Planned)      │
│   (React SPA)   │   (React SPA)   │   (React Native)            │
│   Port: 5173    │   Port: 5174    │                             │
└────────┬────────┴────────┬────────┴─────────────────────────────┘
         │                 │
         │   HTTPS/REST    │
         │                 │
┌────────┴─────────────────┴──────────────────────────────────────┐
│                    API Gateway / Load Balancer                   │
└────────┬─────────────────────────────────────────────────────────┘
         │
┌────────┴─────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Go API Server (Gin Framework)                   │   │
│  │                                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ Auth Service │  │ User Service │  │Request Service│   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ File Service │  │Analytics Svc │  │ Notify Service│   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                     Port: 8080                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────┬─────────────────────┬───────────────────────────────────┘
         │                     │
┌────────┴──────────┐  ┌───────┴──────────┐
│  External APIs    │  │  Data Layer      │
├───────────────────┤  ├──────────────────┤
│  • Auth0          │  │  PostgreSQL DB   │
│  • SessionM       │  │  (Primary Store) │
│  • AWS S3         │  │                  │
│  • Email Provider │  │  Redis Cache     │
└───────────────────┘  │  (Optional)      │
                       └──────────────────┘
```

### Data Flow

1. **User Interaction**: User interacts with React frontend
2. **API Request**: Frontend sends authenticated REST API calls
3. **Authentication**: Gin middleware validates JWT tokens with Auth0
4. **Business Logic**: Service layer processes requests
5. **Data Persistence**: GORM manages database operations
6. **Response**: JSON response returned to client
7. **State Update**: TanStack Query updates client-side cache

### Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: TLS/HTTPS Encryption (In Transit)                │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Auth0 Authentication (JWT Tokens)                │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: API Rate Limiting & CORS                         │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Input Validation & Sanitization                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Role-Based Access Control (RBAC)                 │
├─────────────────────────────────────────────────────────────┤
│  Layer 6: Database Encryption (At Rest)                    │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema Overview

```sql
-- Core Tables
users              -- User accounts and authentication
profiles           -- Extended user information
membership_tiers   -- Loyalty program tiers
transactions       -- Mileage transactions history
accrual_requests   -- User-submitted claims
request_attachments-- File uploads
audit_logs         -- System activity tracking
```

<div align="center">

![Database Schema](./docs/image-9.png)
*Simplified database entity relationship diagram*

</div>

---

## 📈 Roadmap

Our development roadmap is organized into completed milestones, active development, and planned features.

### ✅ Completed (v1.0)

**Core Infrastructure**
- [x] Monorepo project structure with Go backend and React frontends
- [x] Docker containerization and Docker Compose orchestration
- [x] PostgreSQL database with comprehensive migrations
- [x] Auth0 integration for secure authentication
- [x] RESTful API with Swagger/OpenAPI documentation

**Member Features**
- [x] User registration and profile management
- [x] Interactive dashboard with miles overview
- [x] Comprehensive transaction history with filtering
- [x] Accrual request submission with file uploads
- [x] Real-time request status tracking
- [x] Multi-language support (English/Vietnamese)
- [x] Fully responsive mobile-first design

**Admin Features**
- [x] Admin authentication and role-based access
- [x] Request queue and management interface
- [x] Approval/rejection workflow with comments
- [x] User account management
- [x] SessionM platform integration for point posting
- [x] Basic analytics dashboard

**Quality & Testing**
- [x] Unit tests for critical backend services
- [x] Integration tests for API endpoints
- [x] Frontend component testing setup
- [x] ESLint and code quality enforcement

### 🚧 In Progress (v1.5 - Q2 2025)

**Enhanced Admin Capabilities**
- [ ] Advanced analytics dashboard with custom date ranges
- [ ] Bulk approval operations for efficiency
- [ ] Enhanced filtering and search with saved filters
- [ ] Automated email notifications for request status changes
- [ ] Export functionality (CSV, Excel, PDF reports)

**Performance & Scalability**
- [ ] Redis caching layer for improved performance
- [ ] API rate limiting and request throttling
- [ ] Database query optimization and indexing
- [ ] CDN integration for static assets
- [ ] Horizontal scaling support with load balancing

**User Experience**
- [ ] Push notifications (web and mobile)
- [ ] Dark mode theme support
- [ ] Advanced file preview capabilities
- [ ] Improved accessibility (WCAG 2.1 AA compliance)
- [ ] Interactive onboarding tutorial

### 📋 Planned (v2.0 - Q4 2025)

**Mobile Applications**
- [ ] React Native mobile app for iOS
- [ ] React Native mobile app for Android
- [ ] Offline mode support
- [ ] Biometric authentication
- [ ] Push notification integration

**Advanced Features**
- [ ] Automated mileage accrual from partner integrations
- [ ] AI-powered fraud detection
- [ ] Smart tier upgrade recommendations
- [ ] Gamification elements (badges, achievements)
- [ ] Referral program management
- [ ] Advanced reporting and business intelligence

**Platform Integrations**
- [ ] Additional loyalty platform connectors
- [ ] CRM system integration (Salesforce, HubSpot)
- [ ] Payment gateway integration for redemptions
- [ ] Third-party API marketplace
- [ ] Webhook support for external systems

**Developer Tools**
- [ ] GraphQL API alongside REST
- [ ] SDK libraries (JavaScript, Python, Go)
- [ ] Enhanced API rate limits and quotas
- [ ] Developer portal with sandbox environment
- [ ] Comprehensive integration guides

### 🔮 Future Considerations (v3.0+)

- Machine learning for personalized rewards
- Blockchain integration for transparent point tracking
- Multi-tenant support for white-label solutions
- Advanced fraud prevention with behavioral analysis
- Real-time collaboration features for admin teams
- Comprehensive audit trail and compliance reporting

---

## 🤝 Contributing

We warmly welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, your help is appreciated.

### How to Contribute

**1. Fork & Clone**
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/lotusmiles.git
cd lotusmiles
```

**2. Create a Feature Branch**
```bash
git checkout -b feature/amazing-new-feature
# or
git checkout -b fix/bug-description
```

**3. Make Your Changes**
- Write clean, maintainable code following our style guidelines
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass locally

**4. Commit with Conventional Commits**
```bash
# Format: <type>(<scope>): <subject>
git commit -m "feat(api): add bulk approval endpoint"
git commit -m "fix(web): resolve mobile navigation issue"
git commit -m "docs(readme): update installation instructions"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**5. Push & Create Pull Request**
```bash
git push origin feature/amazing-new-feature
```

Then open a Pull Request on GitHub with:
- Clear description of changes
- Reference to any related issues
- Screenshots for UI changes
- Test results

### Development Guidelines

**Code Style**
- **Go**: Follow [Effective Go](https://golang.org/doc/effective_go) guidelines
- **TypeScript/React**: Follow Airbnb style guide with our ESLint config
- Use meaningful variable and function names
- Write self-documenting code with minimal comments
- Keep functions small and focused

**Testing Requirements**
- All new features must include tests
- Maintain or improve code coverage
- Run full test suite before submitting PR
- Include both unit and integration tests where applicable

**Documentation**
- Update README.md for user-facing changes
- Add inline code documentation for complex logic
- Update API documentation for endpoint changes
- Include examples in documentation

### Code Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linters
2. **Peer Review**: At least one maintainer reviews the code
3. **Feedback**: Address review comments and suggestions
4. **Approval**: Once approved, maintainers will merge your PR

### Getting Help

- 📖 Read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines
- 💬 Join our community discussions
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions
- 📧 Contact maintainers: dev@lotusmiles.com

### Recognition

Contributors will be acknowledged in our:
- GitHub Contributors page
- Release notes
- Annual contributor recognition

Thank you for making LotusMiles better! 🙏

---

## 🔒 Security

Security is our top priority. LotusMiles implements multiple layers of security to protect user data and ensure system integrity.

### Security Features

**Authentication & Authorization**
- 🔐 Auth0 enterprise-grade authentication
- 🎫 JWT token-based authorization
- 🔑 Secure password policies and MFA support
- 👤 Role-based access control (RBAC)
- ⏰ Token expiration and refresh mechanisms

**Data Protection**
- 🔒 TLS/HTTPS encryption for all communications
- 💾 Database encryption at rest
- 🛡️ Input validation and sanitization
- 🚫 SQL injection prevention via prepared statements
- 🔍 XSS and CSRF protection

**API Security**
- ⚡ Rate limiting and request throttling
- 🌐 CORS policy enforcement
- 📝 Request logging and audit trails
- 🚦 API authentication middleware
- 🔐 Secure file upload validation

**Infrastructure**
- 🐳 Container isolation with Docker
- 🔥 Environment variable management
- 📦 Dependency vulnerability scanning
- 🔄 Regular security updates
- 📊 Security monitoring and alerting

### Reporting Security Vulnerabilities

We take security vulnerabilities seriously and appreciate responsible disclosure.

**Please DO:**
- ✅ Report vulnerabilities privately to: **security@lotusmiles.com**
- ✅ Provide detailed reproduction steps
- ✅ Allow reasonable time for fixes before public disclosure
- ✅ Act in good faith to avoid privacy violations

**Please DON'T:**
- ❌ Publicly disclose vulnerabilities before they're fixed
- ❌ Access or modify user data without permission
- ❌ Perform DoS attacks or destructive testing
- ❌ Exploit vulnerabilities beyond proof-of-concept

### Response Process

1. **Acknowledgment**: We'll confirm receipt within 48 hours
2. **Investigation**: Our team will assess and validate the issue
3. **Resolution**: We'll develop and test a fix
4. **Disclosure**: Coordinated disclosure after patch deployment
5. **Recognition**: Public acknowledgment (if desired)

### Security Best Practices for Users

**For Members:**
- Enable multi-factor authentication (MFA)
- Use strong, unique passwords
- Keep your contact information current
- Review account activity regularly
- Report suspicious activity immediately

**For Administrators:**
- Follow principle of least privilege
- Regularly review access permissions
- Enable audit logging
- Keep software dependencies updated
- Use secure development practices

### Compliance & Standards

LotusMiles follows industry best practices and standards:
- OWASP Top 10 mitigation
- GDPR data protection principles
- SOC 2 security controls (in progress)
- Regular security audits and penetration testing

For more details, see our [SECURITY.md](SECURITY.md) file.

---

## 📄 License

LotusMiles is open-source software licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 LotusMiles Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the [LICENSE](LICENSE) file for full details.

### Third-Party Licenses

LotusMiles includes and depends on various open-source libraries and frameworks. We are grateful to these projects and their contributors:

- **React** - MIT License
- **Go** - BSD 3-Clause License
- **Gin Framework** - MIT License
- **Tailwind CSS** - MIT License
- **Auth0** - Commercial License (separate agreement required)

Full attribution and licenses can be found in the respective package files.

---

## 🙏 Acknowledgments

LotusMiles is built on the shoulders of giants. We extend our gratitude to:

**Core Technologies**
- [Go Team](https://golang.org/) for the excellent programming language
- [React Team](https://react.dev/) for the revolutionary UI library
- [Vercel](https://vercel.com/) for Vite and development tools
- [Tailwind Labs](https://tailwindcss.com/) for the amazing CSS framework

**Key Dependencies**
- [Auth0](https://auth0.com/) for enterprise authentication services
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [TanStack](https://tanstack.com/) for powerful data fetching tools
- [Gin](https://gin-gonic.com/) for the fast Go web framework
- [GORM](https://gorm.io/) for the elegant ORM library

**Development Tools**
- [Bun](https://bun.sh/) for blazing-fast JavaScript tooling
- [Docker](https://www.docker.com/) for containerization
- [GitHub](https://github.com/) for hosting and collaboration
- [Swagger](https://swagger.io/) for API documentation

**Community**
- All our [contributors](https://github.com/erwin-lovecraft/aegismiles/graphs/contributors) who help improve LotusMiles
- The open-source community for inspiration and support
- Early adopters and testers for valuable feedback

**Special Thanks**
- SessionM for loyalty platform integration support
- Our users for trusting LotusMiles with their loyalty programs

---

## 📞 Support & Contact

### Getting Help

**Documentation**
- 📚 [API Documentation](http://localhost:8080/swagger/index.html)
- 📖 [Contributing Guide](CONTRIBUTING.md)
- 🔒 [Security Policy](SECURITY.md)

**Community**
- 💬 GitHub Discussions for questions and ideas
- 🐛 GitHub Issues for bug reports
- 📧 Email: support@lotusmiles.com

**Commercial Support**
For enterprise support, custom development, or consulting:
- 📧 Email: enterprise@lotusmiles.com
- 🌐 Website: [www.lotusmiles.com](https://www.lotusmiles.com)

### Project Status

- **Version**: 1.0.0
- **Status**: Active Development
- **Maintained**: Yes
- **Last Updated**: January 2025

---

## 🌟 Star History

If you find LotusMiles useful, please consider giving it a star on GitHub! ⭐

Your support helps us grow and motivates continued development.

---

<div align="center">

### Built with ❤️ by the LotusMiles Team

**Making loyalty programs simple, transparent, and rewarding**

[⬆ Back to Top](#-lotusmiles)

---

*Copyright © 2025 LotusMiles. All rights reserved.*

</div>
