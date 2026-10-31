"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, ShieldUser } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { AppRoute } from "@/lib/routes"
import { trpc } from "@/utils/trpc"
import { useQuery } from "@tanstack/react-query"

const isAdminJson = {
  title: "Admin",
  url: "/admin",
  icon: <ShieldUser />,
}

const isAdminComponent = (item: any, isActive: boolean) => {
  return (
    <Collapsible defaultOpen={item.isActive} render={<SidebarMenuItem />}>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isActive}
        render={<Link href={item.url} />}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </Collapsible>
  )
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: AppRoute
    icon: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: AppRoute
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { data: isAdmin } = useQuery(trpc.home.isAdmin.queryOptions())

  return (
    <SidebarGroup>
      <SidebarMenu>

        {isAdmin && isAdminComponent(isAdminJson, pathname === isAdminJson.url)}

        {items.map((item) => {
          const isActive = pathname ? (pathname === item.url || pathname.startsWith(`${item.url}/`)) : false
          return (
            <Collapsible key={item.title} defaultOpen={item.isActive} render={<SidebarMenuItem />}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                render={<Link href={item.url} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger
                    render={<SidebarMenuAction className="aria-expanded:rotate-90" />}>
                    <ChevronRightIcon />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            isActive={pathname === subItem.url}
                            render={<Link href={subItem.url} />}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </Collapsible>
          )

        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
