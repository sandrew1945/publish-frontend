'use client';

import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  /** Breadcrumb segments, e.g. ["Home", "Dashboard"] */
  breadcrumbs?: string[];
}

export function Header({ breadcrumbs = ['Home', 'Dashboard'] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/[0.06] bg-card/80 backdrop-blur-md px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb} className="flex items-center">
            {index > 0 && <span className="mx-2 text-muted-foreground/40">/</span>}
            <span className={index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search APIs, projects..."
          className="h-9 w-64 rounded-lg border border-white/[0.06] bg-background/60 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
        />
      </div>

      {/* Notification bell */}
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        {/* Notification dot */}
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
      </button>
    </header>
  );
}
