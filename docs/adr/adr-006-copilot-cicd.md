# ADR-006: Integración de GitHub Copilot Agent Pro+ y CI/CD

**Fecha:** 26 de julio de 2025  
**Estado:** Accepted

## Contexto

El proyecto requiere optimizar la experiencia de desarrollo y garantizar la calidad del código mediante automatización. Los principales desafíos identificados fueron:

1. **Automatización de dependencias**: Instalación consistente de dependencias en entornos de desarrollo
2. **Preparación de entorno para Copilot**: Configuración reproducible para GitHub Copilot Agent Pro+
3. **Gestión de monorepo**: Manejo eficiente de múltiples paquetes (backend/frontend)
4. **Calidad de código**: Aplicación consistente de linters y formatters
5. **Integración continua**: Pipelines automatizados para build, test y deploy

### Requisitos técnicos

- **Node.js 22 LTS**: Versión estable y con soporte a largo plazo
- **Estructura monorepo**: Gestión independiente de `packages/backend` y `packages/frontend`
- **GitHub Copilot Agent Pro+**: Asistencia de IA contextual mejorada
- **CI/CD automatizado**: Workflows para lint, build, test y deploy

### Evaluación de herramientas

#### GitHub Actions vs otras soluciones

- **GitHub Actions**: Integración nativa, soporte completo para monorepos, matriz de jobs
- **Jenkins**: Mayor flexibilidad pero setup más complejo
- **GitLab CI**: Buena funcionalidad pero requiere migración de ecosistema

#### Configuración de Copilot

- **Copilot Agent Pro+**: Capacidades avanzadas de contexto y sugerencias especializadas
- **Instrucciones de proyecto**: Archivo `.github/copilot-instructions.md` para context awareness
- **Entorno reproducible**: Setup automático para sugerencias consistentes

## Decisión

**Implementamos una integración completa de GitHub Copilot Agent Pro+ con pipelines CI/CD automatizados usando GitHub Actions, optimizados para nuestra estructura de monorepo.**

### Estructura de configuración

```text
.github/
├── copilot-instructions.md          # Instrucciones contextuales para Copilot
└── workflows/
    ├── copilot-setup-steps.yml      # Setup automático del entorno Copilot
    ├── ci-lint.yml                  # Pipeline de linting
    ├── ci-build.yml                 # Pipeline de build
    ├── ci-test.yml                  # Pipeline de testing
    └── cd-deploy.yml                # Pipeline de deployment
```

### Configuración de Copilot Agent Pro+

#### Archivo `.github/copilot-instructions.md`

```markdown
# Instrucciones de Proyecto para GitHub Copilot

## Arquitectura del Proyecto
- **Monorepo**: packages/backend (GraphQL) + packages/frontend (React)
- **Backend**: Node.js + TypeScript + Apollo Server + Express
- **Frontend**: React + TypeScript + Create React App
- **Auditorías**: Scripts Python y Node.js en packages/backend/tasks/

## Patrones de Código
- Usar Apollo Server para GraphQL resolvers
- Implementar contenedores efímeros para auditorías
- Seguir convenciones ESLint configuradas
- Usar tipos TypeScript estrictos

## Herramientas de Desarrollo
- Node.js 22 LTS
- npm workspaces para gestión de monorepo
- ESLint + Prettier para formateo
- Husky para pre-commit hooks
```

#### Workflow `.github/workflows/copilot-setup-steps.yml`

```yaml
name: Copilot Environment Setup

on:
  workflow_call:
  push:
    branches: [main, develop, feature/*]

jobs:
  setup-copilot-env:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [22]
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install root dependencies
        run: npm ci
      
      - name: Install backend dependencies
        run: npm ci
        working-directory: packages/backend
      
      - name: Install frontend dependencies
        run: npm ci
        working-directory: packages/frontend
      
      - name: Run linters
        run: |
          npm run lint
          npm run lint --workspace=packages/backend
          npm run lint --workspace=packages/frontend
      
      - name: Run formatters
        run: |
          npm run format:check
          npm run format:check --workspace=packages/backend
          npm run format:check --workspace=packages/frontend
      
      - name: Validate TypeScript
        run: |
          npm run type-check --workspace=packages/backend
          npm run type-check --workspace=packages/frontend
```

### Pipelines CI/CD

#### Workflow de Linting (`ci-lint.yml`)

```yaml
name: Code Quality - Lint

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/workflows/copilot-setup-steps.yml
      - name: ESLint Analysis
        run: npm run lint:report
      - name: Upload ESLint Results
        uses: github/super-linter@v4
        if: always()
```

#### Workflow de Build (`ci-build.yml`)

```yaml
name: Build and Test

on:
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [backend, frontend]
    steps:
      - uses: ./.github/workflows/copilot-setup-steps.yml
      - name: Build ${{ matrix.package }}
        run: npm run build --workspace=packages/${{ matrix.package }}
      - name: Run tests
        run: npm run test --workspace=packages/${{ matrix.package }}
```

### Configuración de package.json

#### Root package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx,.mjs,.cjs,.json,.md,.css",
    "lint:fix": "npm run lint -- --fix",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "setup:copilot": "npm ci && npm run lint && npm run format:check"
  },
  "workspaces": [
    "packages/*"
  ]
}
```

## Consecuencias

### Positivas

- **Entorno reproducible para Copilot**: Setup automático garantiza sugerencias consistentes
- **Sugerencias contextuales mejoradas**: Copilot Agent Pro+ comprende la arquitectura del proyecto
- **Calidad de código automatizada**: Linting y formatting aplicados automáticamente
- **CI/CD robusto**: Pipelines que validan cada cambio antes de merge
- **Desarrollo acelerado**: Developers reciben asistencia contextual relevante
- **Monorepo optimizado**: Workflows especializados para backend y frontend
- **Node.js 22 LTS**: Plataforma estable y con características modernas

### Negativas

- **Dependencia de GitHub**: Acoplamiento con el ecosistema GitHub Actions
- **Complejidad inicial**: Setup de múltiples workflows y configuraciones
- **Costo de Copilot Pro+**: Licencia premium para funcionalidades avanzadas
- **Overhead de CI**: Tiempo adicional en cada push para ejecutar pipelines
- **Mantenimiento de workflows**: Necesidad de actualizar configuraciones regularmente
- **Debugging de pipelines**: Resolución de problemas en entornos remotos

### Mitigaciones

- **Documentación detallada**: Guías paso a paso para configuración y troubleshooting
- **Local development**: Scripts para replicar entorno CI localmente
- **Workflow optimization**: Cache de dependencias y paralelización de jobs
- **Monitoring y alertas**: Notificaciones de fallos en pipelines
- **Fallback procedures**: Procesos manuales para casos de emergencia
- **Regular updates**: Calendario de revisión y actualización de workflows

---

## Summary

### GitHub Copilot Agent Pro+ Integration and CI/CD Pipeline Configuration

**Decision**: Implement comprehensive GitHub Copilot Agent Pro+ integration with automated CI/CD pipelines using GitHub Actions, optimized for our monorepo structure and development workflow.

**Implementation Strategy**: Created a structured approach with `.github/copilot-instructions.md` for contextual AI assistance and `.github/workflows/copilot-setup-steps.yml` for automated environment preparation, complemented by specialized CI/CD workflows for different aspects of code quality and deployment.

**Key Components**:

- **Copilot Configuration**: Project-specific instructions file that provides context about monorepo architecture, coding patterns, and tool usage to enhance AI suggestions
- **Environment Setup**: Automated workflow that installs Node.js 22 LTS, manages npm dependencies across backend/frontend packages, and runs linters/formatters
- **CI/CD Workflows**: Specialized pipelines for linting (`ci-lint.yml`), building/testing (`ci-build.yml`), and deployment (`cd-deploy.yml`)

**Technology Stack**:

- **Node.js 22 LTS**: Long-term support version for stability and modern features
- **GitHub Actions**: Native CI/CD integration with matrix builds for monorepo support
- **npm workspaces**: Efficient dependency management across packages
- **ESLint + Prettier**: Automated code quality and formatting enforcement

**Key Benefits**:

- **Reproducible Copilot environment**: Automated setup ensures consistent AI suggestions across all development environments
- **Enhanced contextual assistance**: Copilot Agent Pro+ understands project architecture, patterns, and conventions
- **Automated quality assurance**: Every code change is automatically linted, formatted, and tested before integration
- **Monorepo optimization**: Workflows handle backend and frontend packages independently while maintaining unified standards

**Implementation Advantages**:

- **Developer experience**: Contextual AI assistance accelerates development with relevant, project-specific suggestions
- **Code consistency**: Automated enforcement of linting rules and formatting standards across the entire codebase
- **Deployment confidence**: Comprehensive testing and validation before any code reaches production environments
- **Scalable architecture**: CI/CD structure designed to accommodate future packages and complexity growth

**Rationale**: This comprehensive integration leverages GitHub's ecosystem strengths while providing developers with intelligent assistance and automated quality assurance, creating a development environment that enhances productivity while maintaining high code standards and deployment reliability.
