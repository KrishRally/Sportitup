"use client"

import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import useSWR, { mutate as globalMutate } from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const DEFAULT_SLOTS = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
]

export default function AdminAvailabilityPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [date, setDate] = useState(today)
  const { data, mutate, isLoading } = useSWR<{ date: string; slots: string[]; blocked: string[]; booked?: string[] }>(
    date ? `/api/admin/availability?date=${date}` : null,
    fetcher,
    { refreshInterval: 4000 },
  )

  const slots = useMemo(
    () => (Array.isArray(data?.slots) && data?.slots.length ? (data?.slots as string[]) : DEFAULT_SLOTS),
    [data],
  )

  async function toggle(slot: string) {
    const action = data?.blocked?.includes(slot) ? "unblock" : "block"
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, slot, action }),
    })
    mutate()
  }

  async function refresh() {
    await globalMutate(`/api/admin/availability?date=${date}`)
  }

  const blocked = new Set(data?.blocked || [])
  const booked = new Set(data?.booked || [])

  return (
    <AdminShell title="Availability">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Real-time Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="space-y-1">
              <label htmlFor="date" className="text-sm text-gray-700">
                Date
              </label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <Button variant="outline" className="border-gray-200 text-black bg-transparent" onClick={refresh}>
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {isLoading || !data
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-md border border-gray-200 animate-pulse" />
                ))
              : slots.map((s) => {
                  const isBlocked = blocked.has(s)
                  const isBooked = booked.has(s)
                  const classes = isBlocked
                    ? "border-gray-300 bg-gray-100 text-gray-600"
                    : isBooked
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  const label = isBlocked ? "Blocked" : isBooked ? "Booked" : "Available"
                  return (
                    <button
                      key={s}
                      onClick={() => (!isBooked ? toggle(s) : undefined)}
                      className={`h-16 rounded-md border flex items-center justify-center text-sm transition-colors ${classes} ${
                        isBooked ? "cursor-not-allowed" : ""
                      }`}
                      aria-disabled={isBooked}
                    >
                      {label} ({s})
                    </button>
                  )
                })}
          </div>

          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <Badge className="bg-green-100 text-green-700 border-green-200">Available</Badge>
            <Badge className="bg-red-100 text-red-700 border-red-200">Booked</Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              Blocked
            </Badge>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
