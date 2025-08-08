# 🌟 LotusMiles POC

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)  
[![OpenSSF Best Practices](https://bestpractices.coreinfrastructure.org/projects/1234/badge)](https://bestpractices.coreinfrastructure.org/projects/1234)  
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/your-org/lotusmiles-poc/badge)](https://securityscorecards.dev)  
[![Go Report Card](https://goreportcard.com/badge/github.com/your-org/lotusmiles-poc)](https://goreportcard.com/report/github.com/your-org/lotusmiles-poc)  
[![Coverage Status](https://coveralls.io/repos/github/your-org/lotusmiles-poc/badge.svg)](https://coveralls.io/github/your-org/lotusmiles-poc)

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

## 🎯 Goals

- Enable **team role-swap** contest: FE ↔ BE, QC ↔ PO.  
- Build an MVP loyalty system: manual mileage claims, membership tiers, history.  
- Integrate with **SessionM** to simulate point accrual.  
- Complete core flows in **2 weeks (14-day sprint)**. :contentReference[oaicite:1]{index=1}

---

## 🚀 Quick Start

### Prerequisites

- **Go** ≥1.20  
- **Node.js** ≥16 & **npm** or **yarn**  
- **Docker** & **docker-compose** (optional, for full stack)

### Clone & Run

```bash
git clone https://@github.com/erwin-lovecraft/lotusmiles
cd lotusmiles
```

---

## 🧩 Features

Member Portal

- Sign up / Sign in (email/password, mock OTP)
- Profile Dashboard: name, email, tier, total miles
- Mileage History: list of accruals (type, date, points)
- Manual Claim Form: upload flight/invoice details & attachments
- Request Tracker: status (Pending, Approved, Rejected) 

Admin Portal

- Admin Login
- Request Management: view incoming manual claim requests
- Approve / Reject: add points or deny with notes
- Manual Transaction Entry: mock send to SessionM or store locally 

## 🛠️ Tech Stack & Architecture

Frontend: React (member & admin), React, Typescript, Redux, Tailwind CSS
Backend: Go, Lit toolkit
SessionM Integration: HTTP SDK mock
Database: Postgres (Docker)
Authentication: Auth0
Logging & Monitoring: Sentry

## System overview

![System Overview](https://raw.githubusercontent.com/your-org/lotusmiles-poc/main/docs/system-overview.png)

## 📈 Roadmap

- [ ] Core member flows (signup, dashboard, history)
- [ ] Manual claim submission & status tracking
- [ ] Admin review & point posting
- [ ] SessionM integration (mock)
- [ ] Automated accrual demo (future)
- [ ] Tier upgrade rules & UI polish
- [ ] Documentation & tests

## 🤝 Contributing

We love pull requests! Please see CONTRIBUTING.md for details on our code of conduct, and the process for submitting PRs. 
GitHub

## 🔒 Security

Please review our SECURITY.md before reporting vulnerabilities. Pull requests for bug fixes and security improvements are welcome. 
GitHub

## 📄 License

This project is licensed under the MIT. See LICENSE for details.
