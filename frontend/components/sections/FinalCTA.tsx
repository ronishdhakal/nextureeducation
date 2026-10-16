import { InquiryForm } from "@/components/ui/InquiryForm";
import { Eyebrow } from "@/components/ui/Section";
import type { Destination } from "@/lib/types";

export function FinalCTA({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="border-t border-hairline bg-violet-tint">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Eyebrow>Get started</Eyebrow>
            <h2 className="font-display text-3xl font-bold leading-[1.15] tracking-[-0.01em] text-ink text-balance sm:text-4xl">
              Your next step takes ten minutes to start.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-ink/70">
              Tell us where you&apos;re thinking of going, or that you have no idea yet.
              Either way, we&apos;ll call you back with something useful to say.
            </p>
          </div>

          <div className=" border border-hairline bg-paper p-6 shadow-soft sm:p-8 rounded-box">
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
