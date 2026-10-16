import { BadgeCheck, Globe2, Landmark, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { ConsultationButton } from "@/components/ui/ConsultationProvider";
import type { SiteSettings } from "@/lib/types";

/** Colour everything after " with " in the brand violet, as in the design. */
function renderHeadline(text: string) {
  const i = text.toLowerCase().indexOf(" with ");
  if (i === -1) return text;
  return (
    <>
      <span className="lg:whitespace-nowrap">{text.slice(0, i)}</span>
      <br className="hidden sm:block" />{" "}
      <span className="lg:whitespace-nowrap">
        with <span className="text-violet-deep">{text.slice(i + 6)}</span>
      </span>
    </>
  );
}

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const eyebrow = settings?.hero_eyebrow?.trim() || "Academic Excellence. Global Reach.";
  const headline =
    settings?.hero_headline?.trim() || "Fuel Your Academic Future with Nexture Education.";
  const subcopy =
    settings?.hero_subcopy?.trim() ||
    "Secure your spot at world-class universities with step-by-step guidance, offer letter assurance, and complete visa clarity.";

  const stats: { Icon: LucideIcon; value: string; label: string }[] = [
    { Icon: Users, value: settings?.stat_students_placed || "", label: "Student Guided" },
    { Icon: BadgeCheck, value: settings?.stat_visa_success_rate || "", label: "Visa Success" },
    {
      Icon: Landmark,
      value: settings?.stat_partner_universities || "",
      label: "University Partners",
    },
    { Icon: Globe2, value: settings?.stat_countries || "", label: "Global Destinations" },
  ].filter((st) => st.value);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-pale/70 via-violet-tint to-paper">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8 pt-12 sm:px-8 md:pb-36 md:pt-20">
        <div className="flex max-w-[40rem] flex-col gap-5 md:max-w-[52%] lg:max-w-[40rem]">
          <p className="text-sm uppercase tracking-[0.03em] text-violet sm:text-base">{eyebrow}</p>
          <h1 className="font-display text-[2rem] font-semibold leading-[1.3] text-ink sm:text-[2.4rem] lg:text-[2.8rem]">
            {renderHeadline(headline)}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ink/70 lg:text-lg">{subcopy}</p>
          <div className="flex flex-wrap gap-3 pt-4 sm:gap-4">
            <ConsultationButton size="xl" arrow>
              Start Your Journey
            </ConsultationButton>
            <Button href="/destination" variant="ghost" size="xl" arrow>
              Explore Destinations
            </Button>
          </div>
        </div>
      </div>

      {/* Artwork: stacked under the copy on phones, anchored to the right edge from md up. */}
      <div className="pointer-events-none relative h-[300px] sm:h-[360px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[48%]">
        <Image
          src="/assets/home/background.png"
          alt=""
          width={577}
          height={433}
          priority
          className="absolute bottom-0 right-0 h-auto w-[120%] max-w-none opacity-60 [mask-image:linear-gradient(to_right,transparent,black_35%),linear-gradient(to_top,transparent,black_15%)] [mask-composite:intersect] sm:w-full md:w-full lg:w-[min(52vw,820px)]"
        />
        <div className="absolute bottom-0 left-1/2 aspect-[420/612] h-[88%] -translate-x-1/2 md:left-auto md:right-[max(1.5rem,calc(50vw-36rem+1rem))] md:h-[min(84%,500px)] md:translate-x-0">
          <div className="absolute bottom-0 left-1/2 aspect-square h-[78%] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet/30 to-violet-pale/0" />
          <Image
            src="/assets/home/model.png"
            alt="A Nexture Education student ready to study abroad"
            width={420}
            height={612}
            priority
            className="relative size-full object-contain object-bottom"
          />
        </div>
      </div>

      {stats.length ? (
        <div className="relative z-10 mx-auto -mt-px w-full max-w-6xl px-6 pb-2 sm:px-8 md:-mt-14 md:pb-0">
          <dl className="grid grid-cols-2 gap-y-6 border border-hairline bg-paper p-6 shadow-float md:grid-flow-col md:auto-cols-fr md:divide-x md:divide-hairline md:p-0 md:py-6 rounded-box">
            {stats.map(({ Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 md:justify-center md:px-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-violet-pale text-violet-deep">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <div>
                  <dd className="text-sm font-semibold text-ink">{value}</dd>
                  <dt className="text-[11px] text-stone">{label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}
