import { NextResponse } from "next/server";

import { SERVER_API_BASE } from "@/lib/api";
import { ACCESS_COOKIE, ACCESS_MAX_AGE, cookieOptions, REFRESH_COOKIE, REFRESH_MAX_AGE } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}));

  if (!username || !password) {
    return NextResponse.json({ detail: "Username and password are required." }, { status: 400 });
  }

  const res = await fetch(`${SERVER_API_BASE}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ detail: "Invalid username or password." }, { status: 401 });
  }

  const data = await res.json();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, data.access, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
  response.cookies.set(REFRESH_COOKIE, data.refresh, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
  return response;
}
