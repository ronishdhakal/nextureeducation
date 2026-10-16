import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_COOKIE } from "@/lib/adminAuth";
import { API_CACHE_TAG, SERVER_API_BASE } from "@/lib/api";

/**
 * Clears the website's cached pages and backend data, so edits made in the admin
 * show up immediately. Only people who manage website content may do this.
 */
export async function POST() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });

  const me = await fetch(`${SERVER_API_BASE}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!me.ok) return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });

  const user = (await me.json()) as { modules?: string[] };
  if (!user.modules?.includes("content") && !user.modules?.includes("settings")) {
    return NextResponse.json(
      { detail: "You do not have permission to clear the cache." },
      { status: 403 }
    );
  }

  revalidateTag(API_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, clearedAt: new Date().toISOString() });
}
