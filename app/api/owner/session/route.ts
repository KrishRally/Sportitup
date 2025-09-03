import { cookies } from "next/headers"

type DemoOwner = { id: string; email: string; name: string; password: string }

// Simple demo owner. Change these when you want different creds.
const DEMO_OWNER: DemoOwner = {
  id: "owner-1",
  email: "owner@sportitup.in",
  name: "Demo Owner",
  password: "OwN3r!2025#", // strong to avoid browser breach warnings
}

function validCreds(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_OWNER.email && password === DEMO_OWNER.password
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!validCreds(email, password)) {
      return new Response(JSON.stringify({ error: "invalid_credentials" }), { status: 401 })
    }

    // Create a lightweight session token
    const sessionId = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).toString()

    // Set both a session cookie and a compat ownerId cookie so existing admin APIs continue to work.
    const c = cookies()
    const maxAge = 60 * 60 * 24 * 7 // 7 days

    c.set("owner_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge,
    })

    // Compatibility cookie for any code that expects ownerId
    c.set("ownerId", DEMO_OWNER.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge,
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400 })
  }
}

export async function DELETE() {
  const c = cookies()
  c.set("owner_session", "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 })
  c.set("ownerId", "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 })
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
