import { InquiryForm } from "@/components/ui/InquiryForm";
import { Wave } from "@/components/ui/Wave";
import type { Destination } from "@/lib/types";

export function FinalCTA({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="relative overflow-hidden bg-ink">
      <div className="rotate-180">
        <Wave fill="var(--paper-2)" />
      </div>

      <div
        aria-hidden
        className="absolute top-0 right-0 size-96 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--violet) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-violet-pale">
              <span className="size-1.5 rounded-full bg-amber" />
              Final call
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight text-balance">
              Your next step takes ten minutes to start.
            </h2>
            <p className="text-white/70 max-w-md">
              Tell us where you&apos;re thinking of going — or that you have no idea yet.
              Either way, we&apos;ll call you back with something useful to say.
            </p>
          </div>

          <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-6 sm:p-8">
            <InquiryForm
              destinations={destinations}
              sourcePage="/#final-cta"
              variant="compact"
              tone="ink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
