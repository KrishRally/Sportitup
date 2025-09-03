"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    VITE_FIREBASE_API_KEY: string
    VITE_FIREBASE_PROJECT_ID: string
    VITE_FIREBASE_APP_ID: string
    firebase: any
    recaptchaVerifier: any
    confirmationResult: any
  }
}

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Firebase from CDN
    const loadFirebase = async () => {
      try {
        // Load Firebase scripts
        await loadScript('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js')
        await loadScript('https://www.gstatic.com/firebasejs/10.14.0/firebase-auth-compat.js')

        // Initialize Firebase
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
          authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project"}.firebaseapp.com`,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project",
          storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project"}.firebasestorage.app`,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
        }

        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig)
        }

        setIsFirebaseLoaded(true)
        await initializeRecaptcha()
      } catch (error) {
        console.error('Error loading Firebase:', error)
        setError('Failed to initialize. Please refresh and try again.')
      }
    }

    loadFirebase()
  }, [])

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const initializeRecaptcha = async () => {
    try {
      if (!recaptchaRef.current) return

      window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier(recaptchaRef.current, {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA solved')
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired')
        }
      })

      await sendOTP()
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error)
      setError('Failed to initialize verification. Please try again.')
    }
  }

  const sendOTP = async () => {
    try {
      if (!isFirebaseLoaded || !window.firebase || !window.recaptchaVerifier) {
        setError('Please wait for initialization to complete')
        return
      }

      const phoneNumber = phone.startsWith('+91') ? phone : `+91${phone}`
      const auth = window.firebase.auth()
      
      window.confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
      console.log('OTP sent successfully')
      
      // Start countdown
      setCountdown(30)
      setCanResend(false)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!window.confirmationResult) {
      setError('Please request OTP first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await window.confirmationResult.confirm(otp)
      const user = result.user
      
      // Get signup data from sessionStorage
      const signupData = sessionStorage.getItem('signup_data')
      const userData = signupData ? JSON.parse(signupData) : null

      // Send user data to backend
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          name: userData?.name || 'User',
          phone: phone,
        }),
      })

      if (response.ok) {
        sessionStorage.removeItem('signup_data')
        router.push('/locations')
      } else {
        throw new Error('Failed to save user data')
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.')
      } else {
        setError('Verification failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError(null)
    await sendOTP()
    setIsResending(false)
  }

  if (!phone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No phone number provided</p>
            <Link href="/signup" className="text-primary hover:underline mt-4 inline-block">
              Go back to signup
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SportItUp</span>
          </div>
          <CardTitle className="text-2xl">Verify Phone Number</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                data-testid="input-otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>
            
            <Button type="submit" data-testid="button-verify" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                Resend OTP in {countdown}s
              </p>
            ) : (
              <Button
                variant="ghost"
                data-testid="button-resend"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-primary hover:underline p-0 h-auto"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/signup" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to signup
            </Link>
          </div>
          
          {/* reCAPTCHA container */}
          <div ref={recaptchaRef} id="recaptcha-container"></div>
        </CardContent>
      </Card>
    </div>
  )
}