"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

const getVenueCountBySport = (locationId: string, sport: string | null) => {
  if (!sport) {
    // Return total venues if no sport selected
    return locationId === "amritsar" ? 5 : 2
  }

  if (sport === "cricket") {
    return locationId === "amritsar" ? 3 : 1 // Amritsar: Super Six, theturfplay, Pavilion | Patiala: Box cricket
  } else if (sport === "pickleball") {
    return locationId === "amritsar" ? 2 : 1 // Amritsar: Pickleup, Pavilion | Patiala: Pickeball Patiala
  } else if (sport === "football") {
    return 0 // No football venues currently available
  }

  return 0
}

const locations = [
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    sports: ["Cricket", "Football", "Pickleball"],
    image: "/amritsar-sports-complex-golden-temple-city.png",
    popular: true,
  },
  {
    id: "patiala",
    name: "Patiala",
    state: "Punjab",
    sports: ["Cricket", "Football", "Pickleball"],
    image: "/patiala-sports-facilities-punjab-heritage-city.png",
    popular: true,
  },
]

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const sport = searchParams.get("sport")
    if (sport) {
      setSelectedSport(sport)
    }
  }, [])

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId)
    const sportParam = selectedSport ? `?sport=${selectedSport}` : ""
    setTimeout(() => {
      window.location.href = `/turfs/${locationId}${sportParam}`
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20" />
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Welcome back!</span>
            <Button variant="ghost" size="sm" className="text-black hover:bg-green-50">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Choose Your Location</h1>
          {selectedSport && (
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 capitalize">
              Looking for {selectedSport} venues
            </Badge>
          )}
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select your city to discover amazing sports venues and book your favorite turfs
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for your city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200"
            />
          </div>
        </div>

        {/* Available Locations */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <h2 className="text-2xl font-semibold text-black">Available Cities</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Punjab
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {filteredLocations.map((location) => {
              const venueCount = getVenueCountBySport(location.id, selectedSport)

              return (
                <Card
                  key={location.id}
                  className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300 ${
                    selectedLocation === location.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => handleLocationSelect(location.id)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={location.image || "/placeholder.svg"}
                      alt={`${location.name} sports venues`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 text-white">Available</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-black">{location.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {location.state}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{venueCount}</div>
                        <div className="text-xs text-gray-500">
                          {selectedSport ? `${selectedSport} venues` : "Venues"}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {location.sports.map((sport, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-200">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className={`w-full transition-colors ${
                        selectedLocation === location.id
                          ? "bg-green-600 text-white"
                          : "border-gray-200 text-black hover:bg-green-600 hover:text-white"
                      }`}
                      variant={selectedLocation === location.id ? "default" : "outline"}
                    >
                      {selectedLocation === location.id ? "Selected" : "Select Location"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* No Results */}
        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">No locations found</h3>
            <p className="text-gray-600">
              We couldn't find any cities matching "{searchTerm}". Currently available in Amritsar and Patiala.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
