"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Home, Mail, MessageSquare, Target, TrendingUp, Users } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Segmentation & Plan",
    href: "/plan",
    icon: Target,
  },
  {
    name: "Reflect & Improve",
    href: "/reflect",
    icon: TrendingUp,
  },
  {
    name: "Analytics",
    href: "/metrics",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Users className="h-4 w-4 text-sidebar-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Marketing AI</h1>
            <p className="text-xs text-sidebar-foreground/70">Banking Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-primary p-3">
          <p className="text-xs font-medium text-sidebar-primary-foreground">AI-Powered Marketing</p>
          <p className="text-xs text-sidebar-primary-foreground/70 mt-1">
            Enhance customer engagement with intelligent campaigns
          </p>
        </div>
      </div>
    </div>
  )
}
