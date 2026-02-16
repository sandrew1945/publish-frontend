'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { width, setWidth, isResizing, setIsResizing, isCollapsed } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, [setIsResizing]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        setWidth(mouseMoveEvent.clientX);
      }
    },
    [isResizing, setWidth]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div className={cn('flex min-h-screen', isResizing && 'no-transition select-none')}>
      {/* Desktop sidebar */}
      <div
        ref={sidebarRef}
        className="hidden md:flex flex-col fixed inset-y-0 z-50 transition-[width] duration-300 ease-in-out"
        style={{ width: isCollapsed ? 64 : width }}
      >
        <Sidebar className="h-full w-full" />
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className="sidebar-resize-handle"
            onMouseDown={startResizing}
            data-resizing={isResizing}
          />
        )}
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
      <div
        className="flex-1 flex flex-col transition-[padding] duration-300 ease-in-out"
        style={{ paddingLeft: isCollapsed ? 64 : width }}
      >
        {/* Mobile-only padding reset */}
        <div className="flex-1 flex flex-col md:pl-0 pl-0">
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

      {/* Mobile-specific style override to ignore desktop padding */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .flex-1.flex.flex-col {
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
