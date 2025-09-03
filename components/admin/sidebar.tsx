"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems } from "./nav-items"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 border-r border-gray-200 bg-white">
      <div className="flex h-screen flex-col">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-gray-200">
          <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-16" />
          <span className="font-semibold text-black">Owner Admin</span>
        </div>
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-green-50 text-green-700 border border-green-200" : "text-gray-700 hover:bg-gray-100",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-green-700" : "text-gray-500")} />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-3 border-t border-gray-200 text-xs text-gray-500">© {new Date().getFullYear()} SportItUp</div>
      </div>
    </aside>
  )
}
