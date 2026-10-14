"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { listResource } from "@/lib/adminApi";
import { useAdmin } from "@/lib/adminContext";
import { formatEventTime } from "@/lib/eventFormat";
import type { EventItem, Lead, LeadSummary } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

const LEVEL_LABELS: Record<string, string> = {
  foundation: "Foundation",
  diploma: "Diploma",
  bachelor: "Bachelor's",
  master: "Master's",
  phd: "PhD",
  undecided: "Undecided",
};

const QUICK_ACTIONS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Add Destination", href: "/admin/destinations/new", Icon: Globe2 },
  { label: "Create Blog", href: "/admin/blog/new", Icon: FileText },
  { label: "Add University", href: "/admin/universities/new", Icon: GraduationCap },
  { label: "Create Event", href: "/admin/events/new", Icon: CalendarDays },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  const { user } = useAdmin();
  const [summary, setSummary] = useState<LeadSummary | null>(null);
  const [recent, setRecent] = useState<Lead[] | null>(null);
  const [dueToday, setDueToday] = useState<Lead[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");

  const sees = (m: string) => (user ? user.modules.includes(m as never) : false);
  const hasLeads = sees("leads");
  const hasContent = sees("content");
  const hasStudents = sees("students");
  const [deskCounts, setDeskCounts] = useState<{ students: number; applications: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        if (hasLeads) {
          const [sum, latest, today] = await Promise.all([
            fetch("/api/admin/proxy/leads/summary").then((r) => r.json() as Promise<LeadSummary>),
            listResource<Lead>("leads", "?page_size=5&ordering=-created_at"),
            listResource<Lead>("leads", "?page_size=8&follow_up=today&ordering=next_follow_up"),
          ]);
          setSummary(sum);
          setRecent(latest.results);
          setDueToday(today.results);
        }
        if (hasStudents) {
          const [st, ap] = await Promise.all([
            listResource<unknown>("students", "?page_size=1"),
            listResource<unknown>("applications", "?page_size=1"),
          ]);
          setDeskCounts({ students: st.count, applications: ap.count });
        }
        if (hasContent) {
          const eventData = await listResource<EventItem>("events", "?page_size=100&ordering=event_date");
          const todayIso = new Date().toISOString().slice(0, 10);
          setEvents(eventData.results.filter((e) => e.event_date >= todayIso));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      }
    })();
  }, [user, hasLeads, hasContent, hasStudents]);

  const stats: { Icon: LucideIcon; value: number | null; label: string }[] = [
    ...(hasLeads
      ? [
          { Icon: Users, value: summary?.total ?? null, label: user?.role === "telecaller" ? "My leads" : "Total leads" },
          { Icon: Clock, value: summary?.today ?? null, label: "Follow-ups today" },
          { Icon: FileText, value: summary?.overdue ?? null, label: "Overdue follow-ups" },
        ]
      : []),
    ...(hasStudents
      ? [
          { Icon: Users, value: deskCounts?.students ?? null, label: "Students" },
          { Icon: FileText, value: deskCounts?.applications ?? null, label: "Applications" },
        ]
      : []),
    ...(hasContent ? [{ Icon: CalendarDays, value: events?.length ?? null, label: "Upcoming events" }] : []),
  ];
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Hello, <span className="text-violet-deep">{firstName}</span>
      </h1>
      <p className="mt-1 text-xs text-ink/65">Manage your consultancy operations efficiently.</p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <dl className="mt-8 grid gap-4 border-b border-hairline pb-6 sm:grid-cols-3 lg:grid-cols-6 sm:divide-x sm:divide-hairline">
        {stats.map(({ Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 sm:px-6 sm:first:pl-0">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-pale text-violet-deep">
              <Icon className="size-4.5" strokeWidth={1.8} />
            </span>
            <div>
              <dd className="text-sm font-medium text-violet-deep">{value ?? "—"}</dd>
              <dt className="text-[11px] text-ink/65">{label}</dt>
            </div>
          </div>
        ))}
      </dl>

      {hasLeads ? (
      <>
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink">Follow-ups due today</h2>
          <Link href="/admin/leads" className="inline-flex items-center gap-1 text-[11px] text-violet-deep">
            open leads <ArrowRight className="size-3" />
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-hairline border border-hairline">
          {dueToday?.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-3 text-xs">
              <div>
                <p className="font-medium text-ink">{l.name}</p>
                <a href={`tel:${l.phone}`} className="text-violet-deep">{l.phone}</a>
              </div>
              <span className="text-ink/70">
                {l.next_follow_up
                  ? new Date(l.next_follow_up).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                  : ""}
              </span>
            </li>
          ))}
          {dueToday && !dueToday.length ? (
            <li className="px-4 py-5 text-center text-xs text-stone">Nothing due today.</li>
          ) : null}
        </ul>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink">Recent Leads</h2>
          <Link href="/admin/leads" className="inline-flex items-center gap-1 text-[11px] text-violet-deep">
            view all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-xs">
            <thead>
              <tr className="bg-paper-2 text-ink">
                {["S.N", "Name", "Destination", "Level", "Status", "Received"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium first: last:">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-ink/80">
              {recent?.map((l, i) => (
                <tr key={l.id}>
                  <td className="px-4 py-3.5">{i + 1}</td>
                  <td className="px-4 py-3.5">{l.name}</td>
                  <td className="px-4 py-3.5">{l.destination_name || "—"}</td>
                  <td className="px-4 py-3.5">{LEVEL_LABELS[l.preferred_level] || "—"}</td>
                  <td className="px-4 py-3.5">{STATUS_LABELS[l.status]}</td>
                  <td className="px-4 py-3.5">{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent && !recent.length ? (
            <p className="py-6 text-center text-xs text-stone">No leads yet.</p>
          ) : null}
        </div>
      </section>

      </>
      ) : null}

      {hasContent ? (
      <>
      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink">Upcoming Events</h2>
        <div className="mt-4 flex flex-col gap-4">
          {events?.slice(0, 3).map((e) => {
            const d = new Date(`${e.event_date}T00:00:00`);
            const time = formatEventTime(e.start_time, e.end_time);
            return (
              <Link key={e.id} href={`/admin/events/${e.id}`} className="group flex items-center gap-4">
                <div className="flex size-14 shrink-0 flex-col items-center justify-center bg-violet-pale text-violet-deep">
                  <span className="text-base font-medium leading-none">{d.getDate()}</span>
                  <span className="mt-1 text-[10px] font-medium uppercase">
                    {d.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-ink group-hover:text-violet-deep">{e.title}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-ink/65">
                    {time ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" /> {time}
                      </span>
                    ) : null}
                    {e.venue ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" /> {e.venue}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
          {events && !events.length ? (
            <p className="text-xs text-stone">No upcoming events.</p>
          ) : null}
        </div>
      </section>

      </>
      ) : null}

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink">Quick Actions</h2>
        <div className="mt-4 grid max-w-md gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.filter(() => hasContent).map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 bg-violet-pale px-4 py-2.5 text-xs text-violet-deep transition-colors hover:bg-violet-pale/70"
            >
              <Icon className="size-4" strokeWidth={1.8} />+ {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
