'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'DOWN';

interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  /** 0–100 progress bar percentage */
  progress: number;
}

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; badgeClass: string; barClass: string }
> = {
  OPERATIONAL: {
    label: 'OPERATIONAL',
    badgeClass: 'bg-emerald-500/20 text-emerald-400',
    barClass: 'bg-emerald-500',
  },
  DEGRADED: {
    label: 'DEGRADED',
    badgeClass: 'bg-amber-500/20 text-amber-400',
    barClass: 'bg-amber-500',
  },
  DOWN: {
    label: 'DOWN',
    badgeClass: 'bg-red-500/20 text-red-400',
    barClass: 'bg-red-500',
  },
};

const MOCK_SERVICES: ServiceHealth[] = [
  { name: 'API Gateway', status: 'OPERATIONAL', progress: 100 },
  { name: 'Database Cluster', status: 'OPERATIONAL', progress: 98 },
  { name: 'Auth Service', status: 'DEGRADED', progress: 65 },
];

const AVERAGE_LATENCY = '45ms';

/**
 * System health panel showing backend service statuses
 * with color-coded progress bars and average latency.
 */
export function SystemHealth() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">System Health</h3>
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="space-y-4">
        {MOCK_SERVICES.map((service) => {
          const config = STATUS_CONFIG[service.status];
          return (
            <div key={service.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground">{service.name}</span>
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    config.badgeClass
                  )}
                >
                  {config.label}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                <div
                  className={cn('h-full rounded-full transition-all', config.barClass)}
                  style={{ width: `${service.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
        <span className="text-sm text-muted-foreground">Average Latency</span>
        <span className="text-sm font-semibold text-foreground">{AVERAGE_LATENCY}</span>
      </div>
    </motion.div>
  );
}
