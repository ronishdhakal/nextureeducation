import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getFlagSrc } from "@/lib/destinationFlags";
import type { Destination } from "@/lib/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  const flag = getFlagSrc(destination.slug);

  return (
    <Link
      href={`/destination/${destination.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-hairline bg-paper shadow-soft transition-shadow duration-200 hover:border-violet/30 hover:shadow-md"
    >
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {flag ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={flag}
                alt=""
                className="h-10 w-14 border border-hairline object-cover shadow-sm"
              />
            ) : null}
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone">
              {destination.country_code}
            </span>
          </div>
          {destination.is_featured ? (
            <span className="inline-flex bg-violet-pale px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-deep">
              Popular
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-[1.6rem] font-bold tracking-[-0.01em] text-ink">
          {destination.name}
        </h3>
        {destination.summary ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink/55">
            {destination.summary}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-hairline bg-paper-2 px-6 py-4 transition-colors group-hover:bg-violet-tint">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone">
            Intakes
          </span>
          <span className="text-sm font-medium text-ink">{destination.popular_intakes}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-deep">
          Explore
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </span>
      </div>
    </Link>
  );
}
