import type React from "react"
import { LayoutDashboard, CalendarClock, BarChart3, CalendarRange } from "lucide-react"

export type AdminNavItem = {
  title: string
  href: string
  icon: React.ComponentType<any>
}

export const adminNavItems: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarClock },
  { title: "Availability", href: "/admin/availability", icon: CalendarRange },
  { title: "Stats", href: "/admin/stats", icon: BarChart3 },
]
