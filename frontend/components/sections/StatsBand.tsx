import { Reveal } from "@/components/ui/Reveal";
import { SITE_STATS } from "@/lib/siteStats";

export function StatsBand() {
  const stats = [
    SITE_STATS.students,
    SITE_STATS.universities,
    SITE_STATS.visa,
    SITE_STATS.destinations,
  ];

  return (
    <div className="bg-violet">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4 sm:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 70} className="text-center sm:text-left">
            <p className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-violet-pale">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
