import type { SiteSettings } from "@/lib/types";

export function StatsBand({ settings }: { settings: SiteSettings | null }) {
  const stats = [
    { value: settings?.stat_students_placed || "1,200+", label: "Students placed abroad" },
    { value: settings?.stat_partner_universities || "85+", label: "Partner universities" },
    { value: settings?.stat_visa_success_rate || "92%", label: "Visa success rate" },
    { value: settings?.stat_countries || "07", label: "Destination countries" },
  ];

  return (
    <div className="bg-violet">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <p className="font-display font-bold text-3xl sm:text-4xl text-white">{s.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-violet-pale">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
