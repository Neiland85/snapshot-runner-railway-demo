import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Tipos principales del sistema
  type Query {
    # Query de estado básico
    status: String!

    # Consultar auditorías
    audits(filter: AuditFilter): [Audit!]!
    audit(id: ID!): Audit

    # Consultar contenedores activos
    activeContainers: [Container!]!
  }

  type Mutation {
    # Iniciar auditorías
    startPortScan(input: PortScanInput!): Audit!
    startDependencyScan(input: DependencyScanInput!): Audit!

    # Detener auditoría
    stopAudit(id: ID!): Boolean!
  }

  type Subscription {
    # Actualizaciones en tiempo real
    auditUpdates(auditId: ID!): AuditStatus!
    containerEvents: ContainerEvent!
  }

  # Tipos de datos principales
  type Audit {
    id: ID!
    type: AuditType!
    status: AuditStatus!
    target: String!
    language: AuditLanguage
    containerId: String
    results: AuditResults
    createdAt: String!
    updatedAt: String!
    completedAt: String
  }

  type Container {
    id: ID!
    status: ContainerStatus!
    auditId: ID!
    image: String!
    createdAt: String!
  }

  type AuditResults {
    summary: String
    details: String
    vulnerabilities: [Vulnerability!]
    ports: [Port!]
    dependencies: [Dependency!]
  }

  type Vulnerability {
    id: String!
    severity: VulnerabilitySeverity!
    title: String!
    description: String
    cve: String
  }

  type Port {
    number: Int!
    protocol: String!
    state: String!
    service: String
  }

  type Dependency {
    name: String!
    version: String!
    vulnerabilities: [Vulnerability!]
  }

  type ContainerEvent {
    containerId: String!
    event: String!
    timestamp: String!
  }

  # Enums
  enum AuditType {
    PORT_SCAN
    DEPENDENCY_SCAN
    CONFIG_AUDIT
    COMPLIANCE_CHECK
  }

  enum AuditStatus {
    PENDING
    RUNNING
    COMPLETED
    FAILED
    CANCELLED
  }

  enum AuditLanguage {
    PYTHON
    NODEJS
  }

  enum ContainerStatus {
    CREATING
    RUNNING
    COMPLETED
    FAILED
    TERMINATED
  }

  enum VulnerabilitySeverity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  # Inputs
  input AuditFilter {
    type: AuditType
    status: AuditStatus
    language: AuditLanguage
    target: String
  }

  input PortScanInput {
    target: String!
    ports: String
    timeout: Int
  }

  input DependencyScanInput {
    projectPath: String!
    language: AuditLanguage!
    includeDevDependencies: Boolean
  }
`;
