'use client';

import { motion } from 'framer-motion';
import { type LucideIcon, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityEvent {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
}

/** Sample mock data for the activity feed */
const MOCK_EVENTS: ActivityEvent[] = [
  {
    id: '1',
    icon: Plus,
    iconColor: 'bg-emerald-500/20 text-emerald-400',
    title: 'New API Registered:',
    description: 'Payment Gateway v2',
    timestamp: 'Registered by Sarah J. • 25 minutes ago',
  },
  {
    id: '2',
    icon: RefreshCw,
    iconColor: 'bg-blue-500/20 text-blue-400',
    title: 'Endpoint Updated:',
    description: 'POST /auth/login',
    timestamp: 'Updated by Mike R. • 1 hour ago',
  },
  {
    id: '3',
    icon: AlertTriangle,
    iconColor: 'bg-red-500/20 text-red-400',
    title: 'High Latency Alert:',
    description: 'User Service',
    timestamp: 'System Alert • 3 hours ago',
  },
];

/**
 * Recent activity feed component.
 * Displays a list of events with icons, descriptions, and timestamps.
 */
export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
        <button
          type="button"
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_EVENTS.map((event) => (
          <div key={event.id} className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                event.iconColor
              )}
            >
              <event.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{event.title}</span>{' '}
                <span className="text-primary">{event.description}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
