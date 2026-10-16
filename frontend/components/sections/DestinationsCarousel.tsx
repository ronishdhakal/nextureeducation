"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { mediaUrl } from "@/lib/api";
import type { Destination } from "@/lib/types";

export function DestinationTile({ destination }: { destination: Destination }) {
  const hero = mediaUrl(destination.hero_image);
  const flag = mediaUrl(destination.flag_image);

  return (
    <Link
      href={`/destination/${destination.slug}`}
      className="group flex h-full flex-col overflow-hidden bg-violet-dark shadow-float transition-transform duration-300 hover:-translate-y-1 rounded-box"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-violet-pale to-violet/40">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt={`Study in ${destination.name} from Nepal`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 items-center gap-3.5 bg-gradient-to-b from-[#4b2a8f] to-[#120c26] px-4 py-5">
        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          {flag ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img loading="lazy" decoding="async" src={flag} alt={`${destination.name} flag`} className="size-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold text-violet-deep">
              {destination.country_code || destination.name.slice(0, 3).toUpperCase()}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-normal leading-tight text-white">{destination.name}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/85">
            {destination.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function DestinationsCarousel({ destinations }: { destinations: Destination[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const pageCount = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(pageCount);
    setActive(Math.min(pageCount - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, destinations.length]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  function goTo(page: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
  }

  if (!destinations.length) {
    return (
      <p className=" border border-dashed border-hairline p-10 text-center text-sm text-stone rounded-box">
        Destinations are being added. Check back soon.
      </p>
    );
  }

  const arrowClass =
    "absolute top-[40%] z-10 hidden -translate-y-1/2 p-1 text-ink/60 transition-colors hover:text-violet-deep md:inline-flex";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous destinations"
        onClick={() => scrollByPage(-1)}
        className={`${arrowClass} -left-10`}
      >
        <ChevronLeft className="size-7" strokeWidth={1.6} />
      </button>
      <button
        type="button"
        aria-label="Next destinations"
        onClick={() => scrollByPage(1)}
        className={`${arrowClass} -right-10`}
      >
        <ChevronRight className="size-7" strokeWidth={1.6} />
      </button>

      <div
        ref={trackRef}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:gap-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {destinations.map((d) => (
          <div
            key={d.id}
            className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-7rem)/3)]"
          >
            <DestinationTile destination={d} />
          </div>
        ))}
      </div>

      {pages > 1 ? (
        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`size-3 rounded-full transition-colors ${
                i === active ? "bg-violet" : "bg-ink/40 hover:bg-ink/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
