'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { menuItems } from '@/config/menu';
import { LogOut } from 'lucide-react';

/** Mock role — would normally come from auth context */
const CURRENT_USER_ROLE = 'ADMIN';

const MOCK_USER = {
  name: 'Alex Morgan',
  role: 'Admin',
  avatarInitials: 'AM',
};

const APP_VERSION = 'v1.0.0';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col h-full bg-card border-r border-white/[0.06]', className)}>
      {/* Branding */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-active">
            <span className="text-sm font-bold text-white">VP</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Vibe Publish</h2>
            <span className="text-[11px] text-muted-foreground">{APP_VERSION}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(CURRENT_USER_ROLE)) {
            return null;
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'gradient-active text-white shadow-lg shadow-blue-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
            <span className="text-xs font-semibold text-white">{MOCK_USER.avatarInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{MOCK_USER.name}</p>
            <p className="text-[11px] text-muted-foreground">{MOCK_USER.role}</p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
