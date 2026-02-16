'use client';

import { FolderKanban, Puzzle, Zap, ListChecks } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { ActivityFeed } from '@/components/activity-feed';
import { SystemHealth } from '@/components/system-health';
import { motion } from 'framer-motion';

/**
 * Dashboard overview page with stat cards, activity feed,
 * system health panel, and CTA card.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your API ecosystem performance and health.
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Projects"
          value="12"
          trend="2%"
          trendUp
          icon={FolderKanban}
          iconColor="bg-blue-500/20 text-blue-400"
          delay={0}
        />
        <StatCard
          label="Total APIs"
          value="48"
          trend="12%"
          trendUp
          icon={Puzzle}
          iconColor="bg-purple-500/20 text-purple-400"
          delay={0.08}
        />
        <StatCard
          label="Today's Calls"
          value="1.2M"
          trend="5.4%"
          trendUp
          icon={Zap}
          iconColor="bg-cyan-500/20 text-cyan-400"
          delay={0.16}
        />
        <StatCard
          label="Active Tasks"
          value="8"
          icon={ListChecks}
          iconColor="bg-orange-500/20 text-orange-400"
          delay={0.24}
        />
      </div>

      {/* Lower section: Activity + Health + CTA */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Activity feed - takes 3 cols */}
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>

        {/* Right column: Health + CTA */}
        <div className="lg:col-span-2 space-y-4">
          <SystemHealth />

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
            className="glass-card p-5 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-active mx-auto mb-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Ready to deploy?</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Register a new API endpoint and start testing immediately.
            </p>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white gradient-active glow-sm hover:glow-md transition-shadow"
            >
              Register New API
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
