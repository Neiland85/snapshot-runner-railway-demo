# 🚀 GraphQL Playground Queries - Snapshot Runner

## 1. 📊 Query Básica - Status del Servidor

```graphql
{
  status
}
```

## 2. 🔍 Query Completa - Todas las Auditorías

```graphql
{
  audits {
    id
    type
    status
    target
    language
    containerId
    results {
      summary
      details
      vulnerabilities {
        id
        severity
        title
        description
      }
      ports {
        number
        protocol
        state
        service
      }
      dependencies {
        name
        version
        vulnerabilities {
          id
          severity
        }
      }
    }
    createdAt
    updatedAt
    completedAt
  }
}
```

## 3. 🎯 Query con Variables - Auditoría Específica

```graphql
query GetAuditById($auditId: ID!) {
  audit(id: $auditId) {
    id
    type
    status
    target
    language
    results {
      summary
      ports {
        number
        protocol
        state
        service
      }
    }
  }
}
```

Variables:

```json
{
  "auditId": "1"
}
```

## 4. 🔧 Query con Filtros - Port Scans Completados

```graphql
query GetCompletedPortScans {
  audits(filter: { type: PORT_SCAN, status: COMPLETED }) {
    id
    target
    results {
      summary
      ports {
        number
        service
        state
      }
    }
    completedAt
  }
}
```

## 5. 🚀 Mutation - Crear Port Scan

```graphql
mutation StartPortScan($target: String!) {
  startPortScan(input: { target: $target }) {
    id
    type
    status
    target
    containerId
    createdAt
  }
}
```

Variables:

```json
{
  "target": "github.com"
}
```

## 6. 🔍 Mutation - Dependency Scan

```graphql
mutation StartDependencyScan($language: AuditLanguage!, $projectPath: String!) {
  startDependencyScan(input: { 
    language: $language, 
    projectPath: $projectPath 
  }) {
    id
    type
    status
    target
    language
    containerId
  }
}
```

Variables:

```json
{
  "language": "PYTHON",
  "projectPath": "/app/my-python-project"
}
```

## 7. 🛑 Mutation - Detener Auditoría

```graphql
mutation StopAudit($auditId: ID!) {
  stopAudit(id: $auditId)
}
```

Variables:

```json
{
  "auditId": "1753536361715"
}
```

## 8. 🐳 Query - Contenedores Activos

```graphql
{
  activeContainers {
    id
    status
    auditId
    image
    createdAt
  }
}
```

## 9. 🔍 Schema Introspection - Explorar Tipos

```graphql
{
  __schema {
    types {
      name
      description
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
```

## 10. 🎯 Query Combinada - Dashboard Completo

```graphql
{
  status
  audits {
    id
    type
    status
    target
    createdAt
  }
  activeContainers {
    id
    status
    auditId
  }
}
```

## 📝 Enums Disponibles

- AuditType: PORT_SCAN, DEPENDENCY_SCAN
- AuditStatus: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
- AuditLanguage: PYTHON, NODEJS
- ContainerStatus: CREATING, RUNNING, COMPLETED, FAILED, TERMINATED
- VulnerabilitySeverity: LOW, MEDIUM, HIGH, CRITICAL

## 🎨 Tips para el Playground

1. Usa Ctrl+Space para autocompletado
2. Presiona Ctrl+Enter para ejecutar queries
3. Usa el panel izquierdo para queries y el derecho para variables
4. Explora el schema con el botón "Schema" en la sidebar
5. Usa el historial para revisar queries anteriores
