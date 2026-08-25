import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StatCard } from "@/components/ui/StatCard";
import { Wave } from "@/components/ui/Wave";
import type { SiteSettings } from "@/lib/types";

export function Hero({
  settings,
  destinationCount,
}: {
  settings: SiteSettings | null;
  destinationCount: number;
}) {
  const eyebrow = settings?.hero_eyebrow || "NEXTURE EDUCATION";
  const headline = settings?.hero_headline || "Studying abroad, without the sales pitch.";
  const subcopy =
    settings?.hero_subcopy ||
    "We help Nepali students get into the right university abroad — and get the visa to go with it. Straight answers, real timelines, no pressure to sign up today.";

  const stats = [
    { value: settings?.stat_students_placed || "1,200+", label: "Students placed" },
    { value: settings?.stat_visa_success_rate || "92%", label: "Visa success" },
    {
      value: settings?.stat_countries || String(destinationCount || 7).padStart(2, "0"),
      label: "Destinations",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 size-[32rem] rounded-full opacity-70 blur-3xl animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, var(--violet) 0%, var(--violet-dark) 55%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/3 -left-32 size-80 rounded-full opacity-40 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, var(--mint) 0%, transparent 70%)", animationDelay: "-6s" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 pt-16 sm:pt-24 pb-32 sm:pb-40">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <Reveal className="flex flex-col gap-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-violet-pale">
              <span className="size-1.5 rounded-full bg-amber" />
              {eyebrow}
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-white text-balance">
              {headline}
            </h1>

            <p className="text-lg text-white/70 max-w-lg leading-relaxed">{subcopy}</p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button href="/contact" size="lg">
                Book a free session
              </Button>
              <Button href="/destinations" variant="ghost-light" size="lg">
                See destinations
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150} className="relative h-full min-h-[20rem] hidden sm:block">
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute grid grid-cols-2 gap-4 w-full max-w-sm">
                <StatCard
                  value={stats[0].value}
                  label={stats[0].label}
                  rotate="left"
                  className="col-span-2 justify-self-start"
                />
                <StatCard value={stats[1].value} label={stats[1].label} rotate="right" />
                <StatCard
                  value={stats[2].value}
                  label={stats[2].label}
                  rotate="left"
                  className="mt-6"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <Wave fill="var(--paper)" />
      </div>
    </div>
  );
}
