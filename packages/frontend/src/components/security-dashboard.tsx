/*
 * Copyright 2025 Neil Muñoz Lago (Neiland85)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from "react";
import { NavigationProvider, useNavigation } from "../lib/navigation";
import { SectionTransition } from "./ui/transitions";

// Utility functions for security status
type SecurityStatus = "secure" | "warning" | "critical";
type VulnerabilityLevel = "low" | "medium" | "high" | "critical";

function getSecurityStatusColor(status: SecurityStatus): string {
  switch (status) {
    case "secure": return "bg-emerald-400";
    case "warning": return "bg-yellow-400";
    case "critical": return "bg-red-400";
    default: return "bg-gray-400";
  }
}

function getSecurityScoreWidth(score: number): string {
  if (score >= 75) return 'w-3/4';
  if (score >= 50) return 'w-1/2';
  return 'w-1/4';
}

function getVulnerabilityStyles(level: VulnerabilityLevel): string {
  switch (level) {
    case "critical": return "bg-red-500/20 text-red-300 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    case "medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "low": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
}

// Security Dashboard Component
export default function SecurityDashboard() {
  return (
    <NavigationProvider initialSection="security">
      <SecurityDashboardContent />
    </NavigationProvider>
  );
}

function SecurityDashboardContent() {
  const { state } = useNavigation();

  // Security metrics data
  const [securityMetrics] = useState({
    overallScore: 75,
    totalVulnerabilities: 9,
    frontendVulns: 9,
    backendVulns: 0,
    exposedCredentials: 0,
    lastScan: "hace 5 minutos",
    status: "warning" as SecurityStatus
  });

  const vulnerabilities = [
    {
      id: "nth-check",
      package: "nth-check",
      severity: "high" as VulnerabilityLevel,
      description: "Inefficient Regular Expression Complexity",
      cve: "GHSA-rp65-9cf3-cjxr",
      component: "Frontend",
      fixAvailable: true
    },
    {
      id: "postcss",
      package: "postcss", 
      severity: "medium" as VulnerabilityLevel,
      description: "PostCSS line return parsing error",
      cve: "GHSA-7fh5-64p2-3v2j",
      component: "Frontend",
      fixAvailable: true
    },
    {
      id: "webpack-dev-server",
      package: "webpack-dev-server",
      severity: "medium" as VulnerabilityLevel,
      description: "Source code may be stolen when accessing malicious web site",
      cve: "GHSA-9jgg-88mc-972h",
      component: "Frontend", 
      fixAvailable: true
    }
  ];

  const securityChecks = [
    {
      name: "Credenciales expuestas",
      status: "secure" as SecurityStatus,
      description: "✅ No se encontraron credenciales hardcodeadas",
      details: "Token de Railway sanitizado correctamente"
    },
    {
      name: "Dependencias Backend",
      status: "secure" as SecurityStatus,
      description: "✅ 0 vulnerabilidades encontradas",
      details: "Todas las dependencias están actualizadas"
    },
    {
      name: "Dependencias Frontend", 
      status: "warning" as SecurityStatus,
      description: "⚠️ 9 vulnerabilidades identificadas",
      details: "Requiere actualización de react-scripts"
    },
    {
      name: "Calidad del código",
      status: "secure" as SecurityStatus,
      description: "✅ Código limpio y tipado",
      details: "TypeScript estricto, funciones helper implementadas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-900 to-slate-900" />

      <div className="relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                🔐 Security Dashboard
              </h1>
              <p className="mt-2 text-slate-400">
                Monitoreo de seguridad en tiempo real - Última verificación: {securityMetrics.lastScan}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getSecurityStatusColor(securityMetrics.status)}`} />
              <span className="text-sm font-medium">
                Score: {securityMetrics.overallScore}/100
              </span>
            </div>
          </div>
        </div>

        <main className="p-6 space-y-8">
          {/* Security Overview */}
          <SectionTransition isActive={state.activeSection === "security"} isLoading={state.isLoading}>
            <div className="grid gap-6 md:grid-cols-4">
              {/* Overall Security Score */}
              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Puntuación General</h3>
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="text-3xl font-bold text-slate-50 mb-2">
                  {securityMetrics.overallScore}/100
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`
                    bg-gradient-to-r from-yellow-500 to-emerald-500 h-2 rounded-full transition-all duration-300
                    ${getSecurityScoreWidth(securityMetrics.overallScore)}
                  `} />
                </div>
              </div>

              {/* Total Vulnerabilities */}
              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Vulnerabilidades</h3>
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {securityMetrics.totalVulnerabilities}
                </div>
                <p className="text-sm text-slate-400">
                  {securityMetrics.frontendVulns} frontend, {securityMetrics.backendVulns} backend
                </p>
              </div>

              {/* Exposed Credentials */}
              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Credenciales</h3>
                  <span className="text-2xl">🔑</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  {securityMetrics.exposedCredentials}
                </div>
                <p className="text-sm text-slate-400">Credenciales expuestas</p>
              </div>

              {/* Last Scan */}
              <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Último Escaneo</h3>
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="text-lg font-bold text-slate-50 mb-2">
                  {securityMetrics.lastScan}
                </div>
                <button className="text-sm text-violet-400 hover:text-violet-300">
                  Ejecutar nuevo escaneo
                </button>
              </div>
            </div>

            {/* Security Checks Status */}
            <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Estado de Verificaciones de Seguridad</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {securityChecks.map((check) => (
                  <div
                    key={check.name}
                    className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-white/5"
                  >
                    <div className={`w-3 h-3 rounded-full mt-1 ${getSecurityStatusColor(check.status)}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-200">{check.name}</h4>
                      <p className="text-sm text-slate-300 mt-1">{check.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{check.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerabilities Detail */}
            <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Vulnerabilidades Detectadas</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded">
                  Aplicar Correcciones
                </button>
              </div>
              <div className="space-y-4">
                {vulnerabilities.map((vuln) => (
                  <div
                    key={vuln.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-white/5"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-slate-200">{vuln.package}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getVulnerabilityStyles(vuln.severity)}`}>
                          {vuln.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {vuln.component}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{vuln.description}</p>
                      <p className="text-xs text-slate-500 mt-1">CVE: {vuln.cve}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {vuln.fixAvailable && (
                        <span className="text-emerald-400 text-sm">🔧 Fix disponible</span>
                      )}
                      <button className="text-violet-400 hover:text-violet-300 text-sm">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Recommendations */}
            <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Recomendaciones de Seguridad</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <span className="text-yellow-400 text-xl">⚡</span>
                  <div>
                    <h4 className="font-medium text-yellow-300">Acción Inmediata</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Ejecutar <code className="bg-slate-700 px-2 py-1 rounded text-xs">npm audit fix --force</code> para corregir vulnerabilidades automáticamente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-xl">🔄</span>
                  <div>
                    <h4 className="font-medium text-blue-300">Mediano Plazo</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      Migrar de Create React App a Vite para reducir vulnerabilidades y mejorar performance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <span className="text-emerald-400 text-xl">✅</span>
                  <div>
                    <h4 className="font-medium text-emerald-300">Implementado</h4>
                    <p className="text-sm text-slate-300 mt-1">
                      GitHub Actions configurado para auditorías automáticas de seguridad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionTransition>
        </main>
      </div>
    </div>
  );
}
