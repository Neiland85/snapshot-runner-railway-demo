import type { Request, Response } from 'express';

// Context para GraphQL
export interface GraphQLContext {
  req: Request;
  res: Response;
}

// Enums principales
export enum AuditType {
  PORT_SCAN = 'PORT_SCAN',
  DEPENDENCY_SCAN = 'DEPENDENCY_SCAN',
  CONFIG_AUDIT = 'CONFIG_AUDIT',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
}

export enum AuditStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum AuditLanguage {
  PYTHON = 'PYTHON',
  NODEJS = 'NODEJS',
}

export enum ContainerStatus {
  CREATING = 'CREATING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TERMINATED = 'TERMINATED',
}

export enum VulnerabilitySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Interfaces principales
export interface Vulnerability {
  id: string;
  severity: VulnerabilitySeverity;
  title: string;
  description?: string;
  cve?: string;
}

export interface Port {
  number: number;
  protocol: string;
  state: string;
  service?: string;
}

export interface Dependency {
  name: string;
  version: string;
  vulnerabilities: Vulnerability[];
}

export interface AuditResults {
  summary?: string;
  details?: string;
  vulnerabilities: Vulnerability[];
  ports: Port[];
  dependencies: Dependency[];
}

export interface Audit {
  id: string;
  type: AuditType;
  status: AuditStatus;
  target: string;
  language?: AuditLanguage;
  containerId?: string;
  results: AuditResults | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface Container {
  id: string;
  status: ContainerStatus;
  auditId: string;
  image: string;
  createdAt: string;
}

export interface ContainerEvent {
  containerId: string;
  event: string;
  timestamp: string;
}

// Input types
export interface AuditFilter {
  type?: AuditType;
  status?: AuditStatus;
  language?: AuditLanguage;
  target?: string;
}

export interface PortScanInput {
  target: string;
  ports?: string;
  timeout?: number;
}

export interface DependencyScanInput {
  projectPath: string;
  language: AuditLanguage;
  includeDevDependencies?: boolean;
}

// Resolver argument types
export interface AuditArgs {
  filter?: AuditFilter;
}

export interface AuditByIdArgs {
  id: string;
}

export interface StartPortScanArgs {
  input: PortScanInput;
}

export interface StartDependencyScanArgs {
  input: DependencyScanInput;
}

export interface StopAuditArgs {
  id: string;
}
