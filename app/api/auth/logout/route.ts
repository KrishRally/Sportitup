import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const c = cookies()
    
    // Clear all auth cookies
    c.delete('user-session')
    c.delete('user-id')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}