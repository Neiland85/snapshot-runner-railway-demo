# 🚀 Snapshot Runner Railway Demo

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Security Score](https://img.shields.io/badge/Security%20Score-75%2F100-orange.svg)](./SECURITY-AUDIT.md)
[![Railway Deploy](https://img.shields.io/badge/Deploy%20on-Railway-blueviolet.svg)](https://railway.app)

**A Railway-powered demo showcasing ephemeral container security audits through a React + GraphQL interface.**

Snapshot Runner demonstrates modern full-stack architecture with automated security auditing, featuring ephemeral containers, real-time monitoring, and comprehensive CI/CD workflows powered by GitHub Copilot and ADR-driven decisions.

## ✨ Features

### 🔐 **Security-First Architecture**

- **Real-time Security Dashboard** - Live monitoring with vulnerability tracking
- **Automated Dependency Auditing** - NPM audit integration with GitHub Actions
- **Credential Protection** - Sanitized environment variables and secrets management
- **Code Quality Enforcement** - ESLint security rules and TypeScript strict mode

### 🏗️ **Modern Tech Stack**

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: GraphQL + TypeScript + Express
- **Infrastructure**: Railway deployment with ephemeral containers
- **Monitoring**: Custom security dashboard with real-time metrics

### 🚀 **DevOps & Automation**

- **GitHub Actions** - Automated security scanning and CI/CD
- **Monorepo Structure** - Organized packages with shared configurations
- **ADR Documentation** - Architecture Decision Records for transparency
- **Hot Reloading** - Development environment with instant feedback

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Neiland85/snapshot-runner-railway-demo.git
   cd snapshot-runner-railway-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**

   ```bash
   # Backend (Terminal 1)
   cd packages/backend
   npm run dev

   # Frontend (Terminal 2) 
   cd packages/frontend
   npm start
   ```

5. **Access the application**

   - Frontend: `http://localhost:3000`
   - GraphQL Playground: `http://localhost:4000/graphql`

## 📊 Security Dashboard

The integrated security dashboard provides:

- **Security Score Tracking** (Current: 75/100)
- **Vulnerability Monitoring** (9 frontend vulnerabilities identified)
- **Credential Exposure Detection** (0 exposed credentials)
- **Real-time Audit Results** with automated recommendations

![Security Dashboard Preview](./docs/security-dashboard-preview.png)

## 🔧 Available Scripts

### Root Level

```bash
npm run lint          # Run ESLint across all packages
npm run security      # Execute security audit script
```

### Frontend Package

```bash
npm start            # Start development server
npm run build        # Create production build
npm test            # Run test suite
```

### Backend Package

```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript
npm test           # Run test suite
```

## 🏗️ Architecture

### Project Structure

```text
snapshot-runner-railway-demo/
├── packages/
│   ├── frontend/          # React TypeScript application
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Application pages
│   │   │   └── lib/           # Utilities and helpers
│   │   └── public/            # Static assets
│   └── backend/               # GraphQL API server
│       ├── src/
│       │   ├── schema/        # GraphQL schema definitions
│       │   └── resolvers/     # GraphQL resolvers
│       └── dist/              # Compiled JavaScript
├── docs/                      # Documentation and ADRs
├── .github/workflows/         # CI/CD configurations
└── security-check.sh         # Security audit script
```

### Key Architecture Decisions

- **[ADR-001](./docs/adr/adr-001-choice-railway.md)**: Railway platform choice
- **[ADR-002](./docs/adr/adr-002-ephemeral-containers.md)**: Ephemeral container strategy
- **[ADR-003](./docs/adr/adr-003-monorepo-structure.md)**: Monorepo organization
- **[ADR-004](./docs/adr/adr-004-graphql-vs-rest.md)**: GraphQL API design
- **[ADR-005](./docs/adr/adr-005-security-audits.md)**: Security audit implementation

## 🔐 Security

This project implements comprehensive security measures:

### ✅ **Implemented Protections**

- Sanitized environment variables
- Automated vulnerability scanning
- TypeScript strict mode with helper functions
- ESLint security rule enforcement
- GitHub Actions security workflows

### ⚠️ **Current Vulnerabilities**

- 9 frontend dependency vulnerabilities (primarily in react-scripts)
- See [SECURITY-AUDIT.md](./SECURITY-AUDIT.md) for detailed analysis

### 🔧 **Remediation**

```bash
# Apply automatic fixes
cd packages/frontend && npm audit fix --force

# Or run the security script
./security-check.sh
```

## 🚀 Deployment

### Railway Deployment

1. **Connect to Railway**

   ```bash
   railway login
   railway link
   ```

2. **Deploy**

   ```bash
   railway up
   ```

3. **Environment Variables**

   Configure in Railway dashboard:
   - `NODE_ENV=production`
   - `RAILWAY_TOKEN=your_token_here`

### Manual Deployment

1. **Build production assets**

   ```bash
   npm run build
   ```

2. **Deploy to your platform of choice**

   - The build outputs are in `packages/frontend/build/`
   - Backend runs from `packages/backend/dist/`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
4. **Run security checks**

   ```bash
   ./security-check.sh
   npm run lint
   ```

5. **Commit with conventional commits**

   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push and create a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use helper functions instead of nested ternaries
- Implement proper error handling
- Add tests for new features
- Update documentation as needed

## 📋 Roadmap

### Phase 1 - Security Enhancement ✅

- [x] Comprehensive security audit system
- [x] Automated vulnerability scanning
- [x] Real-time security dashboard
- [x] Credential protection

### Phase 2 - Performance Optimization

- [ ] Migration from Create React App to Vite
- [ ] Bundle size optimization
- [ ] Lazy loading implementation
- [ ] Performance monitoring

### Phase 3 - Advanced Features

- [ ] Container orchestration improvements
- [ ] Advanced security scanning (SAST/DAST)
- [ ] Multi-environment deployment
- [ ] Enhanced monitoring and logging

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Neil Muñoz Lago (Neiland85)**

- GitHub: [@Neiland85](https://github.com/Neiland85)
- LinkedIn: [Neil Muñoz Lago](https://linkedin.com/in/neil-munoz-lago)

## 🙏 Acknowledgments

- Railway team for the excellent deployment platform
- React and TypeScript communities
- GitHub Copilot for development assistance
- Open source security tools and communities

---

## 📖 Resumen en Español

**Snapshot Runner** es una demostración completa de una aplicación full-stack moderna con énfasis en seguridad y automatización. El proyecto muestra una arquitectura de microservicios con:

### 🎯 **Características Principales**

- **Dashboard de Seguridad en Tiempo Real** - Monitoreo continuo con puntuación 75/100
- **Auditorías Automatizadas** - Sistema completo de detección de vulnerabilidades
- **Arquitectura Moderna** - React 18, TypeScript, GraphQL y Tailwind CSS
- **Despliegue en Railway** - Contenedores efímeros con CI/CD automatizado

### 🔧 **Estado del Proyecto**

- ✅ **Backend**: 0 vulnerabilidades (completamente seguro)
- ⚠️ **Frontend**: 9 vulnerabilidades identificadas (requiere `npm audit fix`)
- ✅ **Credenciales**: Completamente sanitizadas y protegidas
- ✅ **Código**: Refactorizado con TypeScript estricto y funciones helper

### 🚀 **Próximos Pasos**

1. Ejecutar correcciones automáticas de vulnerabilidades
2. Migración a Vite para mejor rendimiento
3. Implementación de Content Security Policy (CSP)
4. Monitoreo avanzado con métricas en tiempo real

El proyecto demuestra las mejores prácticas en desarrollo moderno, incluyendo Architecture Decision Records (ADR), automatización con GitHub Actions, y un enfoque security-first desde el diseño hasta el despliegue.

**Desarrollado con ❤️ por Neil Muñoz Lago (Neiland85)**
