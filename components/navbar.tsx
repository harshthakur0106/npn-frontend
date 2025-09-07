"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User } from "lucide-react"

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Live
          </Badge>
          <span className="text-sm text-foreground">Banking Marketing Platform</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
