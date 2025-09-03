import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = c.get("owner-auth")?.value
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

type Bucket = { key: string; bookings: number; earnings: number }

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}
function startOfWeek(d: Date) {
  const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = copy.getUTCDay() || 7 // 1..7, Monday=1
  if (day !== 1) copy.setUTCDate(copy.getUTCDate() - (day - 1))
  copy.setUTCHours(0, 0, 0, 0)
  return copy
}
function monthKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
}

export async function GET() {
  try {
    const ownerId = requireOwnerId()
    const all = store.bookings.filter((b) => b.ownerId === ownerId && b.status !== "canceled")

    const todayKey = fmtDate(new Date())
    const todayList = all.filter((b) => b.date === todayKey)
    const today = {
      bookings: todayList.length,
      earnings: todayList.reduce((sum, b) => sum + (b.amount || 0), 0),
    }

    // daily: last 7 days
    const dailyKeys = Array.from({ length: 7 }).map((_, idx) => fmtDate(daysAgo(6 - idx)))
    const daily = dailyKeys.map<Bucket>((key) => {
      const dayList = all.filter((b) => b.date === key)
      return { key, bookings: dayList.length, earnings: dayList.reduce((s, b) => s + (b.amount || 0), 0) }
    })

    // weekly: last 8 weeks (by ISO-like Monday-based start)
    const weeks: string[] = []
    {
      const cur = startOfWeek(new Date())
      for (let i = 7; i >= 0; i--) {
        const w = new Date(cur)
        w.setUTCDate(cur.getUTCDate() - i * 7)
        weeks.push(fmtDate(w)) // use week start date as key
      }
    }
    const weekly = weeks.map<Bucket>((wk) => {
      const start = new Date(wk)
      const end = new Date(start)
      end.setUTCDate(start.getUTCDate() + 7)
      const list = all.filter((b) => {
        const bd = new Date(b.date)
        return bd >= start && bd < end
      })
      return { key: wk, bookings: list.length, earnings: list.reduce((s, b) => s + (b.amount || 0), 0) }
    })

    // monthly: last 6 months
    const months: string[] = []
    {
      const cur = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() - i, 1))
        months.push(monthKey(d))
      }
    }
    const monthly = months.map<Bucket>((mk) => {
      const [y, m] = mk.split("-").map((v) => Number(v))
      const start = new Date(Date.UTC(y, m - 1, 1))
      const end = new Date(Date.UTC(y, m, 1))
      const list = all.filter((b) => {
        const bd = new Date(b.date)
        return bd >= start && bd < end
      })
      return { key: mk, bookings: list.length, earnings: list.reduce((s, b) => s + (b.amount || 0), 0) }
    })

    return NextResponse.json({ today, daily, weekly, monthly })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
