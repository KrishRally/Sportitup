"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import NotificationsCenter from "@/components/admin/notifications-center"

export function AdminTopbar({ title }: { title?: string }) {
  const router = useRouter()
  async function handleLogout() {
    await fetch("/api/owner/logout", { method: "POST" })
    router.replace("/owner/login")
  }
  return (
    <header className="h-16 sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="h-full container mx-auto px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200">
            <Menu className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Open menu</span>
          </button>
          <Image
            src="/sportitupp-removebg-preview.png"
            alt="Sportitup"
            width={400}
            height={120}
            className="h-16 w-auto md:h-16"
            priority
          />
          <h1 className="text-lg md:text-xl font-semibold text-black">{title || "Dashboard"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsCenter />
          <Button variant="outline" className="border-gray-200 text-black bg-transparent" asChild>
            <Link href="/">View Site</Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>
            Owner Profile
          </Button>
          <Button className="bg-gray-100 text-black" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
