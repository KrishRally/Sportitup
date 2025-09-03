import { NextResponse } from "next/server"
import { store, turfOwners } from "@/lib/store"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const turfId = searchParams.get("turfId")
  const date = searchParams.get("date")
  if (!turfId || !date) return NextResponse.json({ error: "Missing params" }, { status: 400 })

  const ownerId = turfOwners[turfId] || "owner-1"

  // collect blocked slots from manual blocks
  const blockedFromBlocks = store.blocks.filter((b) => b.ownerId === ownerId && b.date === date).map((b) => b.slot)

  // also block any active bookings
  const blockedFromBookings = store.bookings
    .filter((b) => b.ownerId === ownerId && b.date === date && b.status === "active")
    .map((b) => b.time)

  // collapse to unique set
  const blocked = Array.from(new Set([...blockedFromBlocks, ...blockedFromBookings]))

  // Additionally provide hours (HH:MM) to make UI matching easy
  const blockedHours = blocked.map((range) => (range.includes("-") ? range.split("-")[0] : range))

  return NextResponse.json({ date, blocked, blockedHours })
}
