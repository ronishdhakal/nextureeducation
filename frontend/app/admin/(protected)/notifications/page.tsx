"use client";

import { CheckCheck, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { listResource, updateResource } from "@/lib/adminApi";

interface NotificationItem {
  id: number;
  type: string;
  type_display: string;
  message: string;
  related_to: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

const PAGE_SIZE = 10;

function Select({
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
        className="appearance-none border border-violet/40 bg-white py-2 pl-3.5 pr-9 text-xs text-ink outline-none focus:border-violet rounded-box"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink/60" />
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    listResource<NotificationItem>("notifications", "?page_size=200&ordering=-created_at")
      .then((d) => setItems(d.results))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load notifications."));
  }, []);

  const types = useMemo(() => {
    const seen = new Map<string, string>();
    items?.forEach((n) => seen.set(n.type, n.type_display));
    return [...seen.entries()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = (items ?? []).filter(
      (n) =>
        (!type || n.type === type) &&
        (!status || (status === "unread") === !n.is_read) &&
        (!q || n.message.toLowerCase().includes(q) || n.type_display.toLowerCase().includes(q))
    );
    return sort === "oldest" ? [...out].reverse() : out;
  }, [items, query, type, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const offset = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(offset, offset + PAGE_SIZE);
  const unread = items?.filter((n) => !n.is_read).length ?? 0;

  async function markAllRead() {
    setItems((prev) => prev?.map((n) => ({ ...n, is_read: true })) ?? null);
    try {
      await fetch("/api/admin/proxy/notifications/mark_all_read", { method: "POST" });
      window.dispatchEvent(new Event("notifications:changed"));
    } catch {
      setError("Failed to mark notifications as read.");
    }
  }

  async function open(n: NotificationItem) {
    if (!n.is_read) {
      setItems((prev) => prev?.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)) ?? null);
      updateResource("notifications", n.id, { is_read: true })
        .then(() => window.dispatchEvent(new Event("notifications:changed")))
        .catch(() => {});
    }
    if (n.link) router.push(n.link);
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
          <p className="mt-1 text-xs text-ink/65">
            Stay updated with the latest activities, updates and important messages.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={!unread}
          className="inline-flex items-center gap-2 bg-violet-pale px-6 py-3 text-xs font-medium text-violet-deep transition-colors hover:bg-violet hover:text-white disabled:opacity-50 rounded-box"
        >
          <CheckCheck className="size-4" /> Mark all as read
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <label className="flex w-full max-w-xs items-center gap-2 border border-hairline bg-white px-3 py-2 focus-within:border-violet rounded-box">
          <Search className="size-3.5 text-ink/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search notification"
            className="w-full bg-transparent text-xs outline-none placeholder:text-stone"
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <Select value={type} onChange={(v) => { setType(v); setPage(1); }}>
            <option value="">Types</option>
            {types.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }}>
            <option value="">Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </Select>
          <Select value={sort} onChange={setSort}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </Select>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="admin-scroll mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-xs">
          <thead>
            <tr className="bg-paper-2 text-ink">
              {["S.N", "Type", "Message", "Related to", "Date", "Status"].map((h, i, all) => (
                <th
                  key={h}
                  className={`px-4 py-3.5 font-medium ${i === 0 ? "" : ""} ${i === all.length - 1 ? "" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-ink/85">
            {visible.map((n, i) => (
              <tr
                key={n.id}
                onClick={() => open(n)}
                className="cursor-pointer transition-colors hover:bg-violet-tint/60"
              >
                <td className="px-4 py-3.5">{offset + i + 1}</td>
                <td className={`px-4 py-3.5 ${n.is_read ? "" : "font-medium text-ink"}`}>{n.type_display}</td>
                <td className="max-w-sm px-4 py-3.5">{n.message}</td>
                <td className="px-4 py-3.5">{n.related_to || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  {new Date(n.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3.5">
                  <span className={n.is_read ? "text-stone" : "font-medium text-violet-deep"}>
                    {n.is_read ? "Read" : "Unread"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items && !filtered.length ? (
          <p className="p-8 text-center text-xs text-stone">
            {items.length ? "No notifications match your filters." : "You're all caught up."}
          </p>
        ) : null}
        {items === null && !error ? <p className="p-8 text-center text-xs text-stone">Loading…</p> : null}
      </div>

      {filtered.length ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink/70">
          <p>
            Showing {offset + 1}-{Math.min(offset + PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            Notifications
          </p>
          {pageCount > 1 ? (
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  aria-current={i + 1 === current}
                  className={`rounded-md min-w-6  px-1.5 py-1 ${
                    i + 1 === current ? "bg-violet-pale font-medium text-violet-deep" : "hover:bg-violet-tint"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
