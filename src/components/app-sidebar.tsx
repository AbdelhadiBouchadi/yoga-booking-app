"use client";

import * as React from "react";
import {
  IconBlender,
  IconCalendar,
  IconChalkboardTeacher,
  IconDashboard,
  IconFolder,
  IconTicket,
  IconUsers,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import LogoGreen from "../.././public/logo-green.webp";
import LogoOrange from "../.././public/logo-orange.webp";
import { useTheme } from "next-themes";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },

    {
      title: "Sessions",
      url: "/admin/sessions",
      icon: IconFolder,
    },
    {
      title: "Instructors",
      url: "/admin/instructors",
      icon: IconChalkboardTeacher,
    },
    {
      title: "Schedule",
      url: "/admin/schedule",
      icon: IconCalendar,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: IconTicket,
    },
    {
      title: "Menu",
      url: "/admin/menu-document",
      icon: IconBlender,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={theme === "light" ? LogoGreen : LogoOrange}
                  alt="Logo Image"
                  className="size-10"
                />
                <span className="text-primary font-sans text-lg font-bold uppercase">
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
