import type { Metadata } from "next";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getTestPreps } from "@/lib/api";

export const metadata: Metadata = {
  title: "Test Prep — IELTS, PTE & SAT",
  description:
    "IELTS, PTE and SAT preparation classes built around the score your target universities actually require.",
};

export default async function TestPrepPage() {
  const [testPreps, destinations] = await Promise.all([getTestPreps(), getDestinations()]);

  return (
    <>
      <PageHeader
        eyebrow="Test Prep"
        title="Taught for your target score, not a generic curriculum."
        subcopy="Small batches, real mock tests, and instructors who know exactly what your shortlist requires."
      />

      <Section tone="paper">
        <div className="grid gap-6 sm:grid-cols-3">
          {testPreps.map((tp) => (
            <div
              key={tp.id}
              className="rounded-3xl border border-hairline bg-paper p-7 flex flex-col gap-4"
            >
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-violet-deep">
                {tp.name}
              </span>
              <p className="text-ink/70 text-sm leading-relaxed flex-1">{tp.description}</p>
              <dl className="text-xs text-stone space-y-1.5 border-t border-dashed border-ink/15 pt-4">
                {tp.format_note ? (
                  <div className="flex gap-2">
                    <dt className="font-mono uppercase shrink-0">Format</dt>
                    <dd>{tp.format_note}</dd>
                  </div>
                ) : null}
                {tp.schedule_note ? (
                  <div className="flex gap-2">
                    <dt className="font-mono uppercase shrink-0">Schedule</dt>
                    <dd>{tp.schedule_note}</dd>
                  </div>
                ) : null}
                {tp.fees_note ? (
                  <div className="flex gap-2">
                    <dt className="font-mono uppercase shrink-0">Fees</dt>
                    <dd>{tp.fees_note}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ))}
        </div>
        {!testPreps.length ? (
          <p className="text-ink/60">Test prep offerings will appear here once added.</p>
        ) : null}
      </Section>

      <Section tone="tint">
        <div className="max-w-xl mx-auto text-center">
          <SectionHeading
            align="center"
            eyebrow="Batches filling up"
            title="Reserve a seat in the next batch."
          />
          <div className="mt-8 text-left">
            <InquiryForm destinations={destinations} sourcePage="/test-prep" variant="compact" />
          </div>
        </div>
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
