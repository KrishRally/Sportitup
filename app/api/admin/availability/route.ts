import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = c.get("owner-auth")?.value
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

const DEFAULT_SLOTS = Array.from({ length: 8 }, (_, i) => `slot-${i + 1}`)

export async function GET(req: Request) {
  try {
    const ownerId = requireOwnerId()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 })
    const blocked = store.blocks.filter((b) => b.ownerId === ownerId && b.date === date).map((b) => b.slot)
    return NextResponse.json({ date, slots: DEFAULT_SLOTS, blocked })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const ownerId = requireOwnerId()
    const body = await req.json()
    const { date, slot, action } = body || {}
    if (!date || !slot) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    if (action === "block") {
      const exists = store.blocks.find((b) => b.ownerId === ownerId && b.date === date && b.slot === slot)
      if (!exists) store.blocks.push({ ownerId, date, slot })
    } else if (action === "unblock") {
      const idx = store.blocks.findIndex((b) => b.ownerId === ownerId && b.date === date && b.slot === slot)
      if (idx > -1) store.blocks.splice(idx, 1)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
