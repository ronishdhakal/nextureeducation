import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

const STEPS = [
  {
    title: "Free counseling session",
    detail:
      "We look at your grades, budget and goals and tell you honestly what's realistic — in person or on a call.",
  },
  {
    title: "University & course shortlist",
    detail: "A short, specific list matched to you — not a printout of every university that offers your subject.",
  },
  {
    title: "Applications & documents",
    detail: "SOP, LORs, transcripts — drafted, reviewed and submitted with you, on a deadline tracker you can see.",
  },
  {
    title: "Visa preparation",
    detail: "Financial documents, mock interviews, and a file built specifically for your destination's requirements.",
  },
  {
    title: "Pre-departure & you're off",
    detail: "Accommodation, banking, what to pack — the practical stuff, covered before you leave, not after.",
  },
];

export function HowItWorks() {
  return (
    <div>
      <SectionHeading
        eyebrow="How it works"
        title="Five steps, no detours."
        subcopy="The same process for every student, every destination — because the paperwork changes, the honesty doesn't."
      />

      <div className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5 rounded-lg overflow-hidden border border-hairline">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 60} className="bg-paper p-6 flex flex-col gap-3">
            <span className="font-display font-bold text-sm text-violet-deep border border-violet/30 rounded-full size-8 flex items-center justify-center">
              {i + 1}
            </span>
            <h3 className="font-display font-bold text-base text-ink">{step.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{step.detail}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
