import {
  AuditType,
  AuditStatus,
  AuditLanguage,
  ContainerStatus,
  type Audit,
  type Container,
} from './types.js';

// Mock data para desarrollo
const mockAudits: Audit[] = [
  {
    id: '1',
    type: AuditType.PORT_SCAN,
    status: AuditStatus.COMPLETED,
    target: '192.168.1.1',
    language: AuditLanguage.PYTHON,
    containerId: 'container_001',
    results: {
      summary: 'Port scan completed successfully',
      details: 'Scanned 1000 ports, found 3 open',
      vulnerabilities: [],
      ports: [
        { number: 22, protocol: 'TCP', state: 'open', service: 'ssh' },
        { number: 80, protocol: 'TCP', state: 'open', service: 'http' },
        { number: 443, protocol: 'TCP', state: 'open', service: 'https' },
      ],
      dependencies: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

const mockContainers: Container[] = [
  {
    id: 'container_001',
    status: ContainerStatus.COMPLETED,
    auditId: '1',
    image: 'python-nmap:latest',
    createdAt: new Date().toISOString(),
  },
];

export const resolvers = {
  Query: {
    status: () => 'GraphQL Server is running! 🚀',

    audits: (
      _parent: unknown,
      args: {
        filter?: {
          type?: AuditType;
          status?: AuditStatus;
          language?: AuditLanguage;
          target?: string;
        };
      },
    ) => {
      console.log('🔍 Fetching audits with filter:', args.filter);

      if (!args.filter) {
        return mockAudits;
      }

      return mockAudits.filter((audit) => {
        if (args.filter?.type && audit.type !== args.filter.type) {
          return false;
        }
        if (args.filter?.status && audit.status !== args.filter.status) {
          return false;
        }
        if (args.filter?.language && audit.language !== args.filter.language) {
          return false;
        }
        if (args.filter?.target && !audit.target.includes(args.filter.target)) {
          return false;
        }
        return true;
      });
    },

    audit: (_parent: unknown, args: { id: string }) => {
      console.log('🔍 Fetching audit by ID:', args.id);
      return mockAudits.find((audit) => audit.id === args.id) || null;
    },

    activeContainers: () => {
      console.log('🐳 Fetching active containers');
      return mockContainers.filter(
        (container) =>
          container.status === ContainerStatus.RUNNING ||
          container.status === ContainerStatus.CREATING,
      );
    },
  },

  Mutation: {
    startPortScan: (
      _parent: unknown,
      args: { input: { target: string; ports?: number[] } },
    ) => {
      console.log('🚀 Starting port scan:', args.input);

      const newAudit = {
        id: Date.now().toString(),
        type: AuditType.PORT_SCAN,
        status: AuditStatus.PENDING,
        target: args.input.target,
        language: AuditLanguage.PYTHON,
        containerId: `container_${Date.now()}`,
        results: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
      };

      mockAudits.push(newAudit);

      // Simular inicio de contenedor
      const newContainer = {
        id: newAudit.containerId,
        status: ContainerStatus.CREATING,
        auditId: newAudit.id,
        image: 'python-nmap:latest',
        createdAt: new Date().toISOString(),
      };

      mockContainers.push(newContainer);

      // Simular cambio de estado después de 2 segundos
      setTimeout(() => {
        const audit = mockAudits.find((a) => a.id === newAudit.id);
        const container = mockContainers.find((c) => c.id === newContainer.id);

        if (audit) {
          audit.status = AuditStatus.RUNNING;
          audit.updatedAt = new Date().toISOString();
        }

        if (container) {
          container.status = ContainerStatus.RUNNING;
        }

        console.log(`📊 Audit ${newAudit.id} status updated to RUNNING`);
      }, 2000);

      return newAudit;
    },

    startDependencyScan: (
      _parent: unknown,
      args: { input: { language: AuditLanguage; projectPath: string } },
    ) => {
      console.log('🔍 Starting dependency scan:', args.input);

      const newAudit = {
        id: Date.now().toString(),
        type: AuditType.DEPENDENCY_SCAN,
        status: AuditStatus.PENDING,
        target: args.input.projectPath,
        language: args.input.language,
        containerId: `container_${Date.now()}`,
        results: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
      };

      mockAudits.push(newAudit);

      const imageMap = {
        [AuditLanguage.PYTHON]: 'pip-audit:latest',
        [AuditLanguage.NODEJS]: 'osv-scanner:latest',
      };

      const newContainer = {
        id: newAudit.containerId,
        status: ContainerStatus.CREATING,
        auditId: newAudit.id,
        image: imageMap[args.input.language] || 'generic-audit:latest',
        createdAt: new Date().toISOString(),
      };

      mockContainers.push(newContainer);

      return newAudit;
    },

    stopAudit: (_parent: unknown, args: { id: string }) => {
      console.log('🛑 Stopping audit:', args.id);

      const audit = mockAudits.find((a) => a.id === args.id);
      if (!audit) {
        throw new Error(`Audit with ID ${args.id} not found`);
      }

      if (
        audit.status === AuditStatus.COMPLETED ||
        audit.status === AuditStatus.FAILED
      ) {
        return false; // Ya terminó
      }

      audit.status = AuditStatus.CANCELLED;
      audit.updatedAt = new Date().toISOString();
      audit.completedAt = new Date().toISOString();

      // Actualizar contenedor asociado
      const container = mockContainers.find((c) => c.id === audit.containerId);
      if (container) {
        container.status = ContainerStatus.TERMINATED;
      }

      return true;
    },
  },

  Subscription: {
    auditUpdates: {
      // Implementación básica - en producción usaríamos pub/sub real
      subscribe: () => {
        console.log('📡 Client subscribed to audit updates');
        // Por ahora retornamos un placeholder
        return null;
      },
    },

    containerEvents: {
      subscribe: () => {
        console.log('📡 Client subscribed to container events');
        return null;
      },
    },
  },
};
