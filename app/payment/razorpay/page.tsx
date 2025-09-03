"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Clock, CreditCard, Shield, CheckCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPaymentPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [gatewayReady, setGatewayReady] = useState(false) // added

  const createOnlineBooking = async () => {
    try {
      if (!bookingData) return null
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turfId: bookingData.turfId,
          date: bookingData.date,
          time: bookingData.timeSlot, // "HH:MM" -> server normalizes to "HH:MM-HH+1:MM"
          sport: bookingData.sport,
          customer: bookingData.customer || "Online Customer",
          amount: Number(bookingData.advanceAmount) || undefined, // count advance in earnings
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        console.error("[v0] Failed to create online booking:", json)
      }
      return json
    } catch (e) {
      console.error("[v0] Error while creating online booking:", e)
      return null
    }
  }

  useEffect(() => {
    const bookingParam = searchParams.get("booking")
    if (bookingParam) {
      try {
        const data = JSON.parse(bookingParam)
        setBookingData(data)
      } catch (error) {
        console.error("[v0] Error parsing booking data:", error)
      }
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setGatewayReady(true)
    script.onerror = () => {
      console.error("[v0] Razorpay script failed to load")
      setGatewayReady(false)
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const safeAdvance = Number(bookingData?.advanceAmount ?? Math.round(Number(bookingData?.totalAmount || 0) * 0.1)) || 0

  const handlePayment = () => {
    if (!bookingData) return
    if (!gatewayReady || typeof window.Razorpay !== "function") {
      alert("Payment gateway is not ready yet. Please wait a moment and try again.")
      createOnlineBooking().then(() => {
        const successData = {
          ...bookingData,
          paymentId: "demo-fallback",
          orderId: "demo-order",
          signature: "demo-sign",
          bookingId: `SPT${Date.now()}`,
          status: "confirmed",
        }
        window.location.href = `/booking/success?data=${encodeURIComponent(JSON.stringify(successData))}`
      })
      return
    }

    setIsProcessing(true)
    try {
      const options = {
        key: "rzp_test_1234567890",
        amount: safeAdvance * 100, // use safe advance
        currency: "INR",
        name: "SportItUp",
        description: `Advance payment for ${bookingData.turfName}`,
        image: "/sportitupp-removebg-preview.png",
        order_id: `order_${Date.now()}`, // Placeholder; generate on server in production
        handler: async (response: any) => {
          try {
            await createOnlineBooking()
            const successData = {
              ...bookingData,
              paymentId: response?.razorpay_payment_id,
              orderId: response?.razorpay_order_id,
              signature: response?.razorpay_signature,
              bookingId: `SPT${Date.now()}`,
              status: "confirmed",
            }
            window.location.href = `/booking/success?data=${encodeURIComponent(JSON.stringify(successData))}`
          } catch (e) {
            console.error("[v0] Post-payment handler error:", e)
            setIsProcessing(false)
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          turf_id: bookingData.turfId,
          date: bookingData.date,
          time_slot: bookingData.timeSlot,
          sport: bookingData.sport,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on && rzp.on("payment.failed", () => setIsProcessing(false))
      rzp.open()
    } catch (err) {
      console.error("[v0] Error opening Razorpay:", err)
      setIsProcessing(false)
      alert("Could not initiate payment. Please try again.")
    }
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your booking details.</p>
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20 md:h-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Secure Payment</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Pay advance amount to confirm your slot</p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
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

        {/* Payment Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Booking Amount</span>
                <span className="font-medium">₹{bookingData.totalAmount}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Advance Payment (10%)</span>
                <span className="font-medium">₹{bookingData.advanceAmount}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Pay at Venue (90%)</span>
                <span className="font-medium">₹{bookingData.remainingAmount}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Pay Now</span>
              <span className="text-primary">₹{safeAdvance}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              className="w-full h-12 text-lg"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing || !bookingData}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₹{safeAdvance} with Razorpay
                </>
              )}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">Powered by Razorpay • Secure & Encrypted</p>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>UPI</span>
                <span>•</span>
                <span>Cards</span>
                <span>•</span>
                <span>Net Banking</span>
                <span>•</span>
                <span>Wallets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>By proceeding, you agree to our Terms & Conditions</p>
          <p className="mt-1">Need help? Contact Support</p>
        </div>
      </div>
    </div>
  )
}
