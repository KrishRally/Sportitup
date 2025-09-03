import { NextResponse } from 'next/server'
import { store, type User } from '@/lib/store'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firebaseUid, name, phone } = body

    if (!firebaseUid || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    let user = store.users.find(u => u.firebaseUid === firebaseUid || u.phone === phone)

    if (!user) {
      // Create new user
      user = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        firebaseUid,
        name: name || 'User',
        phone,
        isVerified: true,
        createdAt: new Date().toISOString(),
      }
      store.users.push(user)
    } else {
      // Update existing user
      user.firebaseUid = firebaseUid
      user.isVerified = true
      if (name) user.name = name
    }

    // Set session cookie
    const c = cookies()
    const sessionId = firebaseUid
    const maxAge = 60 * 60 * 24 * 30 // 30 days

    c.set('user-session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge,
    })

    c.set('user-id', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}