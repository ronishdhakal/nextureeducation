"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Logo } from "@/components/ui/Logo";
import { adminLogin } from "@/lib/adminApi";

const inputClass =
  "w-full bg-white border border-violet/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-light outline-none transition-colors focus:border-violet focus:ring-2 focus:ring-violet/15 rounded-box";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(email, password);
      router.push(searchParams.get("next") || "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 bg-white p-8 shadow-float md:grid-cols-2 md:p-12 rounded-box">
        <div>
          <div className="flex items-center gap-4">
            <Logo />
            <span className="h-8 w-px bg-hairline" />
            <span className="text-sm text-ink/70">Admin Panel</span>
          </div>

          <h1 className="mt-10 font-display text-3xl font-semibold text-ink">
            Welcome <span className="text-violet-deep">Back,</span>
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
            Login to your Nexture Education admin account and manage your institution with ease.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoFocus
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-deep"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center bg-violet px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet/25 transition-colors hover:bg-violet-deep disabled:opacity-60 rounded-box"
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden bg-gradient-to-br from-violet-pale via-violet-tint to-violet/30 md:block rounded-box">
          <Image
            src="/assets/home/background.png"
            alt=""
            fill
            sizes="(min-width: 768px) 40vw, 0px"
            className="object-contain object-bottom p-6 opacity-80"
          />
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
