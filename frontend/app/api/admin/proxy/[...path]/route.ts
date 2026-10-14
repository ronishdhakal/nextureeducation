import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SERVER_API_BASE } from "@/lib/api";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  cookieOptions,
  REFRESH_COOKIE,
} from "@/lib/adminAuth";

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch(`${SERVER_API_BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access as string;
}

async function forward(
  request: Request,
  accessToken: string,
  path: string,
  search: string
): Promise<Response> {
  const init: RequestInit = {
    method: request.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(request.headers.get("content-type")
        ? { "Content-Type": request.headers.get("content-type")! }
        : {}),
    },
    cache: "no-store",
  };
  if (!["GET", "HEAD", "DELETE"].includes(request.method)) {
    // arrayBuffer (not text) so binary bodies like multipart file uploads
    // pass through unmangled, not just JSON payloads.
    init.body = await request.arrayBuffer();
  }
  return fetch(`${SERVER_API_BASE}/${path}/${search}`, init);
}

async function handler(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const search = new URL(request.url).search;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  let upstream = await forward(request, accessToken, path, search);
  let refreshedToken: string | null = null;

  if (upstream.status === 401 && refreshToken) {
    refreshedToken = await refreshAccessToken(refreshToken);
    if (refreshedToken) {
      upstream = await forward(request, refreshedToken, path, search);
    }
  }

  if (upstream.status === 401) {
    const response = NextResponse.json({ detail: "Session expired." }, { status: 401 });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const status = upstream.status;
  const body = status === 204 ? null : await upstream.text();
  const response = new NextResponse(body, {
    status,
    headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
  });

  if (refreshedToken) {
    response.cookies.set(ACCESS_COOKIE, refreshedToken, {
      ...cookieOptions,
      maxAge: ACCESS_MAX_AGE,
    });
  }

  return response;
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
};
