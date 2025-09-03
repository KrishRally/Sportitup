// Authentication utilities for SportItUp
import { cookies } from 'next/headers'
import { store } from './store'

export function requireUserId() {
  const c = cookies()
  const userSession = c.get('user-session')?.value
  const userId = c.get('user-id')?.value
  
  if (!userSession || !userId) {
    throw new Error('Authentication required')
  }
  
  // Verify user exists and session is valid
  const user = store.users.find(u => u.id === userId && u.firebaseUid === userSession)
  if (!user) {
    throw new Error('Invalid session')
  }
  
  return user
}

export function getCurrentUser() {
  try {
    return requireUserId()
  } catch {
    return null
  }
}

export function requireOwnerId() {
  const c = cookies()
  const ownerId = c.get("owner-auth")?.value
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}