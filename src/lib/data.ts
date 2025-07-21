import { IconDashboard } from "@tabler/icons-react";
import { HomeIcon, LeafIcon, ScrollIcon } from "lucide-react";

export const navItems = [
  {
    name: "home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "sessions",
    href: "/sessions",
    icon: LeafIcon,
  },
  {
    name: "bookings",
    href: "/booking",
    icon: ScrollIcon,
  },
];

export const adminNavItem = {
  name: "admin",
  href: "/admin",
  icon: IconDashboard,
};
