import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilities para estilos de componentes - Evita operadores ternarios anidados
export type ActivityType = 'deployment' | 'security' | 'system' | 'user' | 'alert' | 'backup';
export type ActivityStatus = 'success' | 'warning' | 'error' | 'info';
export type AuditSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AuditStatus = 'COMPLETED' | 'RUNNING' | 'FAILED';

/**
 * Obtiene las clases CSS para el tipo de actividad
 */
export const getActivityTypeStyles = (activityType: string): string => {
  const styleMap: Record<ActivityType, string> = {
    deployment: "bg-blue-500/20 text-blue-300",
    security: "bg-red-500/20 text-red-300", 
    system: "bg-purple-500/20 text-purple-300",
    user: "bg-emerald-500/20 text-emerald-300",
    alert: "bg-orange-500/20 text-orange-300",
    backup: "bg-slate-500/20 text-slate-300"
  };
  
  return styleMap[activityType as ActivityType] || "bg-slate-500/20 text-slate-300";
};

/**
 * Obtiene las clases CSS para el estado de actividad
 */
export const getActivityStatusStyles = (status: string): string => {
  const statusMap: Record<ActivityStatus, string> = {
    success: "bg-emerald-400",
    warning: "bg-yellow-400", 
    error: "bg-red-400",
    info: "bg-blue-400"
  };
  
  return statusMap[status as ActivityStatus] || "bg-blue-400";
};

/**
 * Obtiene las clases CSS para la severidad de auditoría
 */
export const getAuditSeverityStyles = (severity: string): string => {
  const severityMap: Record<AuditSeverity, string> = {
    CRITICAL: "bg-red-500/20 text-red-300",
    HIGH: "bg-orange-500/20 text-orange-300", 
    MEDIUM: "bg-yellow-500/20 text-yellow-300",
    LOW: "bg-green-500/20 text-green-300"
  };
  
  return severityMap[severity as AuditSeverity] || "bg-slate-500/20 text-slate-300";
};

/**
 * Obtiene las clases CSS para el estado de auditoría
 */
export const getAuditStatusStyles = (status: string): string => {
  const statusMap: Record<AuditStatus, string> = {
    COMPLETED: "bg-emerald-400",
    RUNNING: "bg-blue-400 animate-pulse",
    FAILED: "bg-red-400"
  };
  
  return statusMap[status as AuditStatus] || "bg-slate-400";
};

/**
 * Obtiene el color del indicador de estado de contenedor
 */
export const getContainerStatusColor = (status: string): string => {
  const statusColors = {
    RUNNING: "bg-emerald-400",
    STOPPED: "bg-gray-400",
    FAILED: "bg-red-400",
    CREATING: "bg-blue-400",
    COMPLETED: "bg-violet-400"
  };
  
  return statusColors[status as keyof typeof statusColors] || "bg-gray-400";
};

/**
 * Obtiene el texto localizado para el estado de contenedor
 */
export const getContainerStatusText = (status: string): string => {
  const statusText = {
    RUNNING: "Ejecutándose",
    STOPPED: "Detenido", 
    FAILED: "Error",
    CREATING: "Creando",
    COMPLETED: "Completado"
  };
  
  return statusText[status as keyof typeof statusText] || "Desconocido";
};

/**
 * Obtiene las clases CSS para métricas del sistema
 */
export const getSystemMetricVariant = (value: number, thresholds: { warning: number; danger: number }): 'success' | 'warning' | 'danger' => {
  if (value > thresholds.danger) return 'danger';
  if (value > thresholds.warning) return 'warning';
  return 'success';
};
