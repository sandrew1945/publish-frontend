import { type LucideIcon, LayoutDashboard, Settings, User, Users } from 'lucide-react';

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // 'ADMIN', 'EDITOR', 'USER'
}

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'EDITOR', 'USER'],
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'My Profile',
    href: '/profile',
    icon: User,
    roles: ['ADMIN', 'EDITOR', 'USER'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];
