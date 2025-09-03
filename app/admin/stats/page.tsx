"use client"

import { useMemo, useState } from "react"
import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts"

type Booking = {
  id: string
  date: string // "YYYY-MM-DD"
  time: string
  sport: "cricket" | "football" | "pickleball"
  customer: string
  status: "active" | "canceled"
  amount?: number
  source?: string
  turf?: string
}

type BookingsResponse = { bookings: Booking[] }

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error("Failed to load") as Error & { status?: number; info?: unknown }
    err.status = res.status
    err.info = data
    throw err
  }
  return data
}

function toDate(d: string) {
  const [y, m, day] = d.split("-").map(Number)
  return new Date(y, (m || 1) - 1, day || 1)
}

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function startOfDay(dt: Date) {
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

function addDays(dt: Date, days: number) {
  const d = new Date(dt)
  d.setDate(d.getDate() + days)
  return d
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getISOWeek(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function monthKey(d: Date) {
  return d.toLocaleString("en-US", { month: "short" }) + " " + d.getFullYear()
}

function weekdayIndex(d: Date) {
  return d.getDay() // 0..6
}

function parseStartHour(time: string) {
  const m = time?.match(/^(\d{2}):/)
  return m ? Number(m[1]) : null
}

export default function AdminStatsPage() {
  // Pull raw bookings so we can filter and aggregate client-side safely
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useSWR<BookingsResponse>("/api/admin/bookings", fetcher, { refreshInterval: 4000 })

  const bookings = bookingsData?.bookings ?? []

  // Filters
  const [sport, setSport] = useState<"all" | Booking["sport"]>("all")
  const turfOptions = useMemo(() => {
    const s = new Set<string>()
    for (const b of bookings) if (b.turf) s.add(b.turf)
    return Array.from(s)
  }, [bookings])
  const [turf, setTurf] = useState<string>("all")
  const [range, setRange] = useState<"today" | "7d" | "30d" | "custom">("7d")
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")

  const now = startOfDay(new Date())

  const [rangeStart, rangeEnd] = useMemo((): [Date, Date] => {
    if (range === "today") return [now, now]
    if (range === "7d") return [addDays(now, -6), now]
    if (range === "30d") return [addDays(now, -29), now]
    if (range === "custom" && start && end) {
      const s = startOfDay(toDate(start))
      const e = startOfDay(toDate(end))
      return [s, e]
    }
    return [addDays(now, -6), now]
  }, [range, start, end, now])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (sport !== "all" && b.sport !== sport) return false
      if (turf !== "all" && b.turf !== turf) return false
      const d = toDate(b.date)
      return d >= rangeStart && d <= rangeEnd
    })
  }, [bookings, sport, turf, rangeStart, rangeEnd])

  // Today summary
  const todayBookings = useMemo(
    () => filtered.filter((b) => sameDay(toDate(b.date), now) && b.status === "active").length,
    [filtered, now],
  )
  const todayEarnings = useMemo(
    () =>
      filtered
        .filter((b) => sameDay(toDate(b.date), now) && b.status === "active")
        .reduce((sum, b) => sum + (b.amount ?? 0), 0),
    [filtered, now],
  )

  // Build Daily (Last 7 days)
  const daily = useMemo(() => {
    const out: { key: string; bookings: number; earnings: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const day = addDays(now, -i)
      const key = `${day.getDate()}/${day.getMonth() + 1}`
      const dayBookings = filtered.filter((b) => sameDay(toDate(b.date), day) && b.status === "active")
      out.push({
        key,
        bookings: dayBookings.length,
        earnings: dayBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0),
      })
    }
    return out
  }, [filtered, now])

  // Weekly (Last 8 weeks) - bookings only
  const weekly = useMemo(() => {
    const out: { key: string; bookings: number; earnings: number }[] = []
    for (let i = 7; i >= 0; i--) {
      const weekRef = addDays(now, -i * 7)
      const wk = getISOWeek(weekRef)
      const yr = weekRef.getFullYear()
      const key = `Wk ${wk}`
      const weekStart = addDays(weekRef, -((weekRef.getDay() + 6) % 7)) // Monday
      const weekEnd = addDays(weekStart, 6)
      const wkBookings = filtered.filter((b) => {
        const d = toDate(b.date)
        return d >= weekStart && d <= weekEnd && b.status === "active"
      })
      out.push({
        key,
        bookings: wkBookings.length,
        earnings: wkBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0),
      })
    }
    return out
  }, [filtered, now])

  // Monthly (Last 6 months) - combined
  const monthly = useMemo(() => {
    const out: { key: string; bookings: number; earnings: number }[] = []
    const cur = new Date(now.getFullYear(), now.getMonth(), 1)
    for (let i = 5; i >= 0; i--) {
      const mRef = new Date(cur.getFullYear(), cur.getMonth() - i, 1)
      const mStart = new Date(mRef.getFullYear(), mRef.getMonth(), 1)
      const mEnd = new Date(mRef.getFullYear(), mRef.getMonth() + 1, 0)
      const key = monthKey(mRef)
      const mBookings = filtered.filter((b) => {
        const d = toDate(b.date)
        return d >= mStart && d <= mEnd && b.status === "active"
      })
      out.push({
        key,
        bookings: mBookings.length,
        earnings: mBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0),
      })
    }
    return out
  }, [filtered, now])

  // CSV download of filtered bookings
  function downloadCSV() {
    const rows = [
      ["Booking ID", "Date", "Time", "Sport", "Customer", "Amount", "Status", "Source", "Turf"],
      ...filtered.map((b) => [
        b.id,
        b.date,
        b.time,
        b.sport,
        b.customer,
        String(b.amount ?? ""),
        b.status,
        b.source ?? "",
        b.turf ?? "",
      ]),
    ]
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sportitup-report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Lightweight printable PDF via window.print
  function downloadPDF() {
    const html = `
      <html>
        <head>
          <title>Sportitup Report</title>
          <style>
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; padding: 24px; }
            h1 { margin: 0 0 8px 0; }
            h2 { margin-top: 24px; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
            th, td { border: 1px solid #e5e7eb; padding: 6px 8px; font-size: 12px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Sportitup Report</h1>
          <div>Filters: Sport=${sport}, Turf=${turf}, Range=${range}</div>
          <h2>Summary</h2>
          <div>Today Bookings: ${todayBookings}</div>
          <div>Today Earnings: ₹ ${fmtINR(todayEarnings)}</div>
          <h2>Bookings (${filtered.length})</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>Date</th><th>Time</th><th>Sport</th><th>Customer</th><th>Amount</th><th>Status</th><th>Source</th></tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                  (b) =>
                    `<tr><td>${b.id}</td><td>${b.date}</td><td>${b.time}</td><td>${b.sport}</td><td>${b.customer}</td><td>${b.amount ?? ""}</td><td>${b.status}</td><td>${b.source ?? ""}</td></tr>`,
                )
                .join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `
    const w = window.open("", "_blank")
    if (!w) return
    w.document.write(html)
    w.document.close()
  }

  // Payouts and insights
  const ownerEarnings = useMemo(
    () => filtered.filter((b) => b.status === "active").reduce((sum, b) => sum + (b.amount ?? 0), 0),
    [filtered],
  )

  const insight = useMemo(() => {
    if (filtered.length === 0) return "Not enough data yet."
    const dayCounts = new Array(7).fill(0)
    const hourCounts: Record<string, number> = {}
    for (const b of filtered) {
      const d = toDate(b.date)
      dayCounts[weekdayIndex(d)]++
      const h = parseStartHour(b.time)
      if (h != null) {
        const bucket = `${String(h).padStart(2, "0")}-${String(h + 3).padStart(2, "0")}`
        hourCounts[bucket] = (hourCounts[bucket] || 0) + 1
      }
    }
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const topDayIdx = dayCounts.indexOf(Math.max(...dayCounts))
    const topWindow = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "17-20"
    return `Your bookings are highest on ${days[topDayIdx]} between ${topWindow.replace("-", ":00–")}:00.`
  }, [filtered])

  return (
    <AdminShell title="Stats & Earnings">
      {/* Filters */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sport</label>
              <select
                className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                value={sport}
                onChange={(e) => setSport(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="pickleball">Pickleball</option>
              </select>
            </div>
            {turfOptions.length > 0 && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Turf</label>
                <select
                  className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm capitalize"
                  value={turf}
                  onChange={(e) => setTurf(e.target.value)}
                >
                  <option value="all">All</option>
                  {turfOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date Range</label>
              <select
                className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                value={range}
                onChange={(e) => setRange(e.target.value as any)}
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start</label>
              <input
                type="date"
                className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                disabled={range !== "custom"}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">End</label>
                <input
                  type="date"
                  className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  disabled={range !== "custom"}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white">
                  Download Report (CSV)
                </Button>
                <Button onClick={downloadPDF} className="ml-3 bg-gray-800 hover:bg-black text-white">
                  Download Report (PDF)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout summary */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Owner Earnings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-black">₹ {fmtINR(ownerEarnings)}</div>
            <Badge className="bg-green-600 text-white">Earnings</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Bookings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-black">{isLoading ? "—" : todayBookings}</div>
            <Badge className="bg-green-100 text-green-700 border-green-200">Daily</Badge>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Earnings (Today)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-black">{isLoading ? "₹ —" : `₹ ${fmtINR(todayEarnings)}`}</div>
            <Badge className="bg-green-100 text-green-700 border-green-200">INR</Badge>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Status</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            {isLoading ? "Loading..." : error ? "Showing cached/empty data." : "Up to date."}
          </CardContent>
        </Card>
      </div>

      {/* Daily (line: bookings & earnings) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Daily (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-md bg-gray-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="key" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    name="Bookings"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    name="Earnings (₹)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Weekly (bar: bookings) */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Weekly (Last 8 Weeks)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-md bg-gray-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="key" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="bookings" name="Bookings" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly (combined line + bar) */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Monthly (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading ? (
              <div className="h-full w-full animate-pulse rounded-md bg-gray-100" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="key" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" name="Bookings" fill="#16a34a" />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    name="Earnings (₹)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simple insight */}
      <div className="mt-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">{insight}</CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
