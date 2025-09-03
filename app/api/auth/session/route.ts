import { NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const c = cookies()
    const userSession = c.get('user-session')?.value
    const userId = c.get('user-id')?.value

    if (!userSession || !userId) {
      return NextResponse.json({ user: null })
    }

    // Find user in store
    const user = store.users.find(u => u.id === userId && u.firebaseUid === userSession)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ user: null })
  }
}