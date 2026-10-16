"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { buttonClasses } from "@/components/ui/Button";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/lib/types";

export interface ConsultationOptions {
  /** Pre-select a destination in the form. */
  destinationId?: number;
  /** Pre-fill the message, e.g. "I'm interested in IELTS classes." */
  message?: string;
  title?: string;
}

const ConsultationContext = createContext<(options?: ConsultationOptions) => void>(() => {});

export function useConsultation() {
  return useContext(ConsultationContext);
}

export function ConsultationProvider({
  destinations,
  children,
}: {
  destinations: Destination[];
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [options, setOptions] = useState<ConsultationOptions>({});
  // Remount the form on every open so a previous submission never lingers.
  const [openCount, setOpenCount] = useState(0);

  const open = useCallback((next: ConsultationOptions = {}) => {
    setOptions(next);
    setOpenCount((n) => n + 1);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const restore = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", restore);
    return () => dialog.removeEventListener("close", restore);
  }, []);

  // Navigating away should never leave a modal open.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const value = useMemo(() => open, [open]);

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="consultation-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-[2px] rounded-box"
      >
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
                Free consultation
              </p>
              <h2
                id="consultation-title"
                className="mt-1 font-display text-2xl font-semibold text-ink"
              >
                {options.title || "Book Your Free Consultation"}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
                Tell us a little about your plans and an expert counsellor will get back to you
                within one business day.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-2 -mt-2 p-2 text-ink/60 transition-colors hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6">
            {openCount > 0 ? (
              <InquiryForm
                key={openCount}
                destinations={destinations}
                defaultDestinationId={options.destinationId}
                defaultMessage={options.message}
                sourcePage={`${pathname}#consultation`}
              />
            ) : null}
          </div>
        </div>
      </dialog>
    </ConsultationContext.Provider>
  );
}

/** A button that opens the consultation popup, styled like <Button>. */
export function ConsultationButton({
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  ...options
}: ConsultationOptions & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "ghost-light";
  size?: "md" | "lg" | "xl";
  arrow?: boolean;
  className?: string;
}) {
  const open = useConsultation();
  return (
    <button
      type="button"
      onClick={() => open(options)}
      className={buttonClasses(variant, size, className)}
    >
      {children}
      {arrow ? (
        <ArrowRight
          className={`transition-transform duration-200 group-hover:translate-x-0.5 ${size === "xl" ? "size-4 sm:size-5" : "size-4"}`}
          strokeWidth={2.2}
        />
      ) : null}
    </button>
  );
}

/**
 * Opens the popup once per browser session after a short delay, for pages where
 * a visitor is clearly researching (a destination or a class).
 */
export function ConsultationAutoPrompt({
  delayMs = 30000,
  ...options
}: ConsultationOptions & { delayMs?: number }) {
  const open = useConsultation();
  const { destinationId, message, title } = options;

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("nx_consultation_prompted") === "1";
    } catch {
      /* storage blocked: still fine to prompt once per page view */
    }
    if (seen) return;
    const timer = window.setTimeout(() => {
      // Never interrupt someone who is already typing in a form.
      if (document.querySelector("dialog[open]")) return;
      const active = document.activeElement;
      if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
      try {
        sessionStorage.setItem("nx_consultation_prompted", "1");
      } catch {
        /* ignore */
      }
      open({ destinationId, message, title });
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [open, delayMs, destinationId, message, title]);

  return null;
}
