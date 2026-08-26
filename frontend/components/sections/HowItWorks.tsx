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

      <div className="relative mt-14">
        <div
          aria-hidden
          className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-px bg-violet/25"
        />
        <div
          aria-hidden
          className="sm:hidden absolute top-1 bottom-1 left-6 w-px bg-violet/25"
        />

        <div className="flex flex-col gap-9 sm:grid sm:grid-cols-5 sm:gap-5">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 90}
              className="relative flex gap-4 sm:flex-col sm:items-center sm:text-center"
            >
              <span className="relative z-10 shrink-0 size-12 rounded-full bg-paper-2 border-2 border-violet flex items-center justify-center font-display font-bold text-violet-deep">
                {i + 1}
              </span>
              <div className="pt-1.5 sm:pt-0">
                <h3 className="font-display font-bold text-base text-ink mb-1">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
