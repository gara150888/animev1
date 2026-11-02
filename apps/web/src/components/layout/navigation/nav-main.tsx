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
  const { data: isAdmin, isPending } = useQuery(trpc.home.isAdmin.queryOptions())

  if (isPending) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="#" className="cursor-not-allowed" />}>
              <span className="animate-pulse">Loading...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarMenu>

        {isAdmin && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Admin"
              isActive={pathname === "/admin"}
              render={<Link href="/admin" />}
            >
              <ShieldUser />
              <span>Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

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
