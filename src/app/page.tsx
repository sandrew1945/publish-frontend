'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Next.js for blazing performance and instant navigation.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Fine-grained permissions with dynamic menu rendering per role.',
    color: 'from-purple-500 to-pink-400',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Insights',
    description: 'Monitor API health, track metrics, and stay on top of your platform.',
    color: 'from-emerald-500 to-teal-400',
  },
];

/**
 * Landing page with gradient hero, animated CTA, and feature cards.
 */
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-2xl relative z-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          v1.0.0 — Now available
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold font-heading leading-tight mb-4">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Vibe Publish
          </span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
          A modern publishing platform built for speed, security, and scalability. Manage your APIs,
          monitor health, and deploy with confidence.
        </p>

        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white gradient-active glow-md hover:glow-md transition-all duration-300"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3 mt-20 max-w-3xl w-full relative z-10">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            className="glass-card-hover p-5 text-center"
          >
            <div
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} mb-3`}
            >
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
