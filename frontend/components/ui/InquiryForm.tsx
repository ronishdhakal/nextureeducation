"use client";

import { useState } from "react";

import { createLead } from "@/lib/api";
import type { Destination, PreferredLevel } from "@/lib/types";

const LEVELS: { value: PreferredLevel; label: string }[] = [
  { value: "undecided", label: "Not sure yet" },
  { value: "foundation", label: "Foundation" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

type Props = {
  destinations?: Destination[];
  defaultDestinationId?: number;
  sourcePage: string;
  variant?: "full" | "compact";
  className?: string;
};

const inputClass =
  "w-full rounded-md bg-paper-2 border border-hairline px-4 py-2.5 text-sm text-ink placeholder:text-stone-light focus:border-violet outline-none transition-colors";
const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1.5 text-stone";

export function InquiryForm({
  destinations = [],
  defaultDestinationId,
  sourcePage,
  variant = "full",
  className = "",
}: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = new FormData(e.currentTarget);
    const destinationValue = form.get("preferred_destination");

    try {
      await createLead({
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        preferred_destination: destinationValue ? Number(destinationValue) : undefined,
        preferred_level: (form.get("preferred_level") as PreferredLevel) || "undecided",
        message: String(form.get("message") || ""),
        source_page: sourcePage,
        website: String(form.get("website") || ""),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`rounded-lg px-6 py-8 text-center bg-violet-pale ${className}`}>
        <p className="font-display font-bold text-xl mb-1 text-ink">You&apos;re on the list.</p>
        <p className="text-ink/65">
          We&apos;ll call or email you within one business day — no spam, no sales calls in
          between.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      {/* Honeypot — left blank by real users, hidden from sighted and AT users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className={variant === "full" ? "grid sm:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        <div>
          <label className={labelClass} htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={inputClass}
            placeholder="98XXXXXXXX"
          />
        </div>
      </div>

      {variant === "full" ? (
        <div>
          <label className={labelClass} htmlFor="email">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      ) : null}

      <div className={variant === "full" ? "grid sm:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        <div>
          <label className={labelClass} htmlFor="preferred_destination">
            Interested in
          </label>
          <select
            id="preferred_destination"
            name="preferred_destination"
            defaultValue={defaultDestinationId ?? ""}
            className={inputClass}
          >
            <option value="">Not sure yet</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="preferred_level">
            Level
          </label>
          <select id="preferred_level" name="preferred_level" className={inputClass}>
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {variant === "full" ? (
        <div>
          <label className={labelClass} htmlFor="message">
            Anything else we should know? (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={inputClass}
            placeholder="Your grades, budget range, target intake — whatever helps us prep before we call."
          />
        </div>
      ) : null}

      {status === "error" ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-violet text-white font-semibold px-6 py-3 text-sm transition-colors duration-150 hover:bg-violet-deep disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Book a free session"}
      </button>
    </form>
  );
}
