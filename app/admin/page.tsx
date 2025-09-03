"use client"

import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, IndianRupee, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <Alert className="mb-6 border-green-200">
        <AlertTitle className="text-black">Owner access coming soon</AlertTitle>
        <AlertDescription className="text-gray-600">
          Secure login and permissions will be added in the next steps. These stats are placeholders.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Bookings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-black">—</div>
            <CalendarClock className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Earnings (Today)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-black">₹ —</div>
            <IndianRupee className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Utilization</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold text-black">—%</div>
            <Activity className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Badge className="bg-green-100 text-green-700 border-green-200">Getting Started</Badge>
        <p className="mt-3 text-gray-600">
          Next we&apos;ll connect a database, add owner authentication, and wire up bookings and availability.
        </p>
      </div>
    </AdminShell>
  )
}
