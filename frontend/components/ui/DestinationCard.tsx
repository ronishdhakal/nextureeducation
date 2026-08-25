import Link from "next/link";

import { mediaUrl } from "@/lib/api";
import type { Destination } from "@/lib/types";

const ACCENTS = [
  "bg-violet",
  "bg-amber",
  "bg-mint",
  "bg-violet-deep",
  "bg-amber",
  "bg-mint",
  "bg-violet",
];

export function DestinationCard({
  destination,
  index = 0,
}: {
  destination: Destination;
  index?: number;
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  const flag = mediaUrl(destination.flag_image);

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative flex flex-col rounded-3xl bg-paper border border-hairline overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(23,11,34,0.3)]"
    >
      <span className={`absolute inset-x-0 top-0 h-1.5 ${accent}`} aria-hidden />

      <div className="p-6 sm:p-7 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-pale px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-violet-deep">
            {flag ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={flag} alt="" className="size-3.5 rounded-full object-cover" />
            ) : null}
            {destination.country_code}
          </span>
          {destination.is_featured ? (
            <span className="text-xs font-mono text-amber-600 rotate-2">★ popular</span>
          ) : null}
        </div>

        <h3 className="font-display font-extrabold text-2xl text-ink">{destination.name}</h3>
        <p className="text-sm text-ink/65 leading-relaxed">{destination.summary}</p>
      </div>

      <div className="border-t border-dashed border-ink/15 px-6 sm:px-7 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
            Intakes
          </span>
          <span className="font-mono text-xs text-ink">{destination.popular_intakes}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-deep group-hover:gap-2 transition-all">
          Explore <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
