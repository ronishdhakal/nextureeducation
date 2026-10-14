"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  MoreVertical,
  Plus,
  Search,
  Star,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { deleteResource, listResource } from "@/lib/adminApi";
import { ROLE_LABELS, type AdminRole } from "@/lib/adminContext";
import type { ListColumn, ResourceConfig } from "@/lib/adminResources";
import { loadRelationOptions } from "@/lib/adminRelations";
import { mediaUrl } from "@/lib/api";
import { getFlagSrc } from "@/lib/destinationFlags";
import { formatEventTime } from "@/lib/eventFormat";

type Row = Record<string, unknown>;

const PAGE_SIZE = 10;

function Badge({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium ${
        on ? "bg-mint/15 text-[#0d7a63]" : "bg-paper-2 text-stone"
      }`}
    >
      <span className={`size-1.5 rounded-full ${on ? "bg-[#0d7a63]" : "bg-stone-light"}`} />
      {on ? onLabel : offLabel}
    </span>
  );
}

const BADGE_GOOD = new Set([
  "Active",
  "Verified",
  "Completed",
  "Granted",
  "Enrolled",
  "Offer received",
  "Offer accepted",
  "Submitted",
]);
const BADGE_BAD = new Set(["Rejected", "Refused", "Withdrawn", "Cancelled", "No show"]);

const STATUS_TONE: Record<string, boolean> = {
  Upcoming: true,
  Published: true,
  Open: true,
  Completed: false,
  Draft: false,
};

function renderCell(col: ListColumn, row: Row, config: ResourceConfig) {
  const value = row[col.key];
  switch (col.kind) {
    case "badge": {
      const label = String(value ?? "");
      const tone = BADGE_BAD.has(label)
        ? "bg-red-50 text-red-700"
        : BADGE_GOOD.has(label)
          ? "bg-mint/15 text-[#0d7a63]"
          : "bg-violet-pale text-violet-deep";
      return <span className={`inline-block px-2.5 py-0.5 text-[11px] font-medium ${tone}`}>{label}</span>;
    }
    case "file-link":
      return value ? (
        <a
          href={mediaUrl(String(value)) || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-deep underline-offset-2 hover:underline"
        >
          View
        </a>
      ) : (
        "—"
      );
    case "appt-time": {
      const when = new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const t = String(row.time ?? "").slice(0, 5);
      const [h, m] = t.split(":").map(Number);
      const clock = t ? `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}` : "";
      return (
        <div className="whitespace-nowrap">
          {when}
          {clock ? <div className="text-[11px] text-ink/60">{clock}</div> : null}
        </div>
      );
    }
    case "status": {
      const label = config.statusOf?.(row) ?? "";
      return <Badge on={STATUS_TONE[label] ?? false} onLabel={label} offLabel={label} />;
    }
    case "rating":
      return (
        <span className="inline-flex gap-0.5 text-violet" aria-label={`${value} out of 5`}>
          {Array.from({ length: Number(value) || 0 }).map((_, i) => (
            <Star key={i} className="size-3 fill-current" strokeWidth={0} />
          ))}
        </span>
      );
    case "excerpt":
      return <span className="line-clamp-1 max-w-[14rem]">{String(value ?? "")}</span>;
    case "event-time": {
      const date = new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const time = formatEventTime(
        (row.start_time as string | null) ?? null,
        (row.end_time as string | null) ?? null
      );
      return (
        <div className="whitespace-nowrap">
          {date}
          {time ? <div className="text-[11px] text-ink/60">{time}</div> : null}
        </div>
      );
    }
    case "bool":
      return value ? (
        <span className="text-xs text-violet-deep">Yes</span>
      ) : (
        <span className="text-xs text-stone-light">—</span>
      );
    case "live":
      return <Badge on={Boolean(value)} onLabel="Open" offLabel="Draft" />;
    case "date":
      return value
        ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—";
    case "role":
      return (
        <span className=" bg-violet-pale px-2.5 py-0.5 text-[11px] font-medium text-violet-deep">
          {ROLE_LABELS[value as AdminRole] ?? String(value)}
        </span>
      );
    case "count":
      return String(value ?? 0);
    case "name-flag": {
      const flag = mediaUrl(row.flag_image as string | null) || getFlagSrc(String(row.slug || ""));
      return (
        <div className="flex items-center gap-2.5">
          {flag ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flag} alt="" className="size-6 rounded-full border border-hairline bg-white object-contain" />
          ) : (
            <span className="size-6 rounded-full border border-hairline bg-paper-2" />
          )}
          <span>{String(value ?? "")}</span>
        </div>
      );
    }
    default:
      return String(value ?? "") || "—";
  }
}

function RowMenu({ editHref, onDelete }: { editHref: string; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Row actions"
        aria-expanded={open}
        className=" p-1 text-ink/70 transition-colors hover:bg-violet-pale hover:text-violet-deep"
      >
        <MoreVertical className="size-4" />
      </button>
      {open ? (
        <div className="absolute right-0 z-10 mt-1 w-32 overflow-hidden border border-hairline bg-white py-1 text-left shadow-float">
          <Link href={editHref} className="block px-3.5 py-2 text-xs text-ink hover:bg-violet-tint">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-3.5 py-2 text-left text-xs text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none border border-violet/40 bg-white py-2 pl-3.5 pr-9 text-xs text-ink outline-none focus:border-violet"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink/60" />
    </div>
  );
}

export function GenericResourceList({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("default");
  const [facets, setFacets] = useState<Record<string, string>>({});
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, { value: number | string; label: string }[]>
  >({});

  useEffect(() => {
    config.filters
      ?.filter((f) => f.optionsFrom)
      .forEach((f) => {
        loadRelationOptions(f.optionsFrom!)
          .then((options) => setDynamicOptions((prev) => ({ ...prev, [f.key]: options })))
          .catch(() => {});
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);
  const [page, setPage] = useState(1);

  const hasStatus = config.listColumns.some((c) => c.kind === "live" || c.kind === "status");

  async function load() {
    try {
      const data = await listResource<Row>(
        config.resource,
        `?ordering=${config.ordering || "order"}&page_size=200`
      );
      setRows(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    let out = rows.filter((row) => {
      if (status !== "all") {
        const label = config.statusOf
          ? config.statusOf(row)
          : row.is_published
            ? "Open"
            : "Draft";
        if (label !== status) return false;
      }
      for (const [key, value] of Object.entries(facets)) {
        if (value && String(row[key] ?? "") !== value) return false;
      }
      if (!q) return true;
      return config.listColumns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(q));
    });
    if (sort === "newest") out = [...out].sort((a, b) => Number(b.id) - Number(a.id));
    if (sort === "oldest") out = [...out].sort((a, b) => Number(a.id) - Number(b.id));
    return out;
  }, [rows, query, status, sort, facets, config]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const offset = (current - 1) * PAGE_SIZE;

  async function handleDelete(id: number, label: string) {
    if (!window.confirm(`Delete ${label}? This can't be undone.`)) return;
    try {
      await deleteResource(config.resource, id);
      setRows((prev) => prev?.filter((r) => r.id !== id) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{config.pluralLabel}</h1>
          <p className="mt-1 text-xs text-ink/65">{config.description}</p>
        </div>
        <Link
          href={`${config.basePath}/new`}
          className="inline-flex items-center gap-2 bg-violet-pale px-6 py-3 text-xs font-medium text-violet-deep transition-colors hover:bg-violet hover:text-white"
        >
          <Plus className="size-3.5" /> {config.addLabel || `Add ${config.singularLabel}`}
        </Link>
      </div>

      {config.tabs && rows ? (
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-hairline" role="tablist">
          {[{ value: "", label: config.tabs.allLabel }, ...config.tabs.options].map((tab) => {
            const key = config.tabs!.key;
            const active = (facets[key] ?? "") === tab.value;
            const count = tab.value
              ? rows.filter((r) => String(r[key] ?? "") === tab.value).length
              : rows.length;
            return (
              <button
                key={tab.value || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFacets((prev) => ({ ...prev, [key]: tab.value }));
                  setPage(1);
                }}
                className={`-mb-px border-b-2 pb-3 text-xs transition-colors ${
                  active
                    ? "border-violet font-medium text-violet-deep"
                    : "border-transparent text-ink/70 hover:text-violet-deep"
                }`}
              >
                {tab.label} <span className="ml-1 text-ink/50">{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {config.stats && rows ? (
        <dl className="mt-8 grid gap-4 border-b border-hairline pb-6 sm:grid-cols-3 sm:divide-x sm:divide-hairline">
          {config.stats.map((st, i) => {
            const Icon = [CalendarDays, Timer, CheckCircle2][i % 3];
            return (
              <div key={st.label} className="flex items-center gap-3 sm:px-6 sm:first:pl-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-pale text-violet-deep">
                  <Icon className="size-4.5" strokeWidth={1.8} />
                </span>
                <div>
                  <dd className="text-sm font-medium text-violet-deep">{st.count(rows)}</dd>
                  <dt className="text-[11px] text-ink/65">{st.label}</dt>
                </div>
              </div>
            );
          })}
        </dl>
      ) : null}

      <div className={`${config.stats || config.tabs ? "mt-6" : "mt-8"} flex flex-wrap items-center justify-between gap-3`}>
        <label className="flex w-full max-w-xs items-center gap-2 border border-hairline bg-white px-3 py-2 focus-within:border-violet">
          <Search className="size-3.5 text-ink/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={config.searchPlaceholder || `Search ${config.pluralLabel.toLowerCase()}`}
            className="w-full bg-transparent text-xs outline-none placeholder:text-stone"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          {config.filters?.map((f) => (
            <FilterSelect
              key={f.key}
              value={facets[f.key] ?? ""}
              onChange={(v) => {
                setFacets((prev) => ({ ...prev, [f.key]: v }));
                setPage(1);
              }}
            >
              <option value="">{f.label}</option>
              {(f.options ?? dynamicOptions[f.key] ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>
          ))}
          {hasStatus ? (
            <FilterSelect
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <option value="all">Status</option>
              {(config.statuses ?? ["Open", "Draft"]).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </FilterSelect>
          ) : null}
          <FilterSelect value={sort} onChange={setSort}>
            <option value="default">Default order</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </FilterSelect>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="admin-scroll mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead>
            <tr className="bg-paper-2 text-ink">
              <th className=" px-4 py-3.5 font-medium">S.N</th>
              {config.listColumns.map((col) => (
                <th key={col.key} className="px-4 py-3.5 font-medium">
                  {col.label}
                </th>
              ))}
              <th className=" px-4 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-ink/85">
            {visible.map((row, i) => (
              <tr key={String(row.id)} className="transition-colors hover:bg-violet-tint/60">
                <td className="px-4 py-3.5">{offset + i + 1}</td>
                {config.listColumns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5">
                    {renderCell(col, row, config)}
                  </td>
                ))}
                <td className="px-4 py-3.5">
                  <RowMenu
                    editHref={`${config.basePath}/${row.id}`}
                    onDelete={() => handleDelete(row.id as number, String(row[config.titleField]))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows?.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-paper-2 text-stone-light">
              <Inbox className="size-5" />
            </span>
            <p className="text-sm text-stone">Nothing here yet.</p>
            <Link href={`${config.basePath}/new`} className="text-sm font-medium text-violet-deep hover:underline">
              Add the first {config.singularLabel.toLowerCase()}
            </Link>
          </div>
        ) : null}
        {rows && rows.length > 0 && filtered.length === 0 ? (
          <p className="p-8 text-center text-xs text-stone">No results match your filters.</p>
        ) : null}
        {rows === null && !error ? <p className="p-8 text-center text-xs text-stone">Loading…</p> : null}
      </div>

      {filtered.length ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink/70">
          <p>
            Showing {offset + 1}-{Math.min(offset + PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            {config.pluralLabel}
          </p>
          {pageCount > 1 ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                className=" p-1 hover:bg-violet-pale disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  aria-current={i + 1 === current}
                  className={`min-w-6  px-1.5 py-1 ${
                    i + 1 === current ? "bg-violet-pale font-medium text-violet-deep" : "hover:bg-violet-tint"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={current === pageCount}
                onClick={() => setPage(current + 1)}
                className=" p-1 hover:bg-violet-pale disabled:opacity-40"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
