'use client';

import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  /** Card label, e.g. "Total Projects" */
  label: string;
  /** Large display value, e.g. "12" or "1.2M" */
  value: string;
  /** Trend string, e.g. "+2%" or "-5.4%" */
  trend?: string;
  /** Whether the trend is positive */
  trendUp?: boolean;
  /** Icon to display */
  icon: LucideIcon;
  /** Background color class for the icon badge */
  iconColor?: string;
  /** Animation delay in seconds for staggered entrance */
  delay?: number;
}

/**
 * Dashboard stat card with icon badge, large number, and trend indicator.
 * Uses Framer Motion for staggered fade-up entrance.
 */
export function StatCard({
  label,
  value,
  trend,
  trendUp = true,
  icon: Icon,
  iconColor = 'bg-blue-500/20 text-blue-400',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="glass-card-hover p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconColor)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              'flex items-center text-xs font-medium mb-1',
              trendUp ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            <svg
              className={cn('h-3 w-3 mr-0.5', !trendUp && 'rotate-180')}
              viewBox="0 0 12 12"
              fill="none"
            >
              <path d="M6 2.5L9.5 6.5H2.5L6 2.5Z" fill="currentColor" />
            </svg>
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
