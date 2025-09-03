import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Target, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-24" />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#sports" className="text-gray-600 hover:text-black transition-colors">
              Sports
            </a>
            <a href="#community" className="text-gray-600 hover:text-black transition-colors">
              Community
            </a>
            {/* ensure About goes to the homepage About anchor */}
            <a href="/#about" className="text-gray-600 hover:text-black transition-colors">
              About
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-gray-200 text-black bg-transparent" asChild>
              <Link href="/owner/login">Admin Login</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-black hover:bg-green-50" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-white via-green-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <Badge className="mb-6 bg-green-100 text-green-700 border-green-200">
            🏆 Punjab's Premier Sports Booking Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-black">
            Book Your <span className="text-green-600">Sports Venue</span> with SportItUp
          </h1>
          <p className="text-xl text-gray-600 text-pretty mb-8 max-w-2xl mx-auto">
            Find and book the best cricket, football, and pickleball venues in Amritsar and Patiala. Easy booking, great
            facilities, competitive prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link href="/locations">
                Start Booking <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-gray-200 text-black hover:bg-green-50 bg-transparent"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Sports Categories */}
      <section id="sports" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Available Sports</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Book venues for your favorite sports. Quality facilities and easy online booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Cricket", icon: "🏏", description: "Professional cricket grounds and nets", slug: "cricket" },
              { name: "Football", icon: "⚽", description: "Full-size and 5-a-side football turfs", slug: "football" },
              {
                name: "Pickleball",
                icon: "🏓",
                description: "Modern pickleball courts with quality equipment",
                slug: "pickleball",
              },
            ].map((sport, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300"
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-5xl mb-4">{sport.icon}</div>
                  <CardTitle className="text-xl text-black">{sport.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{sport.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors border-gray-200 bg-transparent"
                    asChild
                  >
                    <Link href={`/locations?sport=${sport.slug}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 px-4 bg-green-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose SportItUp</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Experience hassle-free sports venue booking with quality facilities and competitive pricing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black">Easy Booking</h3>
              <p className="text-gray-600">Simple online booking system with instant confirmation</p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black">Quality Venues</h3>
              <p className="text-gray-600">Premium sports facilities with modern amenities and equipment</p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with transparent costs and no hidden fees</p>
            </div>
          </div>

          <Button size="lg" className="text-lg px-8 bg-green-600 hover:bg-green-700 text-white" asChild>
            <Link href="/locations">
              Start Booking <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-balance">About Sportitup</h2>
          <div className="space-y-4 text-gray-700 leading-7">
            <p>
              At Sportitup, we believe that playing sports should be simple, fun, and hassle-free. Our platform connects
              players with the best turfs in their city, offering easy online booking, transparent pricing, and instant
              confirmation.
            </p>
            <p>
              We currently provide access to cricket, football, and pickleball venues in Punjab, starting with Amritsar
              and Patiala, and are rapidly expanding. Whether you’re booking a friendly match or organizing a
              tournament, Sportitup ensures you get premium facilities at the best prices.
            </p>
            <p>
              Our mission is to make sports accessible to everyone and to encourage a healthier, more active lifestyle.
              With Sportitup, you don’t have to worry about endless calls or last-minute turf unavailability—everything
              is just a click away.
            </p>
            <p className="font-semibold text-black">Play more. Stress less. Sportitup.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20" />
              </div>
              <p className="text-gray-600">
                Punjab's premier sports venue booking platform for cricket, football, and pickleball.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Sports</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span>Cricket</span>
                </li>
                <li>
                  <span>Football</span>
                </li>
                <li>
                  <span>Pickleball</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Locations</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <span>Amritsar</span>
                </li>
                <li>
                  <span>Patiala</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  {/* Make Help Center plain text (non-clickable) */}
                  <span>Help Center</span>
                </li>
                <li>
                  <div className="space-y-1">
                    <p className="hover:text-black transition-colors">Contact Us:</p>
                    <p className="text-sm">📞 +91 9988993456</p>
                    <p className="text-sm">✉️ sportituporg@gmail.com</p>
                    <p className="text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919-.058 1.265-.069 1.645-.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225 1.664 4.771 4.919 4.919 1.266.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78 2.618 6.98 6.98 1.281.058 1.689.073 4.949.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.203-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      @sportitupindia
                    </p>
                  </div>
                </li>
                {/* Keep Privacy Policy and Terms as links */}
                <li>
                  <Link href="/privacy" className="hover:text-black transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-black transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 SportItUp.in. All rights reserved. Built for sports enthusiasts in Punjab.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
