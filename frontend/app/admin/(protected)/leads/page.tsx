"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Select } from "@/components/admin/FormField";
import { listResource, updateResource } from "@/lib/adminApi";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

function toCsv(leads: Lead[]): string {
  const header = ["Name", "Phone", "Email", "Destination", "Level", "Status", "Created", "Message"];
  const rows = leads.map((l) => [
    l.name,
    l.phone,
    l.email,
    l.destination_name,
    l.preferred_level,
    l.status,
    new Date(l.created_at).toLocaleString(),
    l.message.replace(/\n/g, " "),
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    try {
      const data = await listResource<Lead>("leads", "?ordering=-created_at&page_size=200");
      setLeads(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    load();
  }, []);

  const filtered = useMemo(
    () => (leads ? leads.filter((l) => statusFilter === "all" || l.status === statusFilter) : []),
    [leads, statusFilter]
  );

  async function handleStatusChange(lead: Lead, status: LeadStatus) {
    setLeads((prev) => prev?.map((l) => (l.id === lead.id ? { ...l, status } : l)) || null);
    try {
      await updateResource("leads", lead.id, { status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
      load();
    }
  }

  function handleExport() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexture-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        subtitle="Every inquiry submitted from the public site."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-md border border-hairline bg-white px-5 py-2.5 text-sm font-semibold hover:border-violet transition-colors"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone">Filter</span>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
          className="w-auto"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="rounded-2xl border border-hairline bg-white overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-stone">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Destination</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className={`border-b border-hairline last:border-0 cursor-pointer hover:bg-paper-2 ${
                    selected?.id === lead.id ? "bg-violet-pale" : ""
                  }`}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">{lead.name}</p>
                    <p className="text-xs text-stone">{lead.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-stone">{lead.destination_name || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs uppercase text-violet-deep">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-stone">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads !== null && filtered.length === 0 ? (
            <p className="text-sm text-stone p-6 text-center">No leads match this filter.</p>
          ) : null}
          {leads === null && !error ? (
            <p className="text-sm text-stone p-6 text-center">Loading…</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-hairline bg-white p-6 h-fit lg:sticky lg:top-6">
          {selected ? (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-display font-bold text-lg text-ink">{selected.name}</h2>
                <p className="text-sm text-stone">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-stone">Phone</dt>
                  <dd>
                    <a href={`tel:${selected.phone}`} className="text-violet-deep hover:underline">
                      {selected.phone}
                    </a>
                  </dd>
                </div>
                {selected.email ? (
                  <div className="flex justify-between">
                    <dt className="text-stone">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-violet-deep hover:underline"
                      >
                        {selected.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-stone">Destination</dt>
                  <dd>{selected.destination_name || "Not sure yet"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone">Level</dt>
                  <dd className="capitalize">{selected.preferred_level}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone">Source</dt>
                  <dd className="font-mono text-xs">{selected.source_page || "—"}</dd>
                </div>
              </dl>
              {selected.message ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">
                    Message
                  </p>
                  <p className="text-sm text-ink/75 leading-relaxed whitespace-pre-line">
                    {selected.message}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">
                  Status
                </p>
                <Select
                  value={selected.status}
                  onChange={(e) => {
                    const status = e.target.value as LeadStatus;
                    setSelected((s) => (s ? { ...s, status } : s));
                    handleStatusChange(selected, status);
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone">Select a lead to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
