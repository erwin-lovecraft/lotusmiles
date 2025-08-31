# 🌟 LotusMiles

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Go Version](https://img.shields.io/badge/Go-1.20+-00ADD8.svg)](https://golang.org/)  
[![React](https://img.shields.io/badge/React-19.1+-61DAFB.svg)](https://reactjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6.svg)](https://www.typescriptlang.org/)  
[![Bun](https://img.shields.io/badge/Bun-1.0+-000000.svg)](https://bun.sh/)

---

## 📋 Table of Contents

1. [🎯 Goals](#-goals)  
2. [🚀 Quick Start](#-quick-start)  
3. [🧩 Features](#-features)  
4. [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)  
5. [📈 Roadmap](#-roadmap)  
6. [🤝 Contributing](#-contributing)  
7. [🔒 Security](#-security)  
8. [📄 License](#-license) 

---

## 🎯 About LotusMiles

LotusMiles is a comprehensive mileage management system that enables users to track, claim, and manage their loyalty points. The system provides both member and administrative interfaces for complete mileage lifecycle management.

### Key Features

- **Member Portal**: User-friendly interface for mileage tracking and claims
- **Admin Panel**: Administrative tools for request management and approval
- **Real-time Tracking**: Live status updates for mileage requests
- **Multi-language Support**: Internationalization with English and Vietnamese
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Secure Authentication**: Auth0 integration for robust user management

---

## 🚀 Quick Start

### Prerequisites

- **Go** ≥ 1.20 (for backend development)
- **Node.js** ≥ 16 (for frontend development)  
- **Bun** (package manager and CLI tool)
- **Docker** & **docker-compose** (for full stack development)

### Clone & Setup

```bash
git clone https://github.com/erwin-lovecraft/aegismiles.git
cd aegismiles
```

### Quick Start with Docker

```bash
# Start all services
make setup

# Access the applications
# Web App: http://localhost:5173
# Admin Panel: http://localhost:5174  
# API: http://localhost:8080
# API Docs: http://localhost:8080/swagger/index.html
```

### Manual Setup

#### Backend (Go API)

```bash
cd api
cp config.env.template config.env
# Edit config.env with your settings
go mod download
make migrate-up
go run ./cmd/serverd
```

#### Frontend (Web App)

```bash
cd web
bun install
bun run dev
```

#### Admin Panel

```bash
cd admin
bun install
bun run dev
```

---

## 🧩 Features

### Member Portal (Web App)

- **Authentication**: Secure login with Auth0 integration
- **Profile Dashboard**: View personal information, membership tier, and total miles
- **Mileage History**: Complete transaction history with filtering and search
- **Request Submission**: Submit mileage accrual requests with file attachments
- **Request Tracking**: Real-time status tracking (Pending, Approved, Rejected)
- **Multi-language**: Support for English and Vietnamese
- **Mobile-First**: Optimized for mobile devices with responsive design

### Admin Panel

- **Admin Authentication**: Role-based access control
- **Request Management**: View and manage all incoming mileage requests
- **Approval Workflow**: Approve or reject requests with detailed notes
- **Analytics Dashboard**: Overview of system metrics and user activity
- **User Management**: Manage member accounts and permissions
- **Transaction Processing**: Manual transaction entry and SessionM integration

### Backend API

- **RESTful API**: Clean, well-documented REST endpoints
- **Authentication**: JWT-based authentication with Auth0
- **Database Management**: GORM with PostgreSQL/SQLite support
- **File Upload**: Secure file handling for attachments
- **Real-time Updates**: WebSocket support for live notifications
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation 

## 🛠️ Tech Stack & Architecture

### Frontend
- **React 19.1+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation
- **i18next** for internationalization

### Backend
- **Go 1.20+** with Gin framework
- **GORM** for database ORM
- **PostgreSQL/SQLite** for data storage
- **Swagger/OpenAPI** for API documentation
- **Auth0** for authentication
- **SessionM** integration for loyalty points

### Development Tools
- **Bun** for package management and CLI
- **Docker** for containerization
- **ESLint & Prettier** for code quality
- **Git** for version control

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Admin Panel   │    │   Mobile App    │
│   (React)       │    │   (React)       │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Go API Server        │
                    │    (Gin + GORM)           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Database             │
                    │   (PostgreSQL/SQLite)     │
                    └───────────────────────────┘
```

### API Endpoints

- **Authentication**: `/api/v1/auth/*`
- **Profile**: `/api/v1/profile`
- **Accrual Requests**: `/api/v1/accrual-requests`
- **Admin**: `/api/v1/admin/*`
- **Documentation**: `/swagger/index.html`

## 📈 Roadmap

### Completed ✅
- [x] Core member flows (signup, dashboard, history)
- [x] Manual claim submission & status tracking
- [x] Admin review & point posting
- [x] SessionM integration
- [x] Multi-language support (EN/VI)
- [x] Mobile-first responsive design
- [x] API documentation with Swagger

### In Progress 🚧
- [ ] Enhanced analytics dashboard
- [ ] Push notifications
- [ ] Advanced filtering and search
- [ ] Bulk operations for admin

### Planned 📋
- [ ] Mobile app (React Native)
- [ ] Automated accrual integration
- [ ] Advanced tier upgrade rules
- [ ] Email notifications
- [ ] Advanced reporting features
- [ ] API rate limiting
- [ ] Performance optimizations

## 🤝 Contributing

We welcome contributions from the community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Code of conduct
- Development setup
- Coding standards
- Pull request process
- Testing requirements

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 🔒 Security

Security is a top priority. Please review our [SECURITY.md](SECURITY.md) for:

- Vulnerability reporting process
- Security best practices
- Supported versions
- Security features

**Report security vulnerabilities privately** to: security@lotusmiles.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Auth0](https://auth0.com/) for authentication services
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling
- [Gin](https://gin-gonic.com/) for Go web framework

---

**Made with ❤️ by the LotusMiles Team**
