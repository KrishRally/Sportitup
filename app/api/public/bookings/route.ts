import { NextResponse } from 'next/server'
import { store, type Booking } from '@/lib/store'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { turfId, date, time, sport, customer, customerPhone, amount } = body || {}
    
    if (!turfId || !date || !time || !sport || !customer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get current authenticated user (optional for backward compatibility)
    const currentUser = getCurrentUser()

    // Map turf to owner
    const ownerId = store.turfOwners[turfId]
    if (!ownerId) {
      return NextResponse.json({ error: "Invalid turf" }, { status: 400 })
    }

    const id = `b_${Date.now().toString(36)}`
    const booking: Booking = {
      id,
      ownerId,
      userId: currentUser?.id, // Link to authenticated user if available
      date,
      time,
      sport,
      customer,
      customerPhone: customerPhone || currentUser?.phone, // Use authenticated user's phone or provided phone
      status: "active",
      amount: typeof amount === "number" ? amount : undefined,
      source: "online",
    }
    
    store.bookings.push(booking)
    
    return NextResponse.json({ 
      success: true, 
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        sport: booking.sport,
        customer: booking.customer,
        status: booking.status,
        amount: booking.amount,
      }
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Get current authenticated user
    const currentUser = getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user's bookings
    const userBookings = store.bookings.filter(booking => 
      booking.userId === currentUser.id || booking.customerPhone === currentUser.phone
    )

    return NextResponse.json({ 
      bookings: userBookings.map(booking => ({
        id: booking.id,
        date: booking.date,
        time: booking.time,
        sport: booking.sport,
        customer: booking.customer,
        status: booking.status,
        amount: booking.amount,
      }))
    })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}