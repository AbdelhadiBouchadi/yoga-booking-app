import { IconDashboard } from '@tabler/icons-react';
import { HomeIcon, LeafIcon } from 'lucide-react';

export const navItems = [
  {
    name: 'home',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'sessions',
    href: '/sessions',
    icon: LeafIcon,
  },
  {
    name: 'admin',
    href: '/admin',
    icon: IconDashboard,
  },
];
