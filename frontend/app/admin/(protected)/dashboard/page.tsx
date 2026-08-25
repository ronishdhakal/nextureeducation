"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Globe2, Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { listResource } from "@/lib/adminApi";
import type { Destination, Lead } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};

export default function DashboardPage() {
  const [leadCounts, setLeadCounts] = useState<Record<string, number> | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [destinationCount, setDestinationCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [leads, destinations] = await Promise.all([
          listResource<Lead>("leads", "?page_size=100&ordering=-created_at"),
          listResource<Destination>("destinations", "?page_size=1"),
        ]);
        const counts: Record<string, number> = { new: 0, contacted: 0, qualified: 0, closed: 0 };
        leads.results.forEach((l) => {
          counts[l.status] = (counts[l.status] || 0) + 1;
        });
        setLeadCounts(counts);
        setRecentLeads(leads.results.slice(0, 5));
        setDestinationCount(destinations.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
      }
    })();
  }, []);

  return (
    <div>
      <AdminPageHeader title="Dashboard" subtitle="A quick look at what needs attention." />

      {error ? <p className="text-sm text-red-600 mb-6">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-2xl border border-hairline bg-white p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-stone">{label}</p>
            <p className="mt-2 font-display font-extrabold text-3xl text-ink">
              {leadCounts ? leadCounts[key] ?? 0 : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="rounded-2xl border border-hairline bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink flex items-center gap-2">
              <Users className="size-4 text-violet" /> Recent leads
            </h2>
            <Link
              href="/admin/leads"
              className="text-sm text-violet-deep font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {recentLeads.length ? (
            <ul className="divide-y divide-hairline">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink">{lead.name}</p>
                    <p className="text-stone">{lead.phone}</p>
                  </div>
                  <span className="font-mono text-xs uppercase text-violet-deep">
                    {STATUS_LABELS[lead.status]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone">No leads yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-hairline bg-white p-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-ink flex items-center gap-2">
            <Globe2 className="size-4 text-violet" /> Quick links
          </h2>
          <Link
            href="/admin/destinations"
            className="text-sm rounded-xl bg-paper-2 px-4 py-3 hover:bg-violet-pale transition-colors"
          >
            {destinationCount ?? "—"} destinations published
          </Link>
          <Link
            href="/admin/destinations/new"
            className="text-sm rounded-xl bg-paper-2 px-4 py-3 hover:bg-violet-pale transition-colors"
          >
            + Add a new destination
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm rounded-xl bg-paper-2 px-4 py-3 hover:bg-violet-pale transition-colors"
          >
            Edit site settings
          </Link>
        </div>
      </div>
    </div>
  );
}
