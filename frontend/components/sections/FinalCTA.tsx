import { InquiryForm } from "@/components/ui/InquiryForm";
import type { Destination } from "@/lib/types";

export function FinalCTA({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="bg-violet-tint border-t border-hairline">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-deep">
              Get started
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink leading-tight text-balance">
              Your next step takes ten minutes to start.
            </h2>
            <p className="text-ink/65 max-w-md">
              Tell us where you&apos;re thinking of going — or that you have no idea yet.
              Either way, we&apos;ll call you back with something useful to say.
            </p>
          </div>

          <div className="bg-paper border border-hairline rounded-lg p-6 sm:p-8 shadow-[0_1px_3px_rgba(23,11,34,0.06)]">
            <InquiryForm
              destinations={destinations}
              sourcePage="/#final-cta"
              variant="compact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
