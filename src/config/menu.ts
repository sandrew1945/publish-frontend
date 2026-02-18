import { type LucideIcon, LayoutDashboard, Settings, User, Users, ShieldCheck } from 'lucide-react';

export interface MenuItem {
  id?: string;
  title: string;
  href: string;
  icon?: string | LucideIcon;
  roles?: string[]; // 'ADMIN', 'EDITOR', 'USER'
  items?: MenuItem[]; // Nested items
  parentId?: string;
  order?: number;
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
        icon: User,
        roles: ['ADMIN'],
      },
      {
        title: 'Role Management',
        href: '/system/role-management',
        icon: ShieldCheck,
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
