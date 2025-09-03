"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Clock, ArrowLeft, CalendarIcon, CreditCard } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import useSWR from "swr" // bring SWR to booking page for live availability

const turfData = {
  "super-six-turf": {
    name: "Super Six Turf",
    location: "Suncity, Batala Road, Amritsar",
    rating: 4.8,
    reviews: 156,
    sports: ["Cricket"],
    pricePerHour: 1000,
    image: "/cricket-ground-amritsar-nets-practice.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    city: "amritsar",
  },
  theturfplay: {
    name: "theturfplay",
    location: "Loharka Road, Amritsar",
    rating: 4.7,
    reviews: 89,
    sports: ["Cricket"],
    pricePerHour: 1200,
    image: "/cricket-ground-amritsar-nets-practice.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    city: "amritsar",
  },
  "the-pavilion-amritsar-cricket": {
    name: "The Pavilion Amritsar",
    location: "Loharka Road, Amritsar",
    rating: 4.9,
    reviews: 234,
    sports: ["Cricket"],
    pricePerHour: 1200,
    image: "/cricket-ground-amritsar-nets-practice.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:59 PM",
    city: "amritsar",
  },
  "pickleup-amritsar": {
    name: "Pickleup Amritsar",
    location: "Lumsden Club, Amritsar",
    rating: 4.6,
    reviews: 67,
    sports: ["Pickleball"],
    pricePerHour: 600,
    courts: 2,
    image: "/pickleball-court-amritsar-indoor-modern.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    city: "amritsar",
  },
  "the-pavilion-amritsar-pickleball": {
    name: "The Pavilion Amritsar",
    location: "Loharka Road, Amritsar",
    rating: 4.8,
    reviews: 145,
    sports: ["Pickleball"],
    pricePerHour: 1000,
    courts: 2,
    image: "/pickleball-court-amritsar-indoor-modern.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:59 PM",
    city: "amritsar",
  },
  "box-cricket-patiala": {
    name: "Box cricket Patiala",
    location: "Sheesh Mahal Enclave, Patiala",
    rating: 4.5,
    reviews: 134,
    sports: ["Cricket"],
    pricePerHour: 1000,
    image: "/sports-complex-patiala-multi-sport-facilities.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    city: "patiala",
  },
  "pickeball-patiala": {
    name: "Pickeball Patiala",
    location: "Leela Bhawan, Patiala",
    rating: 4.4,
    reviews: 45,
    sports: ["Pickleball"],
    pricePerHour: 600,
    courts: 1,
    image: "/pickleball-academy-patiala-coaching-courts.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "10:00 AM",
    closeTime: "10:00 PM",
    city: "patiala",
  },
}

const generateTimeSlots = (openTime: string, closeTime: string) => {
  const slots = []
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(" ")
    let [hours, minutes] = time.split(":").map(Number)
    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0
    return hours
  }

  const openHour = parseTime(openTime)
  const closeHour = parseTime(closeTime)

  for (let hour = openHour; hour < closeHour; hour++) {
    const time24 = hour.toString().padStart(2, "0") + ":00"
    const time12 =
      hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`

    slots.push({
      time: time24,
      label: time12,
      available: true, // Made all slots available by default
      peak: hour >= 16 && hour < 22, // 4 PM to 10 PM peak hours
    })
  }

  return slots
}

export default function BookingPage() {
  const params = useParams()
  const turfId = params.turfId as string
  const turf = turfData[turfId as keyof typeof turfData]

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [selectedSport, setSelectedSport] = useState("")

  useEffect(() => {
    if (turf?.sports?.length === 1 && !selectedSport) {
      setSelectedSport(turf.sports[0] as string)
    }
  }, [turf, selectedSport])

  const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
  const { data: avail, isLoading: availLoading } = useSWR(
    selectedDate ? `/api/public/availability?turfId=${turfId}&date=${dateKey}` : null,
    (url: string) => fetch(url).then((r) => r.json()),
    { refreshInterval: 4000 },
  )

  if (!turf) {
    return <div>Turf not found</div>
  }

  const timeSlots = generateTimeSlots(turf.openTime, turf.closeTime)
  const blockedHours = new Set<string>(avail?.blockedHours || [])

  const getCurrentPrice = () => {
    return turf.pricePerHour
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    if (blockedHours.has(timeSlot)) return // prevent selecting blocked
    setSelectedTimeSlot(timeSlot)
  }

  const handleProceedToPayment = () => {
    const needsSportSelection = turf.sports.length > 1 && !selectedSport
    if (!selectedTimeSlot || !selectedDate || needsSportSelection) {
      alert("Please select date, time slot, and sport before proceeding")
      return
    }

    const totalAmount = getCurrentPrice()
    const advanceAmount = Math.round(totalAmount * 0.1) // 10% advance
    const remainingAmount = totalAmount - advanceAmount

    const bookingData = {
      turfId,
      turfName: turf.name,
      location: turf.location,
      date: selectedDate.toISOString().split("T")[0],
      timeSlot: selectedTimeSlot,
      sport: selectedSport || turf.sports[0],
      totalAmount,
      advanceAmount,
      remainingAmount,
      courts: turf.courts || 1,
    }

    const queryParams = new URLSearchParams({
      booking: JSON.stringify(bookingData),
    }).toString()

    window.location.href = `/payment/razorpay?${queryParams}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/turfs/${turf.city}`} className="flex items-center space-x-2 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Venues</span>
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Welcome back!</span>
            <Button variant="ghost" size="sm" className="text-black hover:bg-green-50">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venue Info */}
          <div className="lg:col-span-2">
            <Card className="mb-6 border-gray-200">
              <div className="flex">
                <div className="relative w-48 h-32 overflow-hidden rounded-l-lg">
                  <img src={turf.image || "/placeholder.svg"} alt={turf.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1 text-black">{turf.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {turf.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-black">{turf.rating}</span>
                      <span className="text-gray-600 text-sm">({turf.reviews})</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {turf.sports.map((sport, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {turf.openTime} - {turf.closeTime}
                    </div>
                    <div className="text-green-600 font-medium">₹{turf.pricePerHour}/hr</div>
                    {turf.courts && turf.courts > 1 && <div>{turf.courts} courts available</div>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Form */}
            <div className="space-y-6">
              {/* Sport Selection */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Select Sport</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder={turf.sports.length === 1 ? turf.sports[0] : "Choose your sport"} />
                    </SelectTrigger>
                    <SelectContent>
                      {turf.sports.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport} - ₹{turf.pricePerHour}/hr
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {turf.sports.length > 1 && !selectedSport && (
                    <p className="mt-2 text-xs text-gray-500">Please choose a sport to continue.</p>
                  )}
                </CardContent>
              </Card>

              {/* Date Selection */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-black">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    className="rounded-md border border-gray-200"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-black">
                    <Clock className="w-5 h-5 text-green-600" />
                    Available Time Slots (1 Hour Each)
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {selectedDate ? `Slots for ${selectedDate.toDateString()}` : "Please select a date first"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const disabled = blockedHours.has(slot.time)
                      const isSelected = selectedTimeSlot === slot.time
                      return (
                        <Button
                          key={slot.time}
                          variant={isSelected ? "default" : "outline"}
                          className={`relative h-16 flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                          } ${slot.peak ? "border-orange-200 hover:border-orange-300" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => handleTimeSlotSelect(slot.time)}
                          disabled={disabled}
                        >
                          <span className="font-medium">{slot.label}</span>
                          <span className="text-xs text-gray-600">₹{getCurrentPrice()}</span>
                          {slot.peak && (
                            <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500">Peak</Badge>
                          )}
                          {disabled && <span className="absolute bottom-1 text-[10px] text-gray-600">Booked</span>}
                        </Button>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-gray-300 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-medium text-black">{turf.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sport:</span>
                    <span className="font-medium text-black">{selectedSport || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-black">
                      {selectedDate ? selectedDate.toDateString() : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Slot:</span>
                    <span className="font-medium text-black">
                      {selectedTimeSlot ? timeSlots.find((s) => s.time === selectedTimeSlot)?.label : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-black">1 hour</span>
                  </div>
                </div>

                {selectedTimeSlot && selectedSport && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-black">₹{getCurrentPrice()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Advance Payment (10%):</span>
                      <span className="font-medium">₹{Math.round(getCurrentPrice() * 0.1)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Pay at Venue:</span>
                      <span className="font-medium">₹{getCurrentPrice() - Math.round(getCurrentPrice() * 0.1)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={!selectedTimeSlot || !selectedDate || (turf.sports.length > 1 && !selectedSport)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ₹{selectedSport || turf.sports.length === 1 ? Math.round(getCurrentPrice() * 0.1) : 0} Advance
                  </Button>
                </div>

                <div className="text-xs text-gray-600 pt-2">
                  <p>• Pay only 10% advance online</p>
                  <p>• Remaining 90% to be paid at venue</p>
                  <p>• Booking confirmation via SMS/Email</p>
                  <p>• Cancellation allowed up to 2 hours before slot</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
