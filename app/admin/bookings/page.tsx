"use client"

import type React from "react"

import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSWR from "swr"
import { useMemo, useState } from "react"

type Booking = {
  id: string
  date: string
  time: string
  sport: "cricket" | "football" | "pickleball"
  customer: string
  status: "active" | "canceled"
  amount?: number
  source?: string
}

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json())

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n ?? 0)
}

export default function AdminBookingsPage() {
  const { data, mutate, isLoading } = useSWR<{ bookings: Booking[] }>("/api/admin/bookings", fetcher, {
    refreshInterval: 4000,
  })
  const [form, setForm] = useState({ date: "", time: "", sport: "cricket", customer: "", amount: "" })
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    date: string
    time: string
    sport: Booking["sport"]
    customer: string
    amount: string
    status: Booking["status"]
  }>({
    date: "",
    time: "",
    sport: "cricket",
    customer: "",
    amount: "",
    status: "active",
  })

  const [filterSport, setFilterSport] = useState<"all" | Booking["sport"]>("all")
  const [filterTime, setFilterTime] = useState<string>("")
  const [search, setSearch] = useState<string>("")

  async function addBooking(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        time: form.time,
        sport: form.sport,
        customer: form.customer,
        amount: form.amount ? Number(form.amount) : undefined,
      }),
      credentials: "include",
    })
    setSubmitting(false)
    setForm({ date: "", time: "", sport: "cricket", customer: "", amount: "" })
    mutate()
  }

  function startEdit(b: Booking) {
    setEditingId(b.id)
    setEditForm({
      date: b.date,
      time: b.time,
      sport: b.sport,
      customer: b.customer,
      amount: b.amount != null ? String(b.amount) : "",
      status: b.status,
    })
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    await fetch(`/api/admin/bookings/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: editForm.date,
        time: editForm.time,
        sport: editForm.sport,
        customer: editForm.customer,
        amount: editForm.amount ? Number(editForm.amount) : undefined,
        status: editForm.status,
      }),
      credentials: "include",
    })
    setEditingId(null)
    await mutate()
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function cancelBooking(id: string) {
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE", credentials: "include" })
    mutate()
  }

  const bookings = data?.bookings || []

  const view = useMemo(() => {
    return bookings.filter((b) => {
      if (filterSport !== "all" && b.sport !== filterSport) return false
      if (filterTime && !b.time.toLowerCase().includes(filterTime.toLowerCase())) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = [b.id, b.customer, b.date, b.time, b.sport, b.amount ?? ""].join(" ").toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [bookings, filterSport, filterTime, search])

  return (
    <AdminShell title="Bookings">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Booking */}
          <form onSubmit={addBooking} className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                placeholder="06:00-07:00"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sport">Sport</Label>
              <select
                id="sport"
                className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                value={form.sport}
                onChange={(e) => setForm((f) => ({ ...f, sport: e.target.value as any }))}
              >
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="pickleball">Pickleball</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={form.customer}
                onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="amount">Amount Paid in Advance (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={submitting}>
                {submitting ? "Adding..." : "Add Booking"}
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-sm text-gray-700">Sport</Label>
              <select
                className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="pickleball">Pickleball</option>
              </select>
            </div>
            <div>
              <Label className="text-sm text-gray-700">Time</Label>
              <Input placeholder="e.g. 18:00" value={filterTime} onChange={(e) => setFilterTime(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-700">Search</Label>
              <Input
                placeholder="Search by ID, customer, date, time…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {editingId && (
            <form
              onSubmit={saveEdit}
              className="grid grid-cols-1 md:grid-cols-7 gap-3 border border-gray-200 p-3 rounded-md"
            >
              <div className="md:col-span-7 text-sm text-gray-700">
                Editing Booking: <span className="font-mono">{editingId}</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  placeholder="06:00-07:00"
                  value={editForm.time}
                  onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-sport">Sport</Label>
                <select
                  id="edit-sport"
                  className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                  value={editForm.sport}
                  onChange={(e) => setEditForm((f) => ({ ...f, sport: e.target.value as Booking["sport"] }))}
                >
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="pickleball">Pickleball</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-customer">Customer</Label>
                <Input
                  id="edit-customer"
                  value={editForm.customer}
                  onChange={(e) => setEditForm((f) => ({ ...f, customer: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-amount">Amount Paid in Advance (₹)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  className="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as Booking["status"] }))}
                >
                  <option value="active">Active</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-200 text-black bg-transparent"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount Paid in Advance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : view.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                view.map((b) => {
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.id}</TableCell>
                      <TableCell>{b.date}</TableCell>
                      <TableCell>{b.time}</TableCell>
                      <TableCell className="capitalize">{b.sport}</TableCell>
                      <TableCell>{b.customer}</TableCell>
                      <TableCell>₹ {fmtINR(b.amount ?? 0)}</TableCell>
                      <TableCell className={b.status === "active" ? "text-green-700" : "text-gray-500"}>
                        {b.status}
                      </TableCell>
                      <TableCell>{b.source || "admin"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-black bg-transparent"
                          onClick={() => startEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelBooking(b.id)}
                          disabled={b.status !== "active"}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  )
}
