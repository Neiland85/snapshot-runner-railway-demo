"use client"

import { useState } from "react"
import { NavigationProvider, useNavigation } from "../lib/navigation"
import { SectionTransition } from "./ui/transitions"
// Remove lucide-react import as it's not installed
// import { Shield, AlertTriangle, CheckCircle, Loader2, Activity, Users } from "lucide-react"

// Utility functions to replace nested ternary operations
type ActivityStatus = "success" | "warning" | "error" | "info";
type ActivityType = "deployment" | "security" | "system" | "user" | "alert" | "backup";
type AuditStatus = "COMPLETED" | "RUNNING" | "FAILED";
type AuditSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

function getActivityStatusColor(status: ActivityStatus): string {
  switch (status) {
    case "success": return "bg-emerald-400";
    case "warning": return "bg-yellow-400";
    case "error": return "bg-red-400";
    case "info":
    default: return "bg-blue-400";
  }
}

function getActivityTypeStyles(type: ActivityType): string {
  switch (type) {
    case "deployment": return "bg-blue-500/20 text-blue-300";
    case "security": return "bg-red-500/20 text-red-300";
    case "system": return "bg-purple-500/20 text-purple-300";
    case "user": return "bg-emerald-500/20 text-emerald-300";
    case "alert": return "bg-orange-500/20 text-orange-300";
    case "backup":
    default: return "bg-slate-500/20 text-slate-300";
  }
}

function getAuditStatusStyles(status: AuditStatus): string {
  switch (status) {
    case "COMPLETED": return "bg-emerald-400";
    case "RUNNING": return "bg-blue-400 animate-pulse";
    case "FAILED":
    default: return "bg-red-400";
  }
}

function getAuditSeverityStyles(severity: AuditSeverity): string {
  switch (severity) {
    case "CRITICAL": return "bg-red-500/20 text-red-300";
    case "HIGH": return "bg-orange-500/20 text-orange-300";
    case "MEDIUM": return "bg-yellow-500/20 text-yellow-300";
    case "LOW":
    default: return "bg-blue-500/20 text-blue-300";
  }
}

// Mock container data with sanitized credentials
const generateMockContainers = () => [
  {
    id: "web-server-1a2b3c4d",
    name: "nginx-web-prod",
    image: "nginx",
    tag: "1.21-alpine",
    status: "RUNNING" as const,
    uptime: 86400,
    cpu: 45,
    memory: 67,
    network: { in: 1024000, out: 512000 },
    health: "healthy" as const,
    ports: ["80:80", "443:443"],
    logs: ["Starting nginx server on port 80", "SSL certificate loaded successfully"],
    env: { NODE_ENV: "production", PORT: "3000" },
    volumes: ["/var/www:/usr/share/nginx/html"],
    metrics: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      network: Math.random() * 1000,
    })),
  },
  {
    id: "api-server-5e6f7g8h",
    name: "node-api-backend",
    image: "node",
    tag: "18-alpine",
    status: "RUNNING" as const,
    uptime: 72000,
    cpu: 78,
    memory: 89,
    network: { in: 2048000, out: 1024000 },
    health: "healthy" as const,
    ports: ["3000:3000"],
    logs: ["Application started successfully", "Database connection established"],
    // Remove hardcoded credentials
    env: { NODE_ENV: "production", DATABASE_URL: "postgresql://user:****@db:5432/api" },
    volumes: ["/app:/usr/src/app", "/app/logs:/var/log"],
    metrics: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      network: Math.random() * 1000,
    })),
  },
  {
    id: "database-9i0j1k2l",
    name: "postgres-primary",
    image: "postgres",
    tag: "14",
    status: "RUNNING" as const,
    uptime: 172800,
    cpu: 23,
    memory: 45,
    network: { in: 512000, out: 256000 },
    health: "healthy" as const,
    ports: ["5432:5432"],
    logs: ["Database system ready", "Checkpoint completed"],
    env: { POSTGRES_DB: "myapp", POSTGRES_USER: "admin" },
    volumes: ["/var/lib/postgresql/data:/var/lib/postgresql/data"],
    metrics: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
      cpu: Math.random() * 50,
      memory: Math.random() * 60,
      network: Math.random() * 500,
    })),
  },
  {
    id: "redis-cache-1u2v3w4x",
    name: "redis-cache",
    image: "redis",
    tag: "7-alpine",
    status: "RUNNING" as const,
    uptime: 43200,
    cpu: 12,
    memory: 34,
    network: { in: 128000, out: 64000 },
    health: "healthy" as const,
    ports: ["6379:6379"],
    logs: ["Redis server started", "Ready to accept connections"],
    env: { REDIS_PASSWORD: "****" },
    volumes: ["/data:/data"],
    metrics: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
      cpu: Math.random() * 20,
      memory: Math.random() * 40,
      network: Math.random() * 300,
    })),
  },
]

// Mock dependency tree data with proper types
interface DependencyNode {
  id: string;
  name: string;
  version: string;
  type: "direct" | "transitive" | "dev";
  license: string;
  size: number;
  vulnerabilities: { critical: number; high: number; medium: number; low: number };
  depth: number;
  isExpanded: boolean;
  children: DependencyNode[];
}

const generateMockDependencies = (): DependencyNode[] => [
  {
    id: "my-app-1.0.0",
    name: "my-app",
    version: "1.0.0",
    type: "direct" as const,
    license: "MIT",
    size: 1024000,
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
    depth: 0,
    isExpanded: true,
    children: [
      {
        id: "react-18.2.0",
        name: "react",
        version: "18.2.0",
        type: "direct" as const,
        license: "MIT",
        size: 87000,
        vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
        depth: 1,
        isExpanded: false,
        children: [],
      },
    ],
  },
]

export default function FuturisticContainerDashboard() {
  return (
    <NavigationProvider initialSection="dashboard">
      <DashboardContent />
    </NavigationProvider>
  )
}

function DashboardContent() {
  const { state } = useNavigation()

  // Mock data
  const [containers] = useState(generateMockContainers())
  const [systemMetrics] = useState({
    cpu: 65,
    memory: 78,
    network: { in: 5120000, out: 2560000 },
  })

  const runningContainers = containers.filter((c) => c.status === "RUNNING").length
  const systemHealth = systemMetrics.cpu > 90 || systemMetrics.memory > 90 ? "critical" : "healthy"

  // Extract activity rendering into separate function to reduce complexity
  const renderActivityItem = (activity: {
    id: number;
    type: ActivityType;
    user: string;
    action: string;
    time: string;
    status: ActivityStatus;
  }) => {
    const statusColor = getActivityStatusColor(activity.status);
    const typeStyles = getActivityTypeStyles(activity.type);

    return (
      <div
        key={activity.id}
        className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-white/5"
      >
        <div className={`w-2 h-2 rounded-full mt-2 ${statusColor}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-slate-200">{activity.action}</p>
            <span className="text-xs text-slate-500">{activity.time}</span>
          </div>
          <p className="text-sm text-slate-400 mt-1">by {activity.user}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${typeStyles}`}>
          {activity.type}
        </div>
      </div>
    );
  };

  // Extract audit rendering to separate function
  const renderAuditItem = (audit: {
    id: string;
    name: string;
    target: string;
    status: AuditStatus;
    severity: AuditSeverity;
    findings: number;
    date: string;
  }) => {
    const statusStyles = getAuditStatusStyles(audit.status);
    const severityStyles = getAuditSeverityStyles(audit.severity);

    return (
      <div
        key={audit.id}
        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${statusStyles}`} />
          <div>
            <h4 className="font-medium text-slate-200">{audit.name}</h4>
            <p className="text-sm text-slate-400">
              {audit.target} • {audit.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${severityStyles}`}>
            {audit.severity}
          </span>
          <span className="text-sm text-slate-400">{audit.findings} findings</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-900 to-slate-900" />

      <div className="relative">
        <div className="p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Container Dashboard
          </h1>
          <p className="mt-2 text-slate-400">Modern container management interface</p>
        </div>

        <main className="flex-1 overflow-hidden pb-16 md:pb-0">
          {/* Dashboard Section */}
          <SectionTransition isActive={state.activeSection === "dashboard"} isLoading={state.isLoading}>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Running Containers</span>
                      <span className="text-emerald-400 font-medium">{runningContainers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Containers</span>
                      <span className="text-white font-medium">{containers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">System Health</span>
                      <span className={`font-medium ${systemHealth === "critical" ? "text-red-400" : "text-emerald-400"}`}>
                        {systemHealth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionTransition>

          {/* Activity Section */}
          <SectionTransition isActive={state.activeSection === "activity"} isLoading={state.isLoading}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Activity Feed
                  </h1>
                  <p className="mt-2 text-slate-400">Real-time system events and user activities</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-white/10 text-slate-300 bg-transparent rounded">
                    Filter
                  </button>
                  <button className="px-4 py-2 border border-white/10 text-slate-300 bg-transparent rounded">
                    Export
                  </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    {
                      id: 1,
                      type: "deployment" as ActivityType,
                      user: "admin@snapshotrunner.com",
                      action: "Deployed container nginx-web-prod v1.2.3",
                      time: "2 minutes ago",
                      status: "success" as ActivityStatus,
                    },
                    {
                      id: 2,
                      type: "security" as ActivityType,
                      user: "security-bot",
                      action: "Detected vulnerability in express@4.18.2",
                      time: "5 minutes ago",
                      status: "warning" as ActivityStatus,
                    },
                    {
                      id: 3,
                      type: "alert" as ActivityType,
                      user: "monitoring-system",
                      action: "High CPU usage detected on elasticsearch-search",
                      time: "25 minutes ago",
                      status: "error" as ActivityStatus,
                    },
                  ].map(renderActivityItem)}
                </div>
              </div>
            </div>
          </SectionTransition>

          {/* Security Audits Section */}
          <SectionTransition isActive={state.activeSection === "audits"} isLoading={state.isLoading}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Security Audits
                  </h1>
                  <p className="mt-2 text-slate-400">Comprehensive security analysis and vulnerability assessments</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded">
                  New Audit
                </button>
              </div>

              {/* Recent Audits */}
              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Security Audits</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: "audit-001",
                      name: "Container Security Scan",
                      target: "nginx-web-prod",
                      status: "COMPLETED" as AuditStatus,
                      severity: "HIGH" as AuditSeverity,
                      findings: 23,
                      date: "2 hours ago",
                    },
                    {
                      id: "audit-002",
                      name: "Dependency Vulnerability Check",
                      target: "node-api-backend",
                      status: "RUNNING" as AuditStatus,
                      severity: "MEDIUM" as AuditSeverity,
                      findings: 0,
                      date: "Running for 45m",
                    },
                    {
                      id: "audit-003",
                      name: "Network Security Assessment",
                      target: "postgres-primary",
                      status: "FAILED" as AuditStatus,
                      severity: "CRITICAL" as AuditSeverity,
                      findings: 5,
                      date: "1 day ago",
                    },
                  ].map(renderAuditItem)}
                </div>
              </div>
            </div>
          </SectionTransition>

          {/* Settings Section */}
          <SectionTransition isActive={state.activeSection === "settings"} isLoading={state.isLoading}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <p className="mt-2 text-slate-400">Configure your dashboard preferences</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auto-refresh" className="text-slate-300">Auto-refresh</label>
                    <input 
                      id="auto-refresh"
                      type="checkbox" 
                      className="rounded" 
                      defaultChecked 
                      aria-label="Enable auto-refresh"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="dark-mode" className="text-slate-300">Dark mode</label>
                    <input 
                      id="dark-mode"
                      type="checkbox" 
                      className="rounded" 
                      defaultChecked 
                      aria-label="Enable dark mode"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionTransition>
        </main>
      </div>
    </div>
  )
}
