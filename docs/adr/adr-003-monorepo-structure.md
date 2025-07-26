# ADR-003: Estructura de Monorepo

**Fecha:** 26 de julio de 2025  
**Estado:** Accepted  
**Reemplaza:** ADR-003 original

## Contexto

Durante el desarrollo inicial del proyecto, se identificó la necesidad de reorganizar la estructura del código para mejorar la modularidad, mantenibilidad y escalabilidad del sistema. La arquitectura original requería una revisión para acomodar mejor:

1. **Separación clara de responsabilidades** entre frontend y backend
2. **Gestión independiente de dependencias** por módulo
3. **Flexibilidad para futuras migraciones** de tecnologías
4. **Facilidad de configuración** de herramientas de desarrollo
5. **Organización de scripts de auditoría** en una ubicación centralizada

La decisión se tomó considerando las mejores prácticas para proyectos de microservicios y la necesidad de mantener un desarrollo ágil y organizado.

## Decisión

**Adoptamos una estructura de monorepo con separación clara de paquetes frontend y backend, junto con configuración centralizada de herramientas de desarrollo.**

### Estructura implementada

```text
snapshot-runner-railway-demo/
├── packages/
│   ├── backend/                 # Servidor GraphQL
│   │   ├── package.json         # Dependencias específicas del backend
│   │   ├── tsconfig.json        # Configuración TypeScript del backend
│   │   ├── src/
│   │   │   └── index.ts         # Punto de entrada del servidor GraphQL
│   │   └── tasks/               # Scripts de auditoría
│   │       ├── port-scan.py     # Ejemplo: escaneo de puertos (Python)
│   │       └── dependency-check.js # Ejemplo: análisis de dependencias (Node)
│   └── frontend/                # Aplicación React
│       ├── package.json         # Dependencias específicas del frontend
│       ├── tsconfig.json        # Configuración TypeScript del frontend
│       ├── public/              # Archivos estáticos
│       └── src/                 # Código fuente React
├── docs/
│   └── adr/                     # Architecture Decision Records
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos a ignorar (incluye .env)
├── eslint.config.mjs            # Configuración ESLint centralizada
├── package.json                 # Configuración del workspace raíz
└── README.md                    # Documentación del proyecto
```

### Componentes principales

#### Backend (`packages/backend/`)

- **Tecnología**: Node.js + TypeScript + Express + Apollo Server
- **Propósito**: Servidor GraphQL que orquesta las auditorías de seguridad
- **Scripts de auditoría**: Ubicados en `tasks/`, pueden ser Python o Node.js
- **Contenedores**: Cada script se ejecuta en contenedores efímeros

#### Frontend (`packages/frontend/`)

- **Tecnología**: React + TypeScript con Create React App
- **Propósito**: Interfaz de usuario para gestionar y visualizar auditorías
- **Configuración**: Setup estándar de CRA con posibilidad de migración futura

#### Configuración centralizada

- **ESLint**: Configuración unificada en `eslint.config.mjs`
- **Git**: `.gitignore` centralizado que incluye `.env`
- **Entorno**: `.env.example` como plantilla para configuración local

## Consecuencias

### Positivas

- **Separación clara de dependencias**: Cada paquete gestiona sus propias dependencias específicas
- **Tooling unificado**: Aplicación fácil de Husky, ESLint y Prettier a todo el proyecto
- **Flexibilidad de migración**: Estructura preparada para migrar frontend a Vite o Next.js
- **Escalabilidad**: Facilita agregar nuevos paquetes (mobile, desktop, etc.)
- **Desarrollo independiente**: Teams pueden trabajar en frontend/backend independientemente
- **Configuración centralizada**: Herramientas de desarrollo configuradas una sola vez
- **Organización de scripts**: Auditorías centralizadas en `packages/backend/tasks/`

### Negativas

- **Complejidad inicial**: Mayor setup comparado con estructura monolítica
- **Gestión de versiones**: Coordinación necesaria entre paquetes interdependientes
- **Configuración de CI/CD**: Pipelines más complejos para manejar múltiples paquetes
- **Overhead de workspace**: Herramientas adicionales para gestión de monorepo

### Mitigaciones

- **Scripts npm automatizados**: Comandos en el root para operaciones comunes
- **Documentación clara**: README detallado para setup y desarrollo
- **Linting unificado**: Configuración ESLint que cubre todo el monorepo
- **Husky hooks**: Pre-commit hooks para mantener calidad de código
- **CI/CD optimizado**: Pipelines que detectan cambios por paquete

---

## Summary

### Monorepo Structure Revision from Original ADR-003

**Change**: This ADR revises the original ADR-003 to implement a cleaner monorepo structure with clear package separation and centralized tooling configuration.

**New Structure**: The project now adopts a monorepo architecture with two main packages:

- **`packages/backend/`**: Node.js/TypeScript GraphQL server using Express and Apollo Server
- **`packages/frontend/`**: React application built with Create React App

**Key Improvements from Original**:

- **Audit scripts centralization**: All security audit scripts now reside in `packages/backend/tasks/` and can be written in either Python or Node.js
- **Centralized configuration**: Common files like `.env.example`, `.gitignore`, and `eslint.config.mjs` are placed at the root level
- **Enhanced security**: `.env` files are properly listed in `.gitignore` to prevent credential leaks
- **Independent dependency management**: Each package manages its own dependencies separately

**Benefits over Original Structure**:

- **Clear separation of concerns**: Frontend and backend have distinct, isolated environments
- **Improved tooling**: Easier application of Husky, ESLint, and Prettier across the entire project
- **Future flexibility**: Structure designed to support migration to Vite or Next.js without major refactoring
- **Better scalability**: Easy addition of new packages (mobile apps, CLI tools, etc.)

**Rationale**: This revised structure addresses the limitations identified in the original ADR-003, providing better organization, clearer boundaries between components, and improved developer experience while maintaining the core architectural decisions about containerized audit execution.
