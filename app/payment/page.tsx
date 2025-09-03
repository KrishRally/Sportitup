"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { MapPin, Trophy, CreditCard, Smartphone, Wallet, Shield, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface BookingData {
  turfId: string
  date: Date
  timeSlots: string[]
  duration: number
  sport: string
  total: number
}

const turfData = {
  "sports-arena-mumbai": {
    name: "Mumbai Sports Arena",
    location: "Bandra West, Mumbai",
    image: "/mumbai-sports-arena-cricket-ground.png",
  },
}

const timeSlotLabels = {
  "06:00": "6:00 AM",
  "07:00": "7:00 AM",
  "08:00": "8:00 AM",
  "09:00": "9:00 AM",
  "10:00": "10:00 AM",
  "11:00": "11:00 AM",
  "12:00": "12:00 PM",
  "13:00": "1:00 PM",
  "14:00": "2:00 PM",
  "15:00": "3:00 PM",
  "16:00": "4:00 PM",
  "17:00": "5:00 PM",
  "18:00": "6:00 PM",
  "19:00": "7:00 PM",
  "20:00": "8:00 PM",
  "21:00": "9:00 PM",
  "22:00": "10:00 PM",
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [formData, setFormData] = useState({
    upiId: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    walletProvider: "paytm",
  })

  useEffect(() => {
    const bookingParam = searchParams.get("booking")
    if (bookingParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(bookingParam))
        setBookingData(parsed)
      } catch (error) {
        console.error("Error parsing booking data:", error)
      }
    }
  }, [searchParams])

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No booking data found</h3>
            <p className="text-muted-foreground mb-4">Please start your booking from the beginning.</p>
            <Button asChild>
              <Link href="/locations">Start Booking</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const turf = turfData[bookingData.turfId as keyof typeof turfData]
  const bookingDate = new Date(bookingData.date)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Validate form based on payment method
    if (paymentMethod === "upi" && !formData.upiId) {
      alert("Please enter your UPI ID")
      setIsProcessing(false)
      return
    }

    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        alert("Please fill all card details")
        setIsProcessing(false)
        return
      }
    }

    // Simulate payment processing
    setTimeout(() => {
      console.log("[v0] Payment processed:", {
        bookingData,
        paymentMethod,
        formData,
      })
      setIsProcessing(false)
      setPaymentSuccess(true)
    }, 3000)
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Your sports venue has been successfully booked. You'll receive a confirmation SMS and email shortly.
            </p>

            <div className="bg-card p-6 rounded-lg border mb-6 text-left">
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-mono">SPT{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span>{turf?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sport:</span>
                  <span>{bookingData.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{bookingDate.toDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slots:</span>
                  <span>
                    {bookingData.timeSlots
                      .map((slot) => timeSlotLabels[slot as keyof typeof timeSlotLabels])
                      .join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{bookingData.duration} hour(s)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Paid:</span>
                  <span>₹{bookingData.total}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/locations">Book Another Venue</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/booking/${bookingData.turfId}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Booking</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SportItUp</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Secure Payment</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Payment</h1>
                <p className="text-muted-foreground">Choose your preferred payment method and complete the booking</p>
              </div>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                      <RadioGroupItem value="upi" id="upi" />
                      <div className="flex items-center space-x-3 flex-1">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="upi" className="font-medium">
                            UPI
                          </Label>
                          <p className="text-sm text-muted-foreground">Pay using Google Pay, PhonePe, Paytm, etc.</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Instant
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                      <RadioGroupItem value="card" id="card" />
                      <div className="flex items-center space-x-3 flex-1">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="card" className="font-medium">
                            Credit/Debit Card
                          </Label>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <div className="flex items-center space-x-3 flex-1">
                        <Wallet className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="wallet" className="font-medium">
                            Digital Wallet
                          </Label>
                          <p className="text-sm text-muted-foreground">Paytm, Amazon Pay, MobiKwik</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethod === "upi" && (
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        type="text"
                        placeholder="yourname@paytm"
                        value={formData.upiId}
                        onChange={(e) => handleInputChange("upiId", e.target.value)}
                      />
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="space-y-2">
                      <Label htmlFor="walletProvider">Select Wallet</Label>
                      <RadioGroup
                        value={formData.walletProvider}
                        onValueChange={(value) => handleInputChange("walletProvider", value)}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paytm" id="paytm" />
                          <Label htmlFor="paytm">Paytm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="amazonpay" id="amazonpay" />
                          <Label htmlFor="amazonpay">Amazon Pay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobikwik" id="mobikwik" />
                          <Label htmlFor="mobikwik">MobiKwik</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Venue Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={turf?.image || "/placeholder.svg"}
                    alt={turf?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{turf?.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {turf?.location}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sport:</span>
                    <span className="font-medium">{bookingData.sport}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{bookingDate.toDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {bookingData.timeSlots
                        .map((slot) => timeSlotLabels[slot as keyof typeof timeSlotLabels])
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{bookingData.duration} hour(s)</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{bookingData.total}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ₹{bookingData.total}
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                  <p>• Instant confirmation via SMS & Email</p>
                  <p>• 100% refund on cancellation (T&C apply)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
