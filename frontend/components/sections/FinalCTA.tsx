import { InquiryForm } from "@/components/ui/InquiryForm";
import type { Destination } from "@/lib/types";

export function FinalCTA({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="bg-ink border-t border-white/10">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-pale">
              Get started
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight text-balance">
              Your next step takes ten minutes to start.
            </h2>
            <p className="text-white/70 max-w-md">
              Tell us where you&apos;re thinking of going — or that you have no idea yet.
              Either way, we&apos;ll call you back with something useful to say.
            </p>
          </div>

          <div className="bg-white/[0.06] border border-white/10 rounded-lg p-6 sm:p-8">
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
