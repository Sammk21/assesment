"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, Users, LogOut, User, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/${user.role}/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: "Tasks",
        href: `/${user.role}/tasks`,
        icon: CheckSquare,
      },
    ]

    if (user.role === "manager" || user.role === "admin") {
      baseItems.push({
        title: "Users",
        href: `/${user.role}/users`,
        icon: Users,
      })
    }

    if (user.role === "admin") {
      baseItems.push({
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      })
    }

    baseItems.push({
      title: "Profile",
      href: "/profile",
      icon: User,
    })

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b px-4">
        <h1 className="text-xl font-bold">Task Manager</h1>
      </div>

      <div className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-gray-200 dark:bg-gray-800")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </div>

      <div className="border-t p-4">
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="capitalize">{user.role}</p>
        </div>
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
