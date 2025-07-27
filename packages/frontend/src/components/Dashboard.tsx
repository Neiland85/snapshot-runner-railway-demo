import React, { useState, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavigationProvider, useNavigation, useKeyboardNavigation } from '../lib/navigation';
import { SectionTransition, MetricsCard, StatusBadge, ProgressBar } from './ui/transitions';
import { 
  Server, 
  Database, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Cpu,
  MemoryStick,
  Network
} from 'lucide-react';

// GraphQL Queries corregidas para el schema actual
const GET_STATUS = gql`
  query GetStatus {
    status
  }
`;

const GET_ACTIVE_CONTAINERS = gql`
  query GetActiveContainers {
    activeContainers {
      id
      status
      auditId
      image
    }
  }
`;

const GET_AUDITS = gql`
  query GetAudits {
    audits {
      id
      type
      status
      target
      language
      containerId
      createdAt
      updatedAt
      completedAt
    }
  }
`;

// Componente principal del Dashboard
export default function Dashboard() {
  return (
    <NavigationProvider initialSection="dashboard">
      <DashboardContent />
    </NavigationProvider>
  );
}

// Helper functions para reducir complejidad
const getCpuVariant = (cpu: number): 'danger' | 'warning' | 'success' => {
  if (cpu > 80) return 'danger';
  if (cpu > 60) return 'warning';
  return 'success';
};

const getMemoryVariant = (memory: number): 'danger' | 'warning' | 'success' => {
  if (memory > 85) return 'danger';
  if (memory > 70) return 'warning';
  return 'success';
};

const getSystemHealthVariant = (cpu: number, memory: number): 'danger' | 'success' => {
  return (cpu > 90 || memory > 90) ? 'danger' : 'success';
};

function DashboardContent() {
  const { state, navigateToSection } = useNavigation();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Apollo queries para obtener datos reales
  const { loading: statusLoading, error: statusError, data: statusData } = useQuery(GET_STATUS, {
    pollInterval: autoRefresh ? 5000 : 0,
    errorPolicy: 'all',
  });

  const { loading: containersLoading, error: containersError, data: containersData, refetch } = useQuery(GET_ACTIVE_CONTAINERS, {
    pollInterval: autoRefresh ? 3000 : 0,
    errorPolicy: 'all',
  });

  const { loading: auditsLoading, error: auditsError, data: auditsData } = useQuery(GET_AUDITS, {
    pollInterval: autoRefresh ? 10000 : 0,
    errorPolicy: 'all',
  });

  // Estado de carga combinado
  const loading = statusLoading || containersLoading || auditsLoading;
  const error = statusError || containersError || auditsError;
  const data = {
    status: statusData?.status,
    activeContainers: containersData?.activeContainers || [],
    audits: auditsData?.audits || []
  };

  const sections = ['dashboard', 'containers', 'security', 'activity', 'settings'];

  const handleSectionChange = useCallback((section: string) => {
    const breadcrumbMap = {
      dashboard: [{ label: 'Dashboard', current: true }],
      containers: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Contenedores', current: true },
      ],
      security: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Seguridad', current: true },
      ],
      activity: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Actividad', current: true },
      ],
      settings: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Configuración', current: true },
      ],
    };

    navigateToSection(section, breadcrumbMap[section as keyof typeof breadcrumbMap]);
  }, [navigateToSection]);

  // Hook de navegación por teclado
  useKeyboardNavigation(sections, state.activeSection, handleSectionChange);

  // Procesar datos de contenedores
  const containers = data?.activeContainers || [];
  const runningContainers = containers.filter((c: any) => c.status === 'RUNNING').length;
  const failedContainers = containers.filter((c: any) => c.status === 'FAILED').length;

  // Métricas simuladas del sistema
  const systemMetrics = {
    cpu: 65,
    memory: 78,
    network: { in: 5120000, out: 2560000 },
  };

  const systemHealth = getSystemHealthVariant(systemMetrics.cpu, systemMetrics.memory);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="card-railway p-8 max-w-md">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error de Conexión</h2>
            <p className="text-muted-foreground mb-4">
              No se puede conectar con el backend GraphQL
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Efectos de fondo estilo V0.dev */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-900 to-slate-900" />
      <div className="fixed inset-0 cyber-grid opacity-20" />

      <div className="relative">
        {/* Header de navegación */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text-railway">
                  🚀 Railway Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gestión avanzada de contenedores
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    autoRefresh 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {autoRefresh ? 'Auto-actualización ON' : 'Auto-actualización OFF'}
                </button>
                
                <button
                  onClick={() => refetch()}
                  disabled={loading}
                  className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {/* Navegación por pestañas */}
            <nav className="mt-4 flex space-x-1">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    state.activeSection === section
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Dashboard Principal */}
          <SectionTransition isActive={state.activeSection === 'dashboard'} isLoading={loading}>
            <div className="space-y-8">
              {/* Métricas principales */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Contenedores Total"
                  value={containers.length}
                  icon={<Server className="h-8 w-8 text-primary" />}
                  description="Contenedores registrados"
                />
                
                <MetricsCard
                  title="En Ejecución"
                  value={runningContainers}
                  icon={<CheckCircle className="h-8 w-8 text-emerald-400" />}
                  variant="success"
                  trend="up"
                />

                <MetricsCard
                  title="Con Fallos"
                  value={failedContainers}
                  icon={<AlertTriangle className="h-8 w-8 text-red-400" />}
                  variant={failedContainers > 0 ? "danger" : "default"}
                  trend={failedContainers > 0 ? "up" : "neutral"}
                />

                <MetricsCard
                  title="Estado del Sistema"
                  value={systemHealth === 'success' ? 'Saludable' : 'Crítico'}
                  icon={<Shield className="h-8 w-8 text-violet-400" />}
                  variant={systemHealth}
                />
              </div>

              {/* Métricas del sistema */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="card-railway p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Cpu className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-foreground">CPU</h3>
                  </div>
                  <ProgressBar
                    value={systemMetrics.cpu}
                    variant={getCpuVariant(systemMetrics.cpu)}
                    label="Uso de CPU"
                  />
                </div>

                <div className="card-railway p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MemoryStick className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-foreground">Memoria</h3>
                  </div>
                  <ProgressBar
                    value={systemMetrics.memory}
                    variant={getMemoryVariant(systemMetrics.memory)}
                    label="Uso de Memoria"
                  />
                </div>

                <div className="card-railway p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Network className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-foreground">Red</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entrada:</span>
                      <span className="text-foreground">{(systemMetrics.network.in / 1024 / 1024).toFixed(1)} MB/s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salida:</span>
                      <span className="text-foreground">{(systemMetrics.network.out / 1024 / 1024).toFixed(1)} MB/s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de contenedores */}
              <div className="card-railway p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Contenedores Activos</h2>
                
                {containers.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay contenedores disponibles</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {containers.map((container: any, index: number) => (
                      <motion.div
                        key={container.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="card-railway p-4 hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{container.name}</h3>
                            <p className="text-sm text-muted-foreground">{container.image}</p>
                          </div>
                          <StatusBadge status={container.status} size="sm" />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Puertos:</span>
                            <span className="text-foreground">{container.ports?.join(', ') || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Creado:</span>
                            <span className="text-foreground">
                              {new Date(container.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionTransition>

          {/* Otras secciones */}
          <SectionTransition isActive={state.activeSection === 'containers'}>
            <div className="card-railway p-8 text-center">
              <Server className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold gradient-text-railway mb-2">
                Gestión de Contenedores
              </h2>
              <p className="text-muted-foreground">
                Vista detallada de todos los contenedores (Próximamente)
              </p>
            </div>
          </SectionTransition>

          <SectionTransition isActive={state.activeSection === 'security'}>
            <div className="card-railway p-8 text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold gradient-text-railway mb-2">
                Panel de Seguridad
              </h2>
              <p className="text-muted-foreground">
                Análisis de vulnerabilidades y auditorías (Próximamente)
              </p>
            </div>
          </SectionTransition>

          <SectionTransition isActive={state.activeSection === 'activity'}>
            <div className="card-railway p-8 text-center">
              <Activity className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold gradient-text-railway mb-2">
                Registro de Actividad
              </h2>
              <p className="text-muted-foreground">
                Historial y logs del sistema (Próximamente)
              </p>
            </div>
          </SectionTransition>

          <SectionTransition isActive={state.activeSection === 'settings'}>
            <div className="card-railway p-8 text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold gradient-text-railway mb-2">
                Configuración
              </h2>
              <p className="text-muted-foreground">
                Personalización del dashboard (Próximamente)
              </p>
            </div>
          </SectionTransition>
        </main>

        {/* Footer con atajos de teclado */}
        <footer className="border-t border-border bg-background/80 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>© 2025 Railway Dashboard - Snapshot Runner</p>
              <p>Atajos: Ctrl/Cmd + ← → para navegar | Ctrl/Cmd + 1-5 para secciones</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
