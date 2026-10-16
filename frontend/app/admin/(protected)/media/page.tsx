"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Copy, FileText, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface MediaFile {
  key: string;
  name: string;
  folder: string;
  size: number;
  modified: string;
  url: string;
  is_image: boolean;
  in_use: boolean;
}

interface LibraryResponse {
  count: number;
  total_size: number;
  page: number;
  page_size: number;
  folders: { name: string; count: number }[];
  results: MediaFile[];
}

const PAGE_SIZE = 24;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function MediaLibraryPage() {
  const [data, setData] = useState<LibraryResponse | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("");
  const [page, setPage] = useState(1);
  // Selection survives paging and searching until cleared.
  const [selected, setSelected] = useState<Map<string, MediaFile>>(new Map());
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState("");

  // debounce the search box
  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(query);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setError("");
    const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
    if (search) params.set("q", search);
    if (folder) params.set("folder", folder);
    try {
      const res = await fetch(`/api/admin/proxy/media/library?${params}`);
      if (res.status === 401) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hard reload clears stale state
        window.location.href = "/admin/login";
        return;
      }
      if (!res.ok) throw new Error(res.status === 403 ? "Only admins can open the media library." : "Failed to load files.");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load files.");
    }
  }, [page, search, folder]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on filter change
    load();
  }, [load]);

  const pageFiles = data?.results ?? [];
  const allOnPageSelected = pageFiles.length > 0 && pageFiles.every((f) => selected.has(f.key));
  const pageCount = data ? Math.max(1, Math.ceil(data.count / data.page_size)) : 1;
  const selectedInUse = [...selected.values()].filter((f) => f.in_use).length;

  function toggle(file: MediaFile) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(file.key)) next.delete(file.key);
      else next.set(file.key, file);
      return next;
    });
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Map(prev);
      if (allOnPageSelected) pageFiles.forEach((f) => next.delete(f.key));
      else pageFiles.forEach((f) => next.set(f.key, f));
      return next;
    });
  }

  async function handleDelete() {
    const count = selected.size;
    if (!count) return;
    let force = false;
    if (selectedInUse) {
      force = window.confirm(
        `${selectedInUse} of the ${count} selected file(s) are still used on the site (a page, destination, document or editor content). Deleting them will leave broken images.\n\nPress OK to delete ALL ${count} anyway, or Cancel to keep the in-use ones and delete only the rest.`
      );
    }
    if (!force && !window.confirm(`Delete ${count - (selectedInUse && !force ? selectedInUse : 0)} file(s) permanently? This can't be undone.`)) {
      return;
    }
    setDeleting(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/admin/proxy/media/library/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: [...selected.keys()], force }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.detail || "Delete failed.");
      const skipped = result.skipped_in_use?.length ?? 0;
      setNotice(
        `Deleted ${result.deleted.length} file(s).${skipped ? ` Kept ${skipped} file(s) that are still in use.` : ""}`
      );
      setSelected(new Map());
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  async function copyUrl(file: MediaFile) {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopied(file.key);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      window.prompt("Copy this link", file.url);
    }
  }

  return (
    <div className="max-w-6xl pb-24">
      <h1 className="font-display text-2xl font-semibold text-ink">Media Library</h1>
      <p className="mt-1 text-xs text-ink/65">
        Every file in your media bucket. Search by name, select several and delete the ones you no longer need.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <label className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-hairline bg-white px-3 py-2 focus-within:border-violet">
          <Search className="size-3.5 text-ink/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name"
            className="w-full bg-transparent text-xs outline-none placeholder:text-stone"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink/70">
          {data ? (
            <span>
              {data.count} file{data.count === 1 ? "" : "s"} · {formatSize(data.total_size)}
            </span>
          ) : null}
          <div className="relative">
            <select
              value={folder}
              onChange={(e) => {
                setFolder(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-lg border border-violet/40 bg-white py-2 pl-3.5 pr-9 text-xs text-ink outline-none focus:border-violet"
            >
              <option value="">All folders</option>
              {data?.folders.map((f) => (
                <option key={f.name || "root"} value={f.name}>
                  {(f.name || "(top level)") + ` (${f.count})`}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink/60" />
          </div>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="mt-4 text-sm text-[#0d7a63]">{notice}</p> : null}

      <div className="admin-scroll mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-xs">
          <thead>
            <tr className="bg-paper-2 text-ink">
              <th className="w-10 rounded-l-md px-4 py-3.5">
                <input
                  type="checkbox"
                  aria-label="Select all files on this page"
                  checked={allOnPageSelected}
                  onChange={togglePage}
                  className="size-4 accent-violet"
                />
              </th>
              <th className="px-4 py-3.5 font-medium">File</th>
              <th className="px-4 py-3.5 font-medium">Folder</th>
              <th className="px-4 py-3.5 font-medium">Size</th>
              <th className="px-4 py-3.5 font-medium">Uploaded</th>
              <th className="px-4 py-3.5 font-medium">Used</th>
              <th className="rounded-r-md px-4 py-3.5 font-medium">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-ink/85">
            {pageFiles.map((f) => (
              <tr
                key={f.key}
                className={`transition-colors ${selected.has(f.key) ? "bg-violet-pale/60" : "hover:bg-violet-tint/60"}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${f.name}`}
                    checked={selected.has(f.key)}
                    onChange={() => toggle(f)}
                    className="size-4 accent-violet"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-hairline bg-paper-2"
                    >
                      {f.is_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.url} alt="" loading="lazy" className="size-full object-cover" />
                      ) : (
                        <FileText className="size-5 text-ink/50" />
                      )}
                    </a>
                    <span className="max-w-[16rem] break-all font-medium text-ink">{f.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{f.folder || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatSize(f.size)}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {new Date(f.modified).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  {f.in_use ? (
                    <span className="bg-mint/15 px-2.5 py-0.5 text-[11px] font-medium text-[#0d7a63]">In use</span>
                  ) : (
                    <span className="bg-paper-2 px-2.5 py-0.5 text-[11px] text-stone">Unused</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => copyUrl(f)}
                    className="inline-flex items-center gap-1.5 text-violet-deep hover:underline"
                  >
                    <Copy className="size-3.5" />
                    {copied === f.key ? "Copied" : "Copy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && !pageFiles.length ? (
          <p className="p-8 text-center text-xs text-stone">
            {search || folder ? "No files match your search." : "The bucket is empty."}
          </p>
        ) : null}
        {!data && !error ? <p className="p-8 text-center text-xs text-stone">Loading…</p> : null}
      </div>

      {data && pageCount > 1 ? (
        <div className="mt-4 flex items-center justify-between text-[11px] text-ink/70">
          <p>
            Page {data.page} of {pageCount}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded p-1 hover:bg-violet-pale disabled:opacity-40"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= pageCount}
              onClick={() => setPage(page + 1)}
              className="rounded p-1 hover:bg-violet-pale disabled:opacity-40"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {selected.size ? (
        <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-hairline bg-white px-5 py-3 shadow-float md:left-[calc(50%+8rem)]">
          <span className="text-sm text-ink">
            <strong>{selected.size}</strong> selected
            {selectedInUse ? <span className="text-stone"> · {selectedInUse} in use</span> : null}
          </span>
          <button
            type="button"
            onClick={() => setSelected(new Map())}
            className="text-xs text-ink/70 hover:text-violet-deep"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            <Trash2 className="size-3.5" />
            {deleting ? "Deleting…" : "Delete selected"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
