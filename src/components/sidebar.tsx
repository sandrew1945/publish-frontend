'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LogOut, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSidebar } from '@/lib/sidebar-context';
import { SidebarItem } from './sidebar-item';
import { useUserMenu } from '@/hooks/use-menu';
import { mapTreeNodeToMenuItem } from '@/lib/menu-utils';
import { useMemo } from 'react';

const APP_VERSION = 'v1.0.0';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebar();

  // Fetch menu based on user role
  const { data: menuTree, isLoading } = useUserMenu(user?.roleId);

  // Map backend tree to MenuItem[]
  const menuItems = useMemo(() => {
    if (!menuTree) return [];
    return menuTree.map(mapTreeNodeToMenuItem);
  }, [menuTree]);

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = user?.userName ? getInitials(user.userName) : 'U';
  const displayRole = user?.roleName || 'User';

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card/80 backdrop-blur-md border-r border-white/[0.06] transition-all duration-300',
        className
      )}
    >
      {/* Branding */}
      <div
        className={cn(
          'flex items-center border-b border-white/[0.06]',
          isCollapsed ? 'justify-center px-2 py-5' : 'px-6 py-5'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-active">
            <span className="text-sm font-bold text-white">VP</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Vibe Publish</h2>
              <span className="text-[11px] text-muted-foreground">{APP_VERSION}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 py-4 space-y-1', isCollapsed ? 'px-2' : 'px-3')}>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          menuItems.map((item) => (
            <SidebarItem
              key={item.id || item.href}
              item={item}
              isCollapsed={isCollapsed}
              userRole={user?.roleCode}
            />
          ))
        )}
        {!isLoading && menuItems.length === 0 && (
          <div
            className={cn(
              'text-xs text-muted-foreground text-center py-4',
              isCollapsed && 'hidden'
            )}
          >
            No menu items found.
          </div>
        )}
      </nav>

      {/* Toggle Button */}
      <div className={cn('px-3 py-2', isCollapsed ? 'flex justify-center' : 'flex justify-end')}>
        <button
          onClick={toggleCollapse}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* User profile */}
      <div className={cn('border-t border-white/[0.06]', isCollapsed ? 'p-2' : 'px-3 py-4')}>
        <div
          className={cn(
            'flex items-center gap-3',
            isCollapsed ? 'justify-center flex-col px-0 py-2' : 'px-3 py-2'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
            <span className="text-xs font-semibold text-white">{userInitials}</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.userName || 'User'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{displayRole}</p>
            </div>
          )}

          {isCollapsed ? (
            <button
              type="button"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-white/[0.04] mt-2"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-white/[0.04]"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
