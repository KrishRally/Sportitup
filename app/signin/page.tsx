"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [signInMethod, setSignInMethod] = useState<"phone" | "google" | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"details" | "otp" | "success">("details")

  const handlePhoneSignIn = () => {
    if (name && phoneNumber) {
      setStep("otp")
    }
  }

  const handleOtpVerification = () => {
    if (otp.length === 6) {
      setStep("success")
      // Redirect to locations after 2 seconds
      setTimeout(() => {
        window.location.href = "/locations"
      }, 2000)
    }
  }

  const handleGoogleSignIn = () => {
    // Simulate Google sign in
    setStep("success")
    setTimeout(() => {
      window.location.href = "/locations"
    }, 2000)
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-green-200">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Welcome to SportItUp!</h2>
            <p className="text-gray-600 mb-4">Sign in successful. Redirecting you to book your venue...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black">Sign In to SportItUp</h1>
          <p className="text-gray-600">Choose your preferred sign in method</p>
        </div>

        {!signInMethod ? (
          /* Method Selection */
          <div className="space-y-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-green-300"
              onClick={() => setSignInMethod("phone")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Phone Number</h3>
                    <p className="text-sm text-gray-600">Sign in with your phone number and OTP</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-green-300"
              onClick={() => setSignInMethod("google")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Google Account</h3>
                    <p className="text-sm text-gray-600">Sign in with your Google account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : signInMethod === "phone" ? (
          /* Phone Sign In */
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-black">
                  {step === "details" ? "Enter Your Details" : "Verify OTP"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignInMethod(null)}
                  className="text-gray-600 hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === "details" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-200 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-gray-200 focus:border-green-500"
                    />
                  </div>
                  <Button
                    onClick={handlePhoneSignIn}
                    disabled={!name || !phoneNumber}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-gray-600">
                      We've sent a 6-digit OTP to
                      <br />
                      <span className="font-semibold text-black">{phoneNumber}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-black">
                      Enter OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="border-gray-200 focus:border-green-500 text-center text-lg tracking-widest"
                    />
                  </div>
                  <Button
                    onClick={handleOtpVerification}
                    disabled={otp.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Verify & Sign In
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-black"
                    onClick={() => setStep("details")}
                  >
                    Change Phone Number
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Google Sign In */
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-black">Sign In with Google</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignInMethod(null)}
                  className="text-gray-600 hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGoogleSignIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <a href="#" className="text-green-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
