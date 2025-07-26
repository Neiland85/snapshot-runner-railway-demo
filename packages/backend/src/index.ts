       develop
import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server-core';

// GraphQL Type Definitions
const typeDefs = gql`
  type SecurityAudit {
    id: ID!
    type: AuditType!
    target: String!
    status: AuditStatus!
    createdAt: String!
    completedAt: String
    duration: Int
    results: AuditResults
  }

  type AuditResults {
    vulnerabilities: [Vulnerability!]!
    networkPorts: [NetworkPort!]!
    dependencies: [Dependency!]!
    summary: AuditSummary!
  }

  type Vulnerability {
    id: ID!
    severity: VulnerabilitySeverity!
    title: String!
    description: String!
    cvssScore: Float
    cve: String
    solution: String
  }

  type NetworkPort {
    port: Int!
    protocol: String!
    service: String
    version: String
    state: PortState!
  }

  type Dependency {
    name: String!
    version: String!
    type: DependencyType!
    vulnerabilities: [Vulnerability!]!
    licenses: [String!]!
    outdated: Boolean!
  }

  type AuditSummary {
    totalVulnerabilities: Int!
    criticalCount: Int!
    highCount: Int!
    mediumCount: Int!
    lowCount: Int!
    totalPorts: Int!
    openPorts: Int!
    totalDependencies: Int!
    outdatedDependencies: Int!
  }

  type Container {
    id: ID!
    name: String!
    image: String!
    status: ContainerStatus!
    createdAt: String!
    ports: [String!]!
    environment: [String!]!
    uptime: String
    resourceUsage: ResourceUsage
  }

  type ResourceUsage {
    cpu: Float!
    memory: Float!
    network: NetworkUsage!
  }

  type NetworkUsage {
    bytesIn: Float!
    bytesOut: Float!
  }

  enum AuditType {
    PORT_SCAN
    DEPENDENCY_SCAN
    VULNERABILITY_SCAN
    COMPLIANCE_CHECK
  }

  enum AuditStatus {
    PENDING
    RUNNING
    COMPLETED
    FAILED
    CANCELLED
  }

  enum VulnerabilitySeverity {
    CRITICAL
    HIGH
    MEDIUM
    LOW
    INFO
  }

  enum PortState {
    OPEN
    CLOSED
    FILTERED
  }

  enum DependencyType {
    NPM
    MAVEN
    PIP
    COMPOSER
    CARGO
  }

  enum ContainerStatus {
    CREATING
    RUNNING
    COMPLETED
    FAILED
    TERMINATED
  }

  type Query {
    # Security Audits
    audits: [SecurityAudit!]!
    audit(id: ID!): SecurityAudit
    auditsByStatus(status: AuditStatus!): [SecurityAudit!]!
    auditsByType(type: AuditType!): [SecurityAudit!]!

    # Containers
    containers: [Container!]!
    container(id: ID!): Container
    containersByStatus(status: ContainerStatus!): [Container!]!

    # Statistics
    auditStats: AuditSummary!
    systemHealth: String!
    status: String!
  }

  type Mutation {
    # Audit Management
    createAudit(type: AuditType!, target: String!): SecurityAudit!
    startAudit(id: ID!): SecurityAudit!
    stopAudit(id: ID!): SecurityAudit!
    deleteAudit(id: ID!): Boolean!

    # Container Management
    createContainer(name: String!, image: String!): Container!
    startContainer(id: ID!): Container!
    stopContainer(id: ID!): Container!
    restartContainer(id: ID!): Container!
    deleteContainer(id: ID!): Boolean!
  }

  type Subscription {
    auditStatusChanged(id: ID!): SecurityAudit!
    containerStatusChanged(id: ID!): Container!
    newVulnerabilityDetected: Vulnerability!
  }
`;

// Types for better TypeScript support
interface Vulnerability {
  id: string;
  severity: string;
  title: string;
  description: string;
  cvssScore?: number;
  cve?: string;
  solution?: string;
}

interface NetworkPort {
  port: number;
  protocol: string;
  service?: string;
  version?: string;
  state: string;
}

interface Dependency {
  name: string;
  version: string;
  type: string;
  vulnerabilities: Vulnerability[];
  licenses: string[];
  outdated: boolean;
}

interface AuditSummary {
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalPorts: number;
  openPorts: number;
  totalDependencies: number;
  outdatedDependencies: number;
}

interface AuditResults {
  vulnerabilities: Vulnerability[];
  networkPorts: NetworkPort[];
  dependencies: Dependency[];
  summary: AuditSummary;
}

interface NetworkUsage {
  bytesIn: number;
  bytesOut: number;
}

interface ResourceUsage {
  cpu: number;
  memory: number;
  network: NetworkUsage;
}

interface SecurityAudit {
  id: string;
  type: string;
  target: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  duration?: number;
  results?: AuditResults;
}

interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  createdAt: string;
  ports: string[];
  environment: string[];
  uptime?: string;
  resourceUsage?: ResourceUsage;
}

// GraphQL Arguments Types
interface AuditArgs {
  id: string;
}

interface AuditsByStatusArgs {
  status: string;
}

interface AuditsByTypeArgs {
  type: string;
}

interface ContainerArgs {
  id: string;
}

interface ContainersByStatusArgs {
  status: string;
}

interface CreateAuditArgs {
  type: string;
  target: string;
}

interface CreateContainerArgs {
  name: string;
  image: string;
}

interface IdArgs {
  id: string;
}

// Mock Data with proper typing
const mockAudits: SecurityAudit[] = [
  {
    id: '1',
    type: 'PORT_SCAN',
    target: 'localhost',
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    duration: 5000,
    results: {
      vulnerabilities: [],
      networkPorts: [
        {
          port: 80,
          protocol: 'TCP',
          service: 'HTTP',
          version: '1.1',
          state: 'OPEN',
        },
        {
          port: 443,
          protocol: 'TCP',
          service: 'HTTPS',
          version: '1.1',
          state: 'OPEN',
        },
        {
          port: 22,
          protocol: 'TCP',
          service: 'SSH',
          version: '2.0',
          state: 'OPEN',
        },
      ],
      dependencies: [],
      summary: {
        totalVulnerabilities: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        totalPorts: 3,
        openPorts: 3,
        totalDependencies: 0,
        outdatedDependencies: 0,
      },
    },
  },
  {
    id: '2',
    type: 'VULNERABILITY_SCAN',
    target: 'web-server',
    status: 'RUNNING',
    createdAt: new Date().toISOString(),
    completedAt: undefined,
    duration: undefined,
    results: undefined,
  },
];

const mockContainers: Container[] = [
  {
    id: '1',
    name: 'web-server',
    image: 'nginx:latest',
    status: 'RUNNING',
    createdAt: new Date().toISOString(),
    ports: ['80:80', '443:443'],
    environment: ['NODE_ENV=production'],
    uptime: '2 hours',
    resourceUsage: {
      cpu: 15.5,
      memory: 128.7,
      network: { bytesIn: 1024000, bytesOut: 2048000 },
    },
  },
  {
    id: '2',
    name: 'database',
    image: 'postgres:14',
    status: 'RUNNING',
    createdAt: new Date().toISOString(),
    ports: ['5432:5432'],
    environment: ['POSTGRES_DB=snapshot_runner'],
    uptime: '5 hours',
    resourceUsage: {
      cpu: 8.2,
      memory: 256.3,
      network: { bytesIn: 512000, bytesOut: 1024000 },
    },
  },
];

// GraphQL Resolvers
const resolvers = {
  Query: {
    // Security Audits
    audits: (): SecurityAudit[] => mockAudits,
    audit: (_: unknown, { id }: AuditArgs): SecurityAudit | undefined =>
      mockAudits.find((audit) => audit.id === id),
    auditsByStatus: (
      _: unknown,
      { status }: AuditsByStatusArgs,
    ): SecurityAudit[] => mockAudits.filter((audit) => audit.status === status),
    auditsByType: (_: unknown, { type }: AuditsByTypeArgs): SecurityAudit[] =>
      mockAudits.filter((audit) => audit.type === type),

    // Containers
    containers: (): Container[] => mockContainers,
    container: (_: unknown, { id }: ContainerArgs): Container | undefined =>
      mockContainers.find((container) => container.id === id),
    containersByStatus: (
      _: unknown,
      { status }: ContainersByStatusArgs,
    ): Container[] =>
      mockContainers.filter((container) => container.status === status),

    // Statistics
    auditStats: (): AuditSummary => ({
      totalVulnerabilities: 23,
      criticalCount: 5,
      highCount: 8,
      mediumCount: 7,
      lowCount: 3,
      totalPorts: 15,
      openPorts: 12,
      totalDependencies: 45,
      outdatedDependencies: 12,
    }),
    systemHealth: (): string => 'HEALTHY',
    status: (): string => 'Server is running!',
  },

  Mutation: {
    createAudit: (
      _: unknown,
      { type, target }: CreateAuditArgs,
    ): SecurityAudit => {
      const newAudit: SecurityAudit = {
        id: String(mockAudits.length + 1),
        type,
        target,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        completedAt: undefined,
        duration: undefined,
        results: undefined,
      };
      mockAudits.push(newAudit);
      return newAudit;
    },

    startAudit: (_: unknown, { id }: IdArgs): SecurityAudit | undefined => {
      const audit = mockAudits.find((a) => a.id === id);
      if (audit) {
        audit.status = 'RUNNING';
      }
      return audit;
    },

    stopAudit: (_: unknown, { id }: IdArgs): SecurityAudit | undefined => {
      const audit = mockAudits.find((a) => a.id === id);
      if (audit) {
        audit.status = 'CANCELLED';
      }
      return audit;
    },

    deleteAudit: (_: unknown, { id }: IdArgs): boolean => {
      const index = mockAudits.findIndex((a) => a.id === id);
      if (index > -1) {
        mockAudits.splice(index, 1);
        return true;
      }
      return false;
    },

    createContainer: (
      _: unknown,
      { name, image }: CreateContainerArgs,
    ): Container => {
      const newContainer: Container = {
        id: String(mockContainers.length + 1),
        name,
        image,
        status: 'CREATING',
        createdAt: new Date().toISOString(),
        ports: [],
        environment: [],
        uptime: undefined,
        resourceUsage: undefined,
      };
      mockContainers.push(newContainer);
      return newContainer;
    },

    startContainer: (_: unknown, { id }: IdArgs): Container | undefined => {
      const container = mockContainers.find((c) => c.id === id);
      if (container) {
        container.status = 'RUNNING';
      }
      return container;
    },

    stopContainer: (_: unknown, { id }: IdArgs): Container | undefined => {
      const container = mockContainers.find((c) => c.id === id);
      if (container) {
        container.status = 'COMPLETED';
      }
      return container;
    },

    restartContainer: (_: unknown, { id }: IdArgs): Container | undefined => {
      const container = mockContainers.find((c) => c.id === id);
      if (container) {
        container.status = 'RUNNING';
        container.uptime = '0 minutes';
      }
      return container;
    },

    deleteContainer: (_: unknown, { id }: IdArgs): boolean => {
      const index = mockContainers.findIndex((c) => c.id === id);
      if (index > -1) {
        mockContainers.splice(index, 1);
        return true;
      }
      return false;
    },
  },
};

async function startServer(): Promise<void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    // Apollo Server v3 uses Apollo Studio by default, no need for playground config

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';

async function startServer() {
  // Crear instancia de Express
  const app = express();

  // Configurar Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Configuración para desarrollo - desactivar Apollo Studio
    introspection: true,
    csrfPrevention: false,
  });

  // Inicializar Apollo Server
  await server.start();

  // Configurar middleware
  app.use(cors());
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  // GraphQL Playground simple
  app.get('/playground', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GraphQL Playground - Snapshot Runner</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #1a1a1a;
            color: white;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 { color: #61dafb; text-align: center; }
          .playground { 
            display: flex; 
            gap: 20px; 
            margin-top: 20px; 
            height: 60vh; 
          }
          .panel { 
            flex: 1; 
            background: #2d2d2d; 
            border-radius: 8px; 
            padding: 15px; 
          }
          textarea { 
            width: 100%; 
            height: 100%; 
            background: #1e1e1e; 
            color: #ffffff; 
            border: 1px solid #444; 
            border-radius: 4px; 
            padding: 10px; 
            font-family: 'Monaco', 'Consolas', monospace; 
            font-size: 14px;
            resize: none;
            outline: none;
            line-height: 1.4;
            tab-size: 2;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
          textarea:focus { 
            border-color: #61dafb; 
            box-shadow: 0 0 0 2px rgba(97, 218, 251, 0.2); 
          }
          button { 
            background: #61dafb; 
            color: #000; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 4px; 
            cursor: pointer; 
            font-weight: bold;
            margin: 10px 0;
          }
          button:hover { background: #4fa8c5; }
          .result { 
            background: #1e1e1e; 
            border: 1px solid #444; 
            border-radius: 4px; 
            padding: 10px; 
            height: calc(100% - 60px); 
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Consolas', monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 GraphQL Playground - Snapshot Runner</h1>
          <div class="playground">
            <div class="panel">
              <h3>Query</h3>
              <textarea id="query" placeholder="Escribe tu consulta GraphQL aquí... Puedes usar Ctrl+V para pegar">
{
  status
}</textarea>
              <div style="margin: 10px 0; display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="executeQuery()">▶ Ejecutar Query</button>
                <button onclick="clearQuery()" style="background: #666; color: white;">🗑️ Limpiar</button>
                <button onclick="loadExample()" style="background: #4CAF50; color: white;">📝 Ejemplo</button>
                <button onclick="focusQuery()" style="background: #FF9800; color: white;">🎯 Enfocar</button>
              </div>
            </div>
            <div class="panel">
              <h3>Resultado</h3>
              <div id="result" class="result">Presiona "Ejecutar Query" para ver los resultados...</div>
            </div>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #2d2d2d; border-radius: 8px;">
            <h3>🔗 Endpoints disponibles:</h3>
            <ul>
              <li><strong>GraphQL:</strong> <code>http://localhost:4000/graphql</code></li>
              <li><strong>Health:</strong> <code>http://localhost:4000/health</code></li>
              <li><strong>Playground:</strong> <code>http://localhost:4000/playground</code></li>
            </ul>
          </div>
        </div>

        <script>
          async function executeQuery() {
            const query = document.getElementById('query').value;
            const resultDiv = document.getElementById('result');
            
            if (!query.trim()) {
              resultDiv.textContent = 'Por favor, ingresa una consulta GraphQL.';
              return;
            }

            resultDiv.textContent = 'Ejecutando consulta...';

            try {
              const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
              });

              const result = await response.json();
              resultDiv.textContent = JSON.stringify(result, null, 2);
            } catch (error) {
              resultDiv.textContent = 'Error: ' + error.message;
            }
          }

          function clearQuery() {
            document.getElementById('query').value = '';
            document.getElementById('query').focus();
          }

          function loadExample() {
            document.getElementById('query').value = \`{
  audits {
    id
    type
    status
    target
    createdAt
  }
}\`;
            document.getElementById('query').focus();
          }

          function focusQuery() {
            const textarea = document.getElementById('query');
            textarea.focus();
            textarea.select();
          }

          // Auto-enfocar al cargar la página
          window.addEventListener('load', function() {
            setTimeout(() => {
              document.getElementById('query').focus();
            }, 100);
          });

          // Permitir Ctrl+Enter para ejecutar
          document.getElementById('query').addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              executeQuery();
            }
          });

          // Mejorar el pegado
          document.getElementById('query').addEventListener('paste', function(e) {
            // Permitir el pegado normal
            setTimeout(() => {
              console.log('Contenido pegado correctamente');
            }, 10);
          });
        </script>
      </body>
      </html>
    `);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'snapshot-runner-backend',
    });
  });

  // Ruta raíz
  app.get('/', (req, res) => {
    res.json({
      message: '🚀 Snapshot Runner Backend API',
      graphql: '/graphql',
      playground: '/playground',
      health: '/health',
      docs: 'Open /playground in browser for GraphQL Playground',
    });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🎮 GraphQL Playground: http://localhost:${PORT}/playground`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
      main
  });

  const port =
    Number(process.env.PORT) || Number(process.env.GRAPHQL_PORT) || 4000;

  const { url } = await server.listen({ port });

  console.log(`
🚀 Snapshot Runner GraphQL Server ready!
🔗 GraphQL endpoint: ${url}
🎮 GraphQL Studio: ${url}
🏥 Health check available via GraphQL queries
    `);
}

       develop

// Manejo de errores
       main
startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
