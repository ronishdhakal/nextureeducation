import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";

const STEPS = [
  {
    title: "Free counseling session",
    detail:
      "We look at your grades, budget and goals and tell you honestly what's realistic, in person or on a call.",
  },
  {
    title: "University & course shortlist",
    detail:
      "A short, specific list matched to you, not a printout of every university that offers your subject.",
  },
  {
    title: "Applications & documents",
    detail:
      "SOP, LORs, transcripts: drafted, reviewed and submitted with you, on a deadline tracker you can see.",
  },
  {
    title: "Visa preparation",
    detail:
      "Financial documents, mock interviews, and a file built specifically for your destination's requirements.",
  },
  {
    title: "Pre-departure & you're off",
    detail:
      "Accommodation, banking, what to pack. The practical stuff, covered before you leave, not after.",
  },
];

export function HowItWorks() {
  return (
    <div>
      <SectionHeading
        eyebrow="How it works"
        title="Five steps, no detours."
        subcopy="The same process for every student, every destination, because the paperwork changes, the honesty doesn't."
      />

      <div className="mt-14 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <Reveal
            key={step.title}
            delay={i * 80}
            className="flex h-full flex-col gap-4 border border-hairline bg-paper p-6 shadow-soft"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet font-display text-base font-bold text-white">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-base font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink/60">{step.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
