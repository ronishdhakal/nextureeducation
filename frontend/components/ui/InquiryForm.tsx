"use client";

import { useId, useState } from "react";

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
  defaultMessage?: string;
  onSuccess?: () => void;
};

const inputClass =
  "w-full bg-white border border-violet/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-light focus:border-violet focus:ring-2 focus:ring-violet/15 outline-none transition-colors";
const labelClass =
  "block text-xs font-medium mb-1.5 text-ink";

export function InquiryForm({
  destinations = [],
  defaultDestinationId,
  sourcePage,
  variant = "full",
  className = "",
  defaultMessage = "",
  onSuccess,
}: Props) {
  const uid = useId();
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
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={` px-6 py-8 text-center bg-violet-pale ${className}`}>
        <p className="font-display font-bold text-xl mb-1 text-ink">You&apos;re on the list.</p>
        <p className="text-ink/65">
          We&apos;ll call or email you within one business day. No spam, no sales calls in
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
          <label className={labelClass} htmlFor={`${uid}-name`}>
            Full Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            required
            className={inputClass}
            placeholder="Your Full Name"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${uid}-phone`}>
            Phone No
          </label>
          <input
            id={`${uid}-phone`}
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
          <label className={labelClass} htmlFor={`${uid}-email`}>
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
      ) : null}

      <div className={variant === "full" ? "grid sm:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        <div>
          <label className={labelClass} htmlFor={`${uid}-preferred_destination`}>
            Preferred Destination
          </label>
          <select
            id={`${uid}-preferred_destination`}
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
          <label className={labelClass} htmlFor={`${uid}-preferred_level`}>
            Interested Study Level
          </label>
          <select id={`${uid}-preferred_level`} name="preferred_level" className={inputClass}>
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
          <label className={labelClass} htmlFor={`${uid}-message`}>
            Message
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={3}
            defaultValue={defaultMessage}
            className={inputClass}
            placeholder="Tell us about your goals or any questions..."
          />
        </div>
      ) : null}

      {status === "error" ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center self-center bg-violet text-white font-semibold px-14 py-3 text-sm shadow-sm shadow-violet/25 transition-colors duration-150 hover:bg-violet-deep disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request a Consultation"}
      </button>
    </form>
  );
}
