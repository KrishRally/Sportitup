"use client"

import type { ReactNode } from "react"
import { AdminSidebar } from "./sidebar"
import { AdminTopbar } from "./topbar"

export function AdminShell({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <AdminTopbar title={title} />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
