"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, MapPin, Calendar, Clock, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<any>(null)

  useEffect(() => {
    const dataParam = searchParams.get("data")
    if (dataParam) {
      try {
        const data = JSON.parse(dataParam)
        setBookingData(data)
      } catch (error) {
        console.error("Error parsing booking data:", error)
      }
    }
  }, [searchParams])

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your booking details.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SportItUp</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your slot has been successfully booked</p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Confirmed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono font-medium text-lg">{bookingData.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{bookingData.turfName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </p>
                  <p className="font-medium">{bookingData.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <Badge variant="outline">{bookingData.sport}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-mono text-sm">{bookingData.paymentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </p>
                  <p className="font-medium">{formatDate(bookingData.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time Slot
                  </p>
                  <p className="font-medium">
                    {formatTime(bookingData.timeSlot)} -{" "}
                    {formatTime(
                      (Number.parseInt(bookingData.timeSlot.split(":")[0]) + 1).toString().padStart(2, "0") + ":00",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">1 Hour</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">₹{bookingData.totalAmount}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Paid Online (10%)</span>
              <span className="font-medium">₹{bookingData.advanceAmount}</span>
            </div>
            <div className="flex justify-between text-orange-600">
              <span>Pay at Venue (90%)</span>
              <span className="font-medium">₹{bookingData.remainingAmount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Important Instructions */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Important Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-orange-700">
            <p>• Please arrive 10 minutes before your slot time</p>
            <p>• Carry this booking confirmation (screenshot or print)</p>
            <p>• Pay remaining ₹{bookingData.remainingAmount} at the venue</p>
            <p>• Cancellation allowed up to 2 hours before slot</p>
            <p>• Contact venue directly for any queries</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button variant="outline" className="h-12 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="h-12 bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Share Booking
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/locations">
            <Button variant="outline" className="w-full h-12 bg-transparent">
              Book Another Slot
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full h-12">Back to Home</Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help with your booking?</p>
          <p className="mt-1">
            Call us at <span className="font-medium text-primary">+91 98765 43210</span> or
            <Link href="/support" className="text-primary hover:underline ml-1">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
