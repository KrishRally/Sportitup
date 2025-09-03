import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store, type Booking } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = c.get("owner-auth")?.value
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

export async function GET() {
  try {
    const ownerId = requireOwnerId()
    const list = store.bookings.filter((b) => b.ownerId === ownerId)
    return NextResponse.json({ bookings: list })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const ownerId = requireOwnerId()
    const body = await req.json()
    const { date, time, sport, customer, amount } = body || {}
    if (!date || !time || !sport || !customer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const id = `b_${Date.now().toString(36)}`
    const booking: Booking = {
      id,
      ownerId,
      date,
      time,
      sport,
      customer,
      status: "active",
      amount: typeof amount === "number" ? amount : undefined,
      source: "admin", //
    }
    store.bookings.push(booking)
    return NextResponse.json({ ok: true, booking })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
