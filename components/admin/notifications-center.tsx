"use client"

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type Booking = {
  id: string
  paymentStatus?: string
  source?: string
  date: string
  time: string
  sport?: string
  status?: string
}

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json())

export default function NotificationsCenter() {
  const { data } = useSWR<{ bookings: Booking[] }>("/api/admin/bookings", fetcher, { refreshInterval: 4000 })
  const bookings = Array.isArray(data?.bookings) ? data!.bookings : []
  const prev = useRef<Map<string, Booking>>(new Map())
  const [items, setItems] = useState<string[]>([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const cur = new Map(bookings.map((b) => [b.id, b]))
    // new or status changes
    for (const [id, b] of cur) {
      if (!prev.current.has(id)) {
        setItems((arr) =>
          [`New booking ${b.sport || ""} ${b.date} ${b.time} (${b.source || "online"})`, ...arr].slice(0, 20),
        )
        setUnread((u) => u + 1)
      } else {
        const before = prev.current.get(id)!
        if (before.status !== b.status) {
          setItems((arr) => [`Booking ${b.status} for ${b.date} ${b.time}`, ...arr].slice(0, 20))
          setUnread((u) => u + 1)
        }
      }
    }
    // cancellations (removed)
    for (const [id] of prev.current) {
      if (!cur.has(id)) {
        setItems((arr) => [`Booking cancelled (${id})`, ...arr].slice(0, 20))
        setUnread((u) => u + 1)
      }
    }
    prev.current = cur
  }, [bookings])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 py-0 text-[10px] bg-red-600 text-white">{unread}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          <Button size="sm" variant="outline" onClick={() => setUnread(0)}>
            Mark all read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <DropdownMenuItem className="text-muted-foreground">No notifications</DropdownMenuItem>
        ) : (
          items.map((t, i) => (
            <DropdownMenuItem key={i} className="whitespace-normal leading-snug">
              {t}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
