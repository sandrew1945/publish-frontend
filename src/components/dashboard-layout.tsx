'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <Sidebar className="h-full" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <Sidebar className="h-full" />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header with mobile toggle */}
        <div className="relative">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Header />
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
