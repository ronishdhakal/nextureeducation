import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StatCard } from "@/components/ui/StatCard";
import type { SiteSettings } from "@/lib/types";

export function Hero({
  settings,
  destinationCount,
}: {
  settings: SiteSettings | null;
  destinationCount: number;
}) {
  const eyebrow = settings?.hero_eyebrow || "NEXTURE EDUCATION · BAGBAZAR, KATHMANDU";
  const headline = settings?.hero_headline || "Studying abroad, without the sales pitch.";
  const subcopy =
    settings?.hero_subcopy ||
    "We help Nepali students get into the right university abroad — and get the visa to go with it. Straight answers, real timelines, no pressure to sign up today.";

  const stats = [
    { value: settings?.stat_students_placed || "1,200+", label: "Students placed" },
    { value: settings?.stat_partner_universities || "85+", label: "Partner universities" },
    { value: settings?.stat_visa_success_rate || "92%", label: "Visa success rate" },
    {
      value: settings?.stat_countries || String(destinationCount || 7).padStart(2, "0"),
      label: "Destination countries",
    },
  ];

  return (
    <div className="bg-paper">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 pt-16 sm:pt-20 pb-14 sm:pb-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <Reveal className="max-w-2xl flex flex-col gap-6">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-deep">
              {eyebrow}
            </span>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-ink text-balance">
              {headline}
            </h1>

            <p className="text-lg text-ink/65 max-w-xl leading-relaxed">{subcopy}</p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button href="/contact" size="lg">
                Book a free session
              </Button>
              <Button href="/destinations" variant="ghost" size="lg">
                See destinations
              </Button>
            </div>

            <p className="text-sm text-stone">
              Straight answers · No pressure to sign up today · Real timelines
            </p>
          </Reveal>

          <Reveal delay={150} className="hidden lg:flex justify-center">
            <Image
              src="/assets/home.png"
              alt="Illustration of a student with a passport, backpack and airplane, representing studying abroad"
              width={640}
              height={450}
              priority
              className="w-full max-w-md h-auto"
            />
          </Reveal>
        </div>
      </div>

      <div className="border-t border-hairline bg-paper-2">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-hairline">
          {stats.map((s) => (
            <div key={s.label} className="px-4 first:pl-0 sm:px-6">
              <StatCard value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
