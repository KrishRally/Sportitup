// Firebase configuration for SportItUp OTP authentication
import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'

const firebaseConfig = {
  apiKey: typeof window !== 'undefined' ? (window as any).VITE_FIREBASE_API_KEY : '',
  authDomain: `${typeof window !== 'undefined' ? (window as any).VITE_FIREBASE_PROJECT_ID : ''}.firebaseapp.com`,
  projectId: typeof window !== 'undefined' ? (window as any).VITE_FIREBASE_PROJECT_ID : '',
  storageBucket: `${typeof window !== 'undefined' ? (window as any).VITE_FIREBASE_PROJECT_ID : ''}.firebasestorage.app`,
  appId: typeof window !== 'undefined' ? (window as any).VITE_FIREBASE_APP_ID : '',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Helper function to format phone number for Firebase
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Add +91 prefix for Indian numbers if not present
  if (cleaned.length === 10) {
    return `+91${cleaned}`
  }
  
  // If already has country code
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`
  }
  
  // If already formatted correctly
  if (phone.startsWith('+')) {
    return phone
  }
  
  return `+91${cleaned}`
}

// Initialize reCAPTCHA verifier
export const initializeRecaptcha = (containerId: string): RecaptchaVerifier => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response: any) => {
      console.log('reCAPTCHA solved')
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired')
    }
  })
}

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber)
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier)
    return confirmationResult
  } catch (error) {
    console.error('Error sending OTP:', error)
    throw error
  }
}

// Verify OTP code
export const verifyOTP = async (confirmationResult: any, otpCode: string) => {
  try {
    const result = await confirmationResult.confirm(otpCode)
    return result.user
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

export default app