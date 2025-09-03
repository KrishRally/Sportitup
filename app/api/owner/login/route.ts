import { NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { email, password } = body || {}
  const owner = store.owners.find((o) => o.email === email && o.password === password)
  if (!owner) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true, owner: { id: owner.id, email: owner.email, name: owner.name } })
  res.cookies.set("owner-auth", owner.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
