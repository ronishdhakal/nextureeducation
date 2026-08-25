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

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 80} className="relative">
            <div className="relative flex flex-col gap-4 h-full rounded-2xl border border-hairline bg-paper p-6">
              <div
                className={`size-12 rounded-full border-2 border-violet/30 flex items-center justify-center font-display font-extrabold text-violet ${
                  i % 2 === 0 ? "-rotate-6" : "rotate-6"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display font-bold text-lg text-ink">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.detail}</p>
            </div>
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="hidden lg:block absolute top-12 -right-3 w-6 border-t-2 border-dashed border-violet/25"
              />
            ) : null}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
