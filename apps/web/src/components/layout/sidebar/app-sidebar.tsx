"use client"

import * as React from "react"

import { NavMain } from "@/components/layout/navigation/nav-main"
import { NavUser } from "@/components/layout/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  SettingsIcon
} from "lucide-react"
import Link from "next/link"

import type { AppRoute } from "@/lib/routes"

const data: {
  navMain: {
    title: string
    url: AppRoute
    icon: React.ReactNode
    items: { title: string; url: AppRoute }[]
  }[]
} = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: <LayoutDashboardIcon />,
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <SettingsIcon />,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/home" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground">
                <img
                  data-no-hover
                  data-no-focus-ring
                  src="/assets/logo_black.png"
                  alt="Zlo logo"
                  className="size-7 dark:hidden"
                />
                <img
                  data-no-hover
                  data-no-focus-ring
                  src="/assets/logo_white.png"
                  alt="Zlo logo"
                  className="size-7 hidden dark:block"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Zlo</span>
                <span className="truncate text-xs text-muted-foreground">Subscription Tracker</span>
              </div>
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
  )
}
