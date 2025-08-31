# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT Create a Public Issue

**Never** report security vulnerabilities through public GitHub issues, discussions, or pull requests. This could put users at risk.

### 2. Report Privately

Please report security vulnerabilities by emailing our security team at:

**security@lotusmiles.com**

If you don't receive a response within 48 hours, please follow up with a direct message to the project maintainers.

### 3. Include the Following Information

When reporting a vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity assessment
- **Affected Components**: Which part of the system is affected (API, web app, admin panel, etc.)
- **Environment**: Operating system, browser, and version information
- **Proof of Concept**: If possible, include a proof of concept (without exploiting it)
- **Suggested Fix**: If you have ideas for fixing the issue

### 4. What to Expect

- **Acknowledgment**: You will receive an acknowledgment within 48 hours
- **Assessment**: We will assess the vulnerability within 7 days
- **Updates**: We will provide regular updates on our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days
- **Credit**: We will credit you in our security advisories (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

- Keep your dependencies updated
- Use strong, unique passwords
- Enable two-factor authentication where available
- Regularly review your account activity
- Report suspicious activity immediately

### For Developers

- Follow secure coding practices
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Keep dependencies updated
- Use HTTPS in production
- Implement proper error handling without exposing sensitive information

## Security Features

### Authentication & Authorization

- **Auth0 Integration**: Secure authentication using Auth0
- **JWT Tokens**: Stateless authentication with JWT
- **Role-Based Access Control**: Admin and member roles
- **Protected Routes**: Authentication required for sensitive endpoints

### Data Protection

- **Input Validation**: All user inputs are validated
- **SQL Injection Prevention**: Using GORM with parameterized queries
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Data Encryption**: Sensitive data encrypted at rest and in transit

### API Security

- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper Cross-Origin Resource Sharing setup
- **Request Validation**: Comprehensive request validation
- **Error Handling**: Secure error messages without information leakage

### Infrastructure Security

- **HTTPS Only**: All communications encrypted in transit
- **Environment Variables**: Sensitive configuration stored securely
- **Database Security**: Database access restricted and monitored
- **Docker Security**: Containerized deployment with security best practices

## Security Audit

### Regular Security Reviews

We conduct regular security reviews including:

- **Dependency Audits**: Regular scanning for vulnerable dependencies
- **Code Reviews**: Security-focused code reviews for all changes
- **Penetration Testing**: Periodic security testing
- **Infrastructure Audits**: Regular infrastructure security assessments

### Tools Used

- **Go Security**: `gosec` for Go code security analysis
- **Node.js Security**: `npm audit` and `yarn audit` for dependency vulnerabilities
- **Docker Security**: `docker scan` for container security
- **Static Analysis**: ESLint security rules and Go static analysis tools

## Vulnerability Disclosure Timeline

### Critical Vulnerabilities (CVSS 9.0-10.0)
- **Acknowledgment**: Within 24 hours
- **Assessment**: Within 3 days
- **Fix Development**: Within 7 days
- **Public Disclosure**: Within 30 days

### High Vulnerabilities (CVSS 7.0-8.9)
- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix Development**: Within 14 days
- **Public Disclosure**: Within 60 days

### Medium/Low Vulnerabilities (CVSS < 7.0)
- **Acknowledgment**: Within 72 hours
- **Assessment**: Within 14 days
- **Fix Development**: Within 30 days
- **Public Disclosure**: Within 90 days

## Security Advisories

Security advisories will be published in the following locations:

- **GitHub Security Advisories**: https://github.com/erwin-lovecraft/aegismiles/security/advisories
- **Project Documentation**: This SECURITY.md file
- **Release Notes**: Included in version release notes

## Responsible Disclosure

We follow responsible disclosure practices:

1. **Private Reporting**: Vulnerabilities reported privately first
2. **Coordinated Disclosure**: Public disclosure coordinated with fix release
3. **Credit Given**: Researchers credited (unless anonymity requested)
4. **No Legal Action**: No legal action against security researchers acting in good faith

## Security Contact

For security-related questions or concerns:

- **Email**: security@lotusmiles.com
- **Response Time**: Within 48 hours
- **PGP Key**: Available upon request for encrypted communications

## Security Resources

### For Developers

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Go Security Best Practices](https://golang.org/doc/security.html)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Auth0 Security Documentation](https://auth0.com/docs/security)

### For Users

- [Password Security Best Practices](https://www.cisa.gov/be-cyber-smart/campaign/password-security)
- [Two-Factor Authentication Guide](https://www.cisa.gov/be-cyber-smart/campaign/two-factor-authentication)
- [Phishing Awareness](https://www.cisa.gov/be-cyber-smart/campaign/phishing-awareness)

## Security Updates

Stay informed about security updates:

- **Watch Repository**: Watch the repository for security releases
- **Subscribe to Advisories**: Subscribe to GitHub security advisories
- **Follow Release Notes**: Check release notes for security updates

## Legal

This security policy is provided for informational purposes. By using this software, you agree to use it responsibly and in accordance with applicable laws and regulations.

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Contact**: security@lotusmiles.com
