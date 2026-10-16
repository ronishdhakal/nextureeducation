"use client";

import { useState } from "react";

import { createLead } from "@/lib/api";
import type { PreferredLevel } from "@/lib/types";

const LEVELS: { value: PreferredLevel; label: string }[] = [
  { value: "foundation", label: "High School / Foundation" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

const inputClass =
  "w-full bg-white border border-violet/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-light focus:border-violet focus:ring-2 focus:ring-violet/15 outline-none transition-colors rounded-box";
const labelClass = "block text-xs font-medium mb-1.5 text-ink";

export function EventRegisterForm({
  eventTitle,
  eventSlug,
}: {
  eventTitle: string;
  eventSlug: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await createLead({
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        preferred_level: (form.get("level") as PreferredLevel) || "undecided",
        message: `Event registration: ${eventTitle}`,
        source_page: `/events/${eventSlug}`,
        website: String(form.get("website") || ""),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-xl bg-violet-pale px-6 py-8 rounded-box">
        <p className="font-display text-lg font-semibold text-ink">You&apos;re registered.</p>
        <p className="mt-1 text-sm text-ink/70">
          We&apos;ll confirm your seat for {eventTitle} by phone or email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-xl gap-4 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div>
        <label className={labelClass} htmlFor="ev-name">Full Name</label>
        <input id="ev-name" name="name" required placeholder="Your Full Name" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="ev-email">Email</label>
        <input id="ev-email" name="email" type="email" placeholder="you@example.com" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="ev-phone">Phone No</label>
        <input id="ev-phone" name="phone" type="tel" required placeholder="98XXXXXXXX" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="ev-level">Education Level</label>
        <select id="ev-level" name="level" defaultValue="" required className={inputClass}>
          <option value="" disabled>Select Education Level</option>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>
      {status === "error" ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className=" bg-violet px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-violet/25 transition-colors hover:bg-violet-deep disabled:opacity-60 rounded-box"
        >
          {status === "submitting" ? "Registering…" : "Register Now"}
        </button>
      </div>
    </form>
  );
}
