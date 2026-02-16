import { type LucideIcon, LayoutDashboard, Settings, User, Users } from 'lucide-react';

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // 'ADMIN', 'EDITOR', 'USER'
  items?: MenuItem[]; // Nested items
}

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'EDITOR', 'USER'],
  },
  {
    title: 'System',
    href: '/system',
    icon: Settings,
    roles: ['ADMIN'],
    items: [
      {
        title: 'User Management',
        href: '/system/user-management',
        icon: Users,
        roles: ['ADMIN'],
      },
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        roles: ['ADMIN'],
      },
    ],
  },
];
