import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Section";
import type { SiteSettings } from "@/lib/types";

const REASONS = [
  {
    title: "Based in Bagbazar, not a call center",
    detail:
      "Walk in and talk to the counselor who'll actually handle your file — not a rotating desk or a call center reading from a script.",
  },
  {
    title: "One point of contact, start to finish",
    detail:
      "The person you meet for your first session is the same person who preps your visa interview months later.",
  },
  {
    title: "No pressure to decide today",
    detail:
      "We'd rather you leave with clear next steps than a signature. Most students take more than one visit to decide.",
  },
];

export function WhyLocal({ settings }: { settings: SiteSettings | null }) {
  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
      <div className="flex flex-col gap-5">
        <SectionHeading
          eyebrow="Why Nexture"
          title="The best consultancy in Bagbazar for studying abroad — here's why students say that."
        />
        <p className="text-ink/65 leading-relaxed max-w-md">
          Bagbazar has no shortage of consultancies. What students tell us sets Nexture apart
          is simple: we&apos;re direct about your chances, we don&apos;t hand you off between
          desks, and we&apos;re easy to find when you need a follow-up conversation.
        </p>
        <Button href="/contact" className="w-fit">
          Visit our Bagbazar office
        </Button>
      </div>

      <div className="grid gap-px bg-hairline rounded-lg overflow-hidden border border-hairline">
        {REASONS.map((r) => (
          <div key={r.title} className="bg-paper p-6">
            <h3 className="font-display font-bold text-base text-ink mb-1.5">{r.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{r.detail}</p>
          </div>
        ))}
        <div className="bg-paper-2 p-6">
          <p className="text-sm text-ink/70">
            <span className="font-semibold text-ink">Address:</span>{" "}
            {settings?.address || "Bagbazar, Kathmandu, Nepal"}
          </p>
          {settings?.phone ? (
            <p className="text-sm text-ink/70 mt-1">
              <span className="font-semibold text-ink">Phone:</span> {settings.phone}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
