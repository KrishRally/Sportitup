"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OwnerForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20" />
          </Link>
          <Link href="/owner/login" className="text-sm text-gray-600 hover:text-black">
            Back to Owner Login
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Reset Owner Password</CardTitle>
            </CardHeader>
            <CardContent>
              {sent ? (
                <p className="text-green-700">
                  If an account exists for {email || "your email"}, a reset link has been sent.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Owner Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Send Reset Link
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
