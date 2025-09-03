import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const c = cookies()
  const ownerCookie = c.get("owner-auth")?.value || c.get("ownerId")?.value || c.get("owner_session")?.value

  if (!ownerCookie) {
    redirect("/owner/login")
  }
  return <>{children}</>
}
