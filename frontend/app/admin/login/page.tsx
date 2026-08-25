"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Logo } from "@/components/ui/Logo";
import { adminLogin } from "@/lib/adminApi";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(username, password);
      router.push(searchParams.get("next") || "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f5f8] px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-white border border-hairline rounded-2xl p-7 shadow-sm">
          <h1 className="font-display font-bold text-xl text-ink mb-1">CRM sign in</h1>
          <p className="text-sm text-stone mb-6">Staff access only.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">
                Username
              </label>
              <input
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-paper-2 border border-hairline px-3.5 py-2.5 text-sm outline-none focus:border-violet"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-paper-2 border border-hairline px-3.5 py-2.5 text-sm outline-none focus:border-violet"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-violet text-white font-semibold px-5 py-3 text-sm transition-all hover:bg-violet-deep disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
