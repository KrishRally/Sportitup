"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Trophy, Star, Clock, Users, Car, Wifi, Zap, Droplets, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const turfs = [
  // Amritsar Cricket Venues
  {
    id: "super-six-turf",
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
    featured: true,
    courts: 1,
  },
  {
    id: "theturfplay",
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
    featured: false,
    courts: 1,
  },
  {
    id: "the-pavilion-amritsar-cricket",
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
    featured: true,
    courts: 1,
  },
  // Amritsar Pickleball Venues
  {
    id: "pickleup-amritsar",
    name: "Pickleup Amritsar",
    location: "Lumsden Club, Amritsar",
    rating: 4.6,
    reviews: 67,
    sports: ["Pickleball"],
    pricePerHour: 600,
    image: "/pickleball-court-amritsar-indoor-modern.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    featured: true,
    courts: 2,
  },
  {
    id: "the-pavilion-amritsar-pickleball",
    name: "The Pavilion Amritsar",
    location: "Loharka Road, Amritsar",
    rating: 4.8,
    reviews: 145,
    sports: ["Pickleball"],
    pricePerHour: 1000,
    image: "/pickleball-court-amritsar-indoor-modern.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:59 PM",
    featured: false,
    courts: 2,
  },
  // Patiala Cricket Venues
  {
    id: "box-cricket-patiala",
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
    featured: true,
    courts: 1,
  },
  // Patiala Pickleball Venues
  {
    id: "pickeball-patiala",
    name: "Pickeball Patiala",
    location: "Leela Bhawan, Patiala",
    rating: 4.4,
    reviews: 45,
    sports: ["Pickleball"],
    pricePerHour: 600,
    image: "/pickleball-academy-patiala-coaching-courts.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "10:00 AM",
    closeTime: "10:00 PM",
    featured: false,
    courts: 1,
  },
]

const amenityIcons = {
  Parking: Car,
  WiFi: Wifi,
  Floodlights: Zap,
  "Changing Rooms": Users,
  AC: Droplets,
  Refreshments: Users,
  "Equipment Rental": Trophy,
  Equipment: Trophy,
  Coaching: Users,
  Cafeteria: Users,
  Washrooms: Users,
}

export default function TurfsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const location = params.location as string
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [selectedTurf, setSelectedTurf] = useState<string | null>(null)

  useEffect(() => {
    const sportParam = searchParams.get("sport")
    if (sportParam) {
      setSelectedSport(sportParam.charAt(0).toUpperCase() + sportParam.slice(1))
    }
  }, [searchParams])

  const locationName = location.charAt(0).toUpperCase() + location.slice(1)

  const locationTurfs = turfs.filter((turf) => turf.location.toLowerCase().includes(location.toLowerCase()))

  const filteredTurfs = locationTurfs.filter((turf) => {
    const matchesSearch =
      turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === "all" || turf.sports.includes(selectedSport)
    return matchesSearch && matchesSport
  })

  const sortedTurfs = [...filteredTurfs].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return a.pricePerHour - b.pricePerHour
      case "price-high":
        return b.pricePerHour - a.pricePerHour
      default:
        return 0
    }
  })

  const featuredTurfs = sortedTurfs.filter((turf) => turf.featured)
  const regularTurfs = sortedTurfs.filter((turf) => !turf.featured)

  const allSports = ["Cricket", "Football", "Pickleball"]

  const handleTurfSelect = (turfId: string) => {
    setSelectedTurf(turfId)
    setTimeout(() => {
      window.location.href = `/booking/${turfId}`
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/locations" className="flex items-center space-x-2 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Locations</span>
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
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-lg text-gray-600">{locationName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Sports Venues in {locationName}</h1>
          {selectedSport !== "all" && (
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">Showing {selectedSport} venues</Badge>
          )}
          <p className="text-gray-600 text-lg">Discover and book the best sports facilities in your area</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full md:w-48 border-gray-200">
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {allSports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 border-gray-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {featuredTurfs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-semibold text-black">Featured Venues</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Recommended
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredTurfs.map((turf) => (
                <Card
                  key={turf.id}
                  className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300 ${
                    selectedTurf === turf.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => handleTurfSelect(turf.id)}
                >
                  <div className="flex">
                    <div className="relative w-48 h-48 overflow-hidden rounded-l-lg">
                      <img
                        src={turf.image || "/placeholder.svg"}
                        alt={turf.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-green-600 text-white">Featured</Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <CardTitle className="text-xl mb-1 text-black">{turf.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {turf.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">₹{turf.pricePerHour}</div>
                          <div className="text-xs text-gray-500">per hour</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{turf.rating}</span>
                          <span className="text-gray-600 text-sm">({turf.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <Clock className="w-4 h-4" />
                          {turf.openTime} - {turf.closeTime}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {turf.sports.map((sport, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-200">
                            {sport}
                          </Badge>
                        ))}
                        {turf.courts > 1 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            {turf.courts} Courts
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {turf.amenities.slice(0, 4).map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Trophy
                          return (
                            <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                              <IconComponent className="w-3 h-3" />
                              <span>{amenity}</span>
                            </div>
                          )
                        })}
                      </div>

                      <Button
                        className={`w-full transition-colors ${
                          selectedTurf === turf.id
                            ? "bg-green-600 text-white"
                            : "border-gray-200 text-black hover:bg-green-600 hover:text-white"
                        }`}
                        variant={selectedTurf === turf.id ? "default" : "outline"}
                      >
                        {selectedTurf === turf.id ? "Selected" : "Book Now"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {regularTurfs.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-black mb-6">All Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularTurfs.map((turf) => (
                <Card
                  key={turf.id}
                  className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300 ${
                    selectedTurf === turf.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => handleTurfSelect(turf.id)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={turf.image || "/placeholder.svg"}
                      alt={turf.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-black">{turf.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {turf.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">₹{turf.pricePerHour}</div>
                        <div className="text-xs text-gray-500">per hour</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{turf.rating}</span>
                        <span className="text-gray-600 text-xs">({turf.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3 h-3" />
                        {turf.openTime} - {turf.closeTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {turf.sports.map((sport, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-200">
                          {sport}
                        </Badge>
                      ))}
                      {turf.courts > 1 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {turf.courts} Courts
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {turf.amenities.slice(0, 3).map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Trophy
                        return (
                          <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                            <IconComponent className="w-3 h-3" />
                            <span>{amenity}</span>
                          </div>
                        )
                      })}
                    </div>

                    <Button
                      className={`w-full transition-colors ${
                        selectedTurf === turf.id
                          ? "bg-green-600 text-white"
                          : "border-gray-200 text-black hover:bg-green-600 hover:text-white"
                      }`}
                      variant={selectedTurf === turf.id ? "default" : "outline"}
                    >
                      {selectedTurf === turf.id ? "Selected" : "Book Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {sortedTurfs.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all available sports.</p>
          </div>
        )}
      </div>
    </div>
  )
}
