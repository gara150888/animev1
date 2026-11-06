'use client'

import { Fragment } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BellIcon, SearchIcon } from "lucide-react"
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import type { AppRoute } from "@/lib/routes"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const routeLabels: Record<string, string> = {
  home: "Home",
  dashboard: "Dashboard",
  subscriptions: "Subscriptions",
  renewals: "Upcoming renewals",
  analytics: "Analytics",
  settings: "Settings",
  admin: "Admin",
  content: "Content",
  users: "Users",
  roles: "Roles",
  seasons: "Seasons",
  episodes: "Episodes",
  sources: "Sources",
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const humanize = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const segments = pathname.split("/").filter(Boolean)

  const crumbs = segments.map((segment, index) => ({
    label: UUID_RE.test(segment) ? "Details" : routeLabels[segment] ?? humanize(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
    isLast: index === segments.length - 1,
    isIdentifier: UUID_RE.test(segment),
  }))

  const searchSubscriptions = (value: string) => {
    const term = value.trim()
    router.push((term ? `/subscriptions?q=${encodeURIComponent(term)}` : "/subscriptions") as any)
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-1 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink render={<Link href="/home" />}>
                      Zlo
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {crumbs.map((crumb) => (
                    <Fragment key={crumb.href}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {crumb.isLast || crumb.isIdentifier ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link href={crumb.href as AppRoute} />}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="ml-auto flex items-center gap-2 px-3">
              <form
                className="relative hidden sm:block"
                onSubmit={(event) => {
                  event.preventDefault()
                  const input = event.currentTarget.elements.namedItem(
                    "subscription-search",
                  ) as HTMLInputElement | null
                  searchSubscriptions(input?.value ?? "")
                }}
              >
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="subscription-search"
                  type="search"
                  placeholder="Search subscriptions"
                  aria-label="Search subscriptions"
                  className="h-8 w-44 pl-8 lg:w-56"
                />
              </form>
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href="/settings" />}
                aria-label="Notification preferences"
              >
                <BellIcon />
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
