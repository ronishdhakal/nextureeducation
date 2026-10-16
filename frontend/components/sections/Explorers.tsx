"use client";

import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DestinationTile } from "@/components/sections/DestinationsCarousel";
import { CheckList, SearchBox, WRAP } from "@/components/ui/blocks";
import { mediaUrl } from "@/lib/api";
import { formatEventDate, formatEventTime } from "@/lib/eventFormat";
import { parseLines } from "@/lib/lines";
import type { Destination, EventItem, TestPrep } from "@/lib/types";

function matches(query: string, ...fields: (string | undefined)[]) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => (f || "").toLowerCase().includes(q));
}

export function DestinationsExplorer({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () => destinations.filter((d) => matches(query, d.name, d.summary, d.country_code)),
    [destinations, query]
  );

  return (
    <section className="bg-violet-tint pb-16">
      <div className={WRAP}>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search Study Destinations"
          className="mx-auto max-w-sm"
        />
        {shown.length ? (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((d) => (
              <DestinationTile key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-sm text-stone">
            {destinations.length
              ? "No destinations match your search."
              : "Destinations will appear here once they are added."}
          </p>
        )}
      </div>
    </section>
  );
}

export function TestPrepExplorer({ testPreps }: { testPreps: TestPrep[] }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () => testPreps.filter((t) => matches(query, t.name, t.tagline, t.description)),
    [testPreps, query]
  );

  return (
    <section className="bg-violet-tint pb-10">
      <div className={WRAP}>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Search Courses"
          className="mx-auto max-w-md"
        />
        {shown.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {shown.map((t) => {
              const points = parseLines(t.key_highlights).slice(0, 3);
              return (
                <Link
                  key={t.id}
                  href={`/classes/${t.slug}`}
                  className="group flex flex-col border border-hairline bg-paper p-5 shadow-float transition-transform duration-300 hover:-translate-y-1 rounded-box"
                >
                  <h2 className="text-sm font-semibold uppercase text-violet-dark">{t.name}</h2>
                  {t.tagline ? (
                    <p className="mt-2 text-xs font-medium text-ink">{t.tagline}</p>
                  ) : null}
                  <p className="mt-3 line-clamp-5 text-xs leading-relaxed text-ink/65">
                    {t.description}
                  </p>
                  {points.length ? (
                    <div className="mt-4 text-xs">
                      <CheckList items={points} />
                    </div>
                  ) : null}
                  <span className="mt-auto flex items-center justify-end gap-1 pt-5 text-xs font-medium text-violet-deep">
                    Learn more
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-stone">
            {testPreps.length
              ? "No courses match your search."
              : "Courses will appear here once they are added."}
          </p>
        )}
      </div>
    </section>
  );
}

export function EventsExplorer({ events }: { events: EventItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    events.forEach((e) => seen.set(e.category, e.category_display));
    return [...seen.entries()];
  }, [events]);

  const shown = events.filter(
    (e) =>
      (category === "all" || e.category === category) &&
      matches(query, e.title, e.summary, e.venue)
  );

  const tab = (active: boolean) =>
    `rounded-box px-4 py-2 text-xs font-medium transition-colors ${
      active
        ? "bg-violet text-white shadow-sm shadow-violet/25"
        : "border border-hairline bg-paper text-ink/80 hover:border-violet"
    }`;

  return (
    <section className="bg-violet-tint pb-16">
      <div className={WRAP}>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setCategory("all")} className={tab(category === "all")}>
              All Events
            </button>
            {categories.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={tab(category === value)}
              >
                {label}
              </button>
            ))}
          </div>
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search Events"
            className="w-full sm:w-60"
          />
        </div>

        {shown.length ? (
          <div className="mt-8 flex flex-col gap-6">
            {shown.map((e) => {
              const cover = mediaUrl(e.cover_image);
              const time = formatEventTime(e.start_time, e.end_time);
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="group grid overflow-hidden border border-hairline bg-paper shadow-float transition-transform duration-300 hover:-translate-y-0.5 sm:grid-cols-[0.9fr_1.1fr] rounded-box"
                >
                  <div className="h-48 bg-gradient-to-br from-violet-pale to-violet/30 sm:h-auto sm:min-h-52">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" loading="lazy" className="size-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-col items-start gap-3 p-6">
                    <span className=" bg-violet-pale px-2.5 py-1 text-[11px] font-medium text-violet-deep rounded-md">
                      {e.category_display}
                    </span>
                    <h2 className="font-display text-xl font-semibold leading-snug text-ink">
                      {e.title}
                    </h2>
                    <p className="line-clamp-2 text-xs leading-relaxed text-ink/65">{e.summary}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-ink/70">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-violet-deep" />
                        {formatEventDate(e.event_date)}
                      </span>
                      {time ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5 text-violet-deep" />
                          {time}
                        </span>
                      ) : null}
                      {e.venue ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-violet-deep" />
                          {e.venue}
                        </span>
                      ) : null}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1 self-end text-xs font-medium text-violet-deep">
                      Learn more
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-12 text-center text-sm text-stone">
            {events.length ? "No events match your filters." : "No upcoming events right now. Check back soon."}
          </p>
        )}
      </div>
    </section>
  );
}
