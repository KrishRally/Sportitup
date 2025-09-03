// Note: In-memory data resets on redeploy/refresh. Replace with a real DB later.
// Demo Owner Login (testing only): email owner@sportitup.in / password OwN3r!2025#

export type Owner = {
  id: string
  email: string
  name: string
  // DEMO ONLY: plain password; replace with hashed passwords in DB
  password: string
}

export type User = {
  id: string
  firebaseUid?: string
  name: string
  phone: string
  isVerified: boolean
  createdAt: string
}

export type Booking = {
  id: string
  ownerId: string
  userId?: string // Link to User ID for authenticated bookings
  date: string // YYYY-MM-DD
  time: string // e.g. "06:00-07:00"
  sport: "cricket" | "football" | "pickleball"
  customer: string
  customerPhone?: string // Phone number for OTP users
  status: "active" | "canceled"
  amount?: number
  source?: "online" | "admin"
}

export type AvailabilityBlock = {
  ownerId: string
  date: string // YYYY-MM-DD
  slot: string // "slot-1"..."slot-8" or time string
}

const owners: Owner[] = [
  {
    id: "owner-1",
    email: "owner@sportitup.in",
    name: "Demo Turf Owner",
    password: "OwN3r!2025#", // DEMO ONLY - strong, non-breached
  },
]

// Map public turfIds to owners for in-memory routing (all map to demo owner for now)
export const turfOwners: Record<string, string> = {
  "super-six-turf": "owner-1",
  theturfplay: "owner-1",
  "the-pavilion-amritsar-cricket": "owner-1",
  "pickleup-amritsar": "owner-1",
  "the-pavilion-amritsar-pickleball": "owner-1",
  "box-cricket-patiala": "owner-1",
  "pickeball-patiala": "owner-1",
}

// Store data in module scope
let bookings: Booking[] = []
let blocks: AvailabilityBlock[] = []
let users: User[] = []

export const store = {
  owners,
  bookings,
  blocks,
  users,
  turfOwners,
  reset() {
    bookings = []
    blocks = []
    users = []
    this.bookings = bookings
    this.blocks = blocks
    this.users = users
  },
}
