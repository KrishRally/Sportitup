"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function OwnerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("owner@sportitup.in")
  const [password, setPassword] = useState("OwN3r!2025#") // strong demo password
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/owner/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ensure Set-Cookie is applied
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        if (res.status === 401) setError("Password incorrect")
        else setError("Password incorrect")
        return
      }
      if (typeof window !== "undefined") {
        window.location.replace("/admin")
        return
      }
      router.replace("/admin")
    } catch (err: any) {
      setError("Password incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-36 md:h-44 w-auto" />
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            Home
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Owner Login</CardTitle>
              <CardDescription>Demo credentials are pre-filled.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="mt-3 text-center">
                  <Link href="/owner/forgot-password" className="text-sm text-green-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
