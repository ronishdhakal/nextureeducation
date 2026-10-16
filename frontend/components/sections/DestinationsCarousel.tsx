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
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-violet-pale to-violet/40">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt={`Study in ${destination.name}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 items-center gap-3 bg-gradient-to-b from-violet-dark to-ink px-3.5 py-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          {flag ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flag} alt="" className="size-8 object-contain" />
          ) : (
            <span className="text-[10px] font-bold text-violet-deep">
              {destination.country_code || destination.name.slice(0, 3).toUpperCase()}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-medium leading-tight text-white">{destination.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/75">
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
    "absolute top-[38%] z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink/70 shadow-float transition-colors hover:text-violet-deep md:inline-flex";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous destinations"
        onClick={() => scrollByPage(-1)}
        className={`${arrowClass} -left-12`}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next destinations"
        onClick={() => scrollByPage(1)}
        className={`${arrowClass} -right-12`}
      >
        <ChevronRight className="size-5" />
      </button>

      <div
        ref={trackRef}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {destinations.map((d) => (
          <div
            key={d.id}
            className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <DestinationTile destination={d} />
          </div>
        ))}
      </div>

      {pages > 1 ? (
        <div className="mt-4 flex justify-center gap-2.5">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`size-2.5 rounded-full transition-colors ${
                i === active ? "bg-violet" : "bg-stone-light/70 hover:bg-stone-light"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
