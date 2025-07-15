import { IconDashboard } from '@tabler/icons-react';
import { HomeIcon, LeafIcon } from 'lucide-react';

export const navItems = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'Sessions',
    href: '/sessions',
    icon: LeafIcon,
  },
  {
    name: 'Dashboard',
    href: '/admin',
    icon: IconDashboard,
  },
];
