import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = c.get("owner-auth")?.value
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const ownerId = requireOwnerId()
    const idx = store.bookings.findIndex((b) => b.id === params.id && b.ownerId === ownerId)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await req.json().catch(() => ({}))
    const allowed = ["date", "time", "sport", "customer", "status", "amount"] as const
    for (const key of allowed) {
      if (key in body && body[key as keyof typeof body] !== undefined) {
        // @ts-expect-error index update on union type
        store.bookings[idx][key] = body[key]
      }
    }
    return NextResponse.json({ ok: true, booking: store.bookings[idx] })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ownerId = requireOwnerId()
    const idx = store.bookings.findIndex((b) => b.id === params.id && b.ownerId === ownerId)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    store.bookings[idx].status = "canceled"
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
