import { Reveal } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/types";

export function StatsBand({ settings }: { settings: SiteSettings | null }) {
  const stats = [
    { value: settings?.stat_students_placed || "", label: "Students placed abroad" },
    { value: settings?.stat_partner_universities || "", label: "Partner universities" },
    { value: settings?.stat_visa_success_rate || "", label: "Visa success rate" },
    { value: settings?.stat_countries || "", label: "Destination countries" },
  ].filter((s) => s.value);
  if (!stats.length) return null;

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
