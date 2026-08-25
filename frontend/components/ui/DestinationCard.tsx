import Link from "next/link";

import { getFlagSrc } from "@/lib/destinationFlags";
import type { Destination } from "@/lib/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  const flag = getFlagSrc(destination.slug);

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group flex flex-col rounded-lg bg-paper border border-hairline transition-shadow duration-200 hover:shadow-md hover:border-violet/30"
    >
      <div className="p-6 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {flag ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={flag}
                alt=""
                className="h-4 w-6 rounded-[2px] object-cover border border-hairline"
              />
            ) : null}
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">
              {destination.country_code}
            </span>
          </div>
          {destination.is_featured ? (
            <span className="text-xs font-semibold text-violet-deep">Popular</span>
          ) : null}
        </div>

        <h3 className="font-display font-bold text-xl text-ink">{destination.name}</h3>
        <p className="text-sm text-ink/65 leading-relaxed">{destination.summary}</p>
      </div>

      <div className="border-t border-hairline px-6 py-3.5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wide text-stone">Intakes</span>
          <span className="text-sm text-ink">{destination.popular_intakes}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-deep">
          Explore <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
