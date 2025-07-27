import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionTransitionProps {
  readonly children: React.ReactNode;
  readonly isActive: boolean;
  readonly isLoading?: boolean;
}

export function SectionTransition({ children, isActive, isLoading = false }: SectionTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-muted-foreground">Cargando...</span>
              </div>
            </div>
          ) : (
            children
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MetricsCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly description?: string;
  readonly icon?: React.ReactNode;
  readonly trend?: 'up' | 'down' | 'neutral';
  readonly variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function MetricsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend = 'neutral',
  variant = 'default' 
}: MetricsCardProps) {
  const variantStyles = {
    default: 'card-railway',
    success: 'card-railway border-emerald-500/30 bg-emerald-500/5',
    warning: 'card-railway border-yellow-500/30 bg-yellow-500/5',
    danger: 'card-railway border-red-500/30 bg-red-500/5',
  };

  const trendIcon = {
    up: '↗️',
    down: '↘️',
    neutral: '→',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={variantStyles[variant]}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          {trend !== 'neutral' && (
            <span className="text-lg">{trendIcon[trend]}</span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

interface StatusBadgeProps {
  readonly status: 'RUNNING' | 'STOPPED' | 'FAILED' | 'CREATING' | 'COMPLETED';
  readonly size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    RUNNING: {
      label: 'Ejecutándose',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: '🟢',
    },
    STOPPED: {
      label: 'Detenido',
      className: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      icon: '⚫',
    },
    FAILED: {
      label: 'Error',
      className: 'bg-red-500/10 text-red-400 border-red-500/30 threat-glow-critical',
      icon: '🔴',
    },
    CREATING: {
      label: 'Creando',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: '🔵',
    },
    COMPLETED: {
      label: 'Completado',
      className: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      icon: '🟣',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const config = statusConfig[status];

  return (
    <span className={`
      inline-flex items-center space-x-1 rounded-full border font-medium
      ${config.className}
      ${sizeStyles[size]}
    `}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

interface ProgressBarProps {
  readonly value: number;
  readonly max?: number;
  readonly label?: string;
  readonly variant?: 'default' | 'success' | 'warning' | 'danger';
  readonly showPercentage?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  variant = 'default',
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantStyles = {
    default: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${variantStyles[variant]}`}
        />
      </div>
    </div>
  );
}
