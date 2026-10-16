"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Download,
  Flame,
  Mail,
  Phone,
  PhoneCall,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Select, TextArea, TextInput } from "@/components/admin/FormField";
import { createResource, deleteResource, listResource, updateResource } from "@/lib/adminApi";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/adminContext";
import type {
  AssignableUser,
  CallLog,
  CallOutcome,
  Lead,
  LeadStatus,
  LeadTemperature,
} from "@/lib/types";

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
];

const STATUS_META: Record<LeadStatus, string> = {
  new: "bg-violet-pale text-violet-deep",
  contacted: "bg-violet/15 text-violet-deep",
  qualified: "bg-mint/15 text-[#0d7a63]",
  closed: "bg-paper-2 text-stone",
};

const TEMPERATURES: { value: LeadTemperature; label: string; dot: string; text: string }[] = [
  { value: "hot", label: "Hot", dot: "bg-red-600", text: "text-red-600" },
  { value: "warm", label: "Warm", dot: "bg-violet", text: "text-violet-deep" },
  { value: "cold", label: "Cold", dot: "bg-stone-light", text: "text-stone" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const OUTCOMES: { value: CallOutcome; label: string }[] = [
  { value: "connected", label: "Connected" },
  { value: "no_answer", label: "No answer" },
  { value: "voicemail", label: "Left voicemail" },
  { value: "wrong_number", label: "Wrong number" },
  { value: "follow_up_scheduled", label: "Follow-up scheduled" },
];

function outcomeLabel(value: CallOutcome): string {
  return OUTCOMES.find((o) => o.value === value)?.label || value;
}

function temperatureMeta(value: LeadTemperature) {
  return TEMPERATURES.find((t) => t.value === value) || TEMPERATURES[1];
}

function TemperatureDot({ value }: { value: LeadTemperature }) {
  const meta = temperatureMeta(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${meta.dot}`} />
      <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
    </span>
  );
}

function StatusPill({ value }: { value: LeadStatus }) {
  const label = STATUSES.find((s) => s.value === value)?.label || value;
  return (
    <span
      className={`inline-flex px-2.5 py-1 text-xs font-semibold ${STATUS_META[value]}`}
    >
      {label}
    </span>
  );
}

function isOverdue(lead: Lead): boolean {
  return !!lead.next_follow_up && new Date(lead.next_follow_up) < new Date();
}

function isDueToday(lead: Lead): boolean {
  if (!lead.next_follow_up) return false;
  const d = new Date(lead.next_follow_up);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function FollowUpCell({ lead }: { lead: Lead }) {
  if (!lead.next_follow_up) {
    return <span className="text-xs text-stone">—</span>;
  }
  const overdue = isOverdue(lead);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        overdue ? "text-red-600" : "text-violet-deep"
      }`}
    >
      {overdue ? <AlertTriangle className="size-3.5" /> : null}
      {new Date(lead.next_follow_up).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
    </span>
  );
}

function CallLogPanel({ lead, onLogged }: { lead: Lead; onLogged: () => void }) {
  const [logs, setLogs] = useState<CallLog[] | null>(null);
  const [outcome, setOutcome] = useState<CallOutcome>("connected");
  const [notes, setNotes] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await listResource<CallLog>(
        "call-logs",
        `?lead=${lead.id}&ordering=-created_at&page_size=100`
      );
      setLogs(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load call logs.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch on lead change
    setLogs(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createResource("call-logs", {
        lead: lead.id,
        outcome,
        notes,
        follow_up_at: followUpAt ? new Date(followUpAt).toISOString() : null,
      });
      setNotes("");
      setFollowUpAt("");
      setOutcome("connected");
      await load();
      onLogged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save call log.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setLogs((prev) => prev?.filter((l) => l.id !== id) || null);
    try {
      await deleteResource("call-logs", id);
      onLogged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete call log.");
      load();
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">Call log</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 border border-hairline bg-paper-2 p-3.5 rounded-box">
        <div className="grid grid-cols-2 gap-2.5">
          <Select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as CallOutcome)}
            className="text-xs"
          >
            {OUTCOMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <TextInput
            type="datetime-local"
            value={followUpAt}
            onChange={(e) => setFollowUpAt(e.target.value)}
            className="text-xs"
            title="Next follow-up (optional)"
          />
        </div>
        <TextArea
          rows={2}
          placeholder="What was discussed…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-xs"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 self-start bg-violet text-white font-semibold px-4 py-2 text-xs transition-colors hover:bg-violet-deep disabled:opacity-60 rounded-box"
        >
          <PhoneCall className="size-3.5" /> {saving ? "Saving…" : "Log call"}
        </button>
      </form>

      {error ? <p className="text-xs text-red-600 mt-2">{error}</p> : null}

      <div className="flex flex-col gap-2.5 mt-3">
        {logs === null ? <p className="text-xs text-stone">Loading…</p> : null}
        {logs !== null && logs.length === 0 ? (
          <p className="text-xs text-stone">No calls logged yet.</p>
        ) : null}
        {logs?.map((log) => (
          <div key={log.id} className=" border border-hairline p-3 text-xs group rounded-box">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-violet-deep uppercase tracking-wide">
                {outcomeLabel(log.outcome)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-stone">{new Date(log.created_at).toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(log.id)}
                  aria-label="Delete call log"
                  className="text-stone-light hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            {log.notes ? <p className="text-ink/75 mt-1.5 leading-relaxed">{log.notes}</p> : null}
            <div className="flex items-center gap-3 mt-1.5 text-stone">
              {log.created_by_username ? <span>by {log.created_by_username}</span> : null}
              {log.follow_up_at ? (
                <span className="text-violet-deep">
                  Follow up {new Date(log.follow_up_at).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function toCsv(leads: Lead[]): string {
  const header = [
    "Name",
    "Phone",
    "Email",
    "Destination",
    "Level",
    "Temperature",
    "Status",
    "Next follow-up",
    "Created",
    "Message",
  ];
  const rows = leads.map((l) => [
    l.name,
    l.phone,
    l.email,
    l.destination_name,
    l.preferred_level,
    l.temperature,
    l.status,
    l.next_follow_up ? new Date(l.next_follow_up).toLocaleString() : "",
    new Date(l.created_at).toLocaleString(),
    l.message.replace(/\n/g, " "),
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [temperatureFilter, setTemperatureFilter] = useState<LeadTemperature | "all">("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dueOnly, setDueOnly] = useState(false);
  const [tab, setTab] = useState<"all" | "today" | "overdue" | "unassigned" | "mine">("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [staff, setStaff] = useState<AssignableUser[]>([]);
  const { user } = useAdmin();
  const router = useRouter();
  const [converting, setConverting] = useState(false);
  const canAssign = user?.role === "admin" || user?.role === "counsellor";
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  async function load() {
    try {
      const data = await listResource<Lead>("leads", "?ordering=-created_at&page_size=200");
      setLeads(data.results);
      return data.results;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads.");
      return null;
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    load();
  }, []);

  useEffect(() => {
    if (!canAssign) return;
    fetch("/api/admin/proxy/users/assignable")
      .then((r) => (r.ok ? r.json() : []))
      .then(setStaff)
      .catch(() => {});
  }, [canAssign]);

  async function handleConvert(lead: Lead) {
    if (!window.confirm(`Create a student record for ${lead.name}? Their details carry over.`)) return;
    setConverting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/proxy/leads/${lead.id}/convert`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (Array.isArray(data) ? data[0] : data.detail) || "Could not convert this inquiry."
        );
      }
      router.push(`/admin/students/${data.student}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not convert this inquiry.");
      setConverting(false);
    }
  }

  async function handleAssign(lead: Lead, value: string) {
    const assigned_to = value ? Number(value) : null;
    const name = staff.find((u) => u.id === assigned_to)?.name || "";
    const patch = { assigned_to, assigned_to_name: name };
    setLeads((prev) => prev?.map((l) => (l.id === lead.id ? { ...l, ...patch } : l)) || null);
    setSelected((s) => (s && s.id === lead.id ? { ...s, ...patch } : s));
    try {
      await updateResource("leads", lead.id, { assigned_to });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign lead.");
      load();
    }
  }

  async function handleCallLogged() {
    const fresh = await load();
    const updated = fresh?.find((l) => l.id === selected?.id);
    if (updated) setSelected(updated);
  }

  const destinations = useMemo(() => {
    if (!leads) return [];
    const names = new Set(leads.map((l) => l.destination_name).filter(Boolean));
    return Array.from(names).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    if (!leads) return [];
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (q) {
        const haystack = `${l.name} ${l.phone} ${l.email}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (temperatureFilter !== "all" && l.temperature !== temperatureFilter) return false;
      if (destinationFilter !== "all" && l.destination_name !== destinationFilter) return false;
      if (dueOnly && !(isOverdue(l) || isDueToday(l))) return false;
      const open = l.status !== "closed";
      if (tab === "today" && !(open && isDueToday(l))) return false;
      if (tab === "overdue" && !(open && isOverdue(l))) return false;
      if (tab === "unassigned" && l.assigned_to) return false;
      if (tab === "mine" && l.assigned_to !== user?.id) return false;
      if (assigneeFilter !== "all" && String(l.assigned_to ?? "") !== assigneeFilter) return false;
      const created = new Date(l.created_at);
      if (dateFrom && created < new Date(dateFrom)) return false;
      if (dateTo && created > new Date(`${dateTo}T23:59:59`)) return false;
      return true;
    });
  }, [
    leads,
    query,
    statusFilter,
    temperatureFilter,
    destinationFilter,
    dateFrom,
    dateTo,
    dueOnly,
    tab,
    assigneeFilter,
    user?.id,
  ]);

  const stats = useMemo(() => {
    const all = leads || [];
    return {
      total: all.length,
      hot: all.filter((l) => l.temperature === "hot").length,
      due: all.filter((l) => isOverdue(l) || isDueToday(l)).length,
    };
  }, [leads]);

  async function handleStatusChange(lead: Lead, status: LeadStatus) {
    setLeads((prev) => prev?.map((l) => (l.id === lead.id ? { ...l, status } : l)) || null);
    try {
      await updateResource("leads", lead.id, { status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
      load();
    }
  }

  async function handleTemperatureChange(lead: Lead, temperature: LeadTemperature) {
    setLeads((prev) => prev?.map((l) => (l.id === lead.id ? { ...l, temperature } : l)) || null);
    try {
      await updateResource("leads", lead.id, { temperature });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update temperature.");
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
        title="Inquiries"
        subtitle="Every inquiry from the website and walk-ins, with call logs and follow-ups."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 border border-hairline bg-white px-5 py-2.5 text-sm font-semibold hover:border-violet transition-colors rounded-box"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className=" border border-hairline bg-white p-4 flex items-center gap-3 transition-shadow hover:shadow-[0_1px_3px_rgba(23,11,34,0.06)] rounded-box">
          <span className="inline-flex size-10 items-center justify-center bg-violet-pale text-violet-deep shrink-0">
            <Users className="size-4.5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display font-extrabold text-2xl text-ink leading-none">{stats.total}</p>
            <p className="text-xs text-stone mt-1.5">Total leads</p>
          </div>
        </div>
        <div className=" border border-hairline bg-white p-4 flex items-center gap-3 transition-shadow hover:shadow-[0_1px_3px_rgba(23,11,34,0.06)] rounded-box">
          <span className="inline-flex size-10 items-center justify-center bg-red-50 text-red-600 shrink-0">
            <Flame className="size-4.5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display font-extrabold text-2xl text-ink leading-none">{stats.hot}</p>
            <p className="text-xs text-stone mt-1.5">Hot leads</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDueOnly((v) => !v)}
          className={`rounded-box border p-4 flex items-center gap-3 text-left transition-all ${
            dueOnly
              ? "border-violet bg-violet-pale shadow-[0_1px_3px_rgba(23,11,34,0.06)]"
              : "border-hairline bg-white hover:border-violet/40 hover:shadow-[0_1px_3px_rgba(23,11,34,0.06)]"
          }`}
        >
          <span className="inline-flex size-10 items-center justify-center bg-violet-pale text-violet-deep shrink-0">
            <AlertTriangle className="size-4.5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display font-extrabold text-2xl text-ink leading-none">{stats.due}</p>
            <p className="text-xs text-stone mt-1.5">Follow-ups due</p>
          </div>
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "All leads", leads?.length ?? 0],
            ["today", "Follow-up today", leads?.filter((l) => l.status !== "closed" && isDueToday(l)).length ?? 0],
            ["overdue", "Overdue", leads?.filter((l) => l.status !== "closed" && isOverdue(l)).length ?? 0],
            ...(canAssign
              ? ([["unassigned", "Unassigned", leads?.filter((l) => !l.assigned_to).length ?? 0]] as const)
              : []),
            ["mine", "Assigned to me", leads?.filter((l) => l.assigned_to === user?.id).length ?? 0],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-box px-4 py-2 text-xs font-medium transition-colors ${
              tab === key
                ? "bg-violet text-white shadow-sm shadow-violet/25"
                : "border border-hairline bg-white text-ink/80 hover:border-violet"
            }`}
          >
            {label} <span className={tab === key ? "text-white/80" : "text-stone"}>{count}</span>
          </button>
        ))}
      </div>

      <div className="mb-5 border border-hairline bg-white overflow-hidden rounded-box">
        <div className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-light" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone or email…"
              className="w-full bg-paper-2 border border-hairline pl-9 pr-3.5 py-2.5 text-sm outline-none focus:border-violet focus:ring-4 focus:ring-violet/10 focus:bg-white transition-all rounded-box"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 px-4 pb-4 pt-1 border-t border-hairline">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1 mt-3">Status</p>
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1 mt-3">Temperature</p>
            <Select
              value={temperatureFilter}
              onChange={(e) => setTemperatureFilter(e.target.value as LeadTemperature | "all")}
              className="w-auto"
            >
              <option value="all">All temperatures</option>
              {TEMPERATURES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1 mt-3">Destination</p>
            <Select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-auto"
            >
              <option value="all">All destinations</option>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          {canAssign ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1 mt-3">Assigned to</p>
              <Select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-auto"
              >
                <option value="all">Anyone</option>
                {staff.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
          <span className="w-px h-9 bg-hairline hidden sm:block" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1 mt-3">Received from</p>
            <TextInput
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-auto"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1 mt-3">Received to</p>
            <TextInput
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-auto"
            />
          </div>
          {query ||
          statusFilter !== "all" ||
          temperatureFilter !== "all" ||
          destinationFilter !== "all" ||
          dateFrom ||
          dateTo ||
          dueOnly ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setTemperatureFilter("all");
                setDestinationFilter("all");
                setDateFrom("");
                setDateTo("");
                setDueOnly(false);
              }}
              className="mb-2.5 text-xs font-semibold text-stone hover:text-violet-deep underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {leads ? (
        <p className="text-xs text-stone mb-3 -mt-2">
          {filtered.length === leads.length
            ? `${leads.length} lead${leads.length === 1 ? "" : "s"}`
            : `${filtered.length} of ${leads.length} leads`}
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="admin-scroll border border-hairline bg-white overflow-hidden overflow-x-auto rounded-box">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-paper-2 text-left text-xs font-semibold uppercase tracking-wide text-stone">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Temp.</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Next follow-up</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const isSelected = selected?.id === lead.id;
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className={`relative border-b border-hairline last:border-0 cursor-pointer transition-colors ${
                      isSelected ? "bg-violet-pale" : "hover:bg-paper-2"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {isSelected ? (
                        <span className="absolute inset-y-0 left-0 w-0.5 bg-violet" />
                      ) : null}
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet-pale text-violet-deep text-xs font-bold shrink-0">
                          {initials(lead.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-ink whitespace-nowrap">{lead.name}</p>
                          <p className="text-xs text-stone whitespace-nowrap">{lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone whitespace-nowrap">
                      {lead.destination_name || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <TemperatureDot value={lead.temperature} />
                    </td>
                    <td className="px-4 py-3 text-xs text-stone whitespace-nowrap">
                      {lead.assigned_to_name || (canAssign ? "Unassigned" : "—")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusPill value={lead.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <FollowUpCell lead={lead} />
                    </td>
                    <td className="px-4 py-3 text-xs text-stone whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {leads !== null && filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-paper-2 text-stone-light">
                <Search className="size-5" />
              </span>
              <p className="text-sm text-stone">No leads match this filter.</p>
            </div>
          ) : null}
          {leads === null && !error ? (
            <p className="text-sm text-stone p-8 text-center">Loading…</p>
          ) : null}
        </div>

        <div className=" border border-hairline bg-white p-6 h-fit lg:sticky lg:top-6 rounded-box">
          {selected ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-violet-pale text-violet-deep font-display font-bold text-sm shrink-0">
                  {initials(selected.name)}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-lg text-ink truncate">
                    {selected.name}
                  </h2>
                  <p className="text-xs text-stone">
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${selected.phone}`}
                  className="inline-flex items-center justify-center gap-2 border border-hairline py-2.5 text-sm font-semibold text-ink hover:border-violet hover:text-violet-deep transition-colors rounded-box"
                >
                  <Phone className="size-4" /> Call
                </a>
                {selected.email ? (
                  <a
                    href={`mailto:${selected.email}`}
                    className="inline-flex items-center justify-center gap-2 border border-hairline py-2.5 text-sm font-semibold text-ink hover:border-violet hover:text-violet-deep transition-colors rounded-box"
                  >
                    <Mail className="size-4" /> Email
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 border border-hairline py-2.5 text-sm font-semibold text-stone-light rounded-box">
                    <Mail className="size-4" /> No email
                  </span>
                )}
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
                {selected.next_follow_up ? (
                  <div className="flex justify-between">
                    <dt className="text-stone">Next follow-up</dt>
                    <dd className={isOverdue(selected) ? "text-red-600 font-semibold" : "text-violet-deep font-semibold"}>
                      {new Date(selected.next_follow_up).toLocaleString()}
                    </dd>
                  </div>
                ) : null}
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

              {canAssign ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">
                    Assigned to
                  </p>
                  <Select
                    value={selected.assigned_to ?? ""}
                    onChange={(e) => handleAssign(selected, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {staff.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </Select>
                </div>
              ) : selected.assigned_to_name ? (
                <p className="text-xs text-stone">
                  Assigned to <span className="font-medium text-ink">{selected.assigned_to_name}</span>
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone mb-1.5">
                    Temperature
                  </p>
                  <Select
                    value={selected.temperature}
                    onChange={(e) => {
                      const temperature = e.target.value as LeadTemperature;
                      setSelected((s) => (s ? { ...s, temperature } : s));
                      handleTemperatureChange(selected, temperature);
                    }}
                  >
                    {TEMPERATURES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {canAssign ? (
                <button
                  type="button"
                  onClick={() => handleConvert(selected)}
                  disabled={converting}
                  className="inline-flex w-full items-center justify-center gap-2 border border-violet px-4 py-2.5 text-sm font-semibold text-violet-deep transition-colors hover:bg-violet-pale disabled:opacity-60 rounded-box"
                >
                  {converting ? "Creating student…" : "Convert to student"}
                </button>
              ) : null}

              <CallLogPanel lead={selected} onLogged={handleCallLogged} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 text-center py-10">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-paper-2 text-stone-light">
                <UserRound className="size-5" />
              </span>
              <p className="text-sm text-stone max-w-[16rem]">
                Select a lead from the list to see their details and call history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
