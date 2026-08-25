"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteResource, listResource } from "@/lib/adminApi";
import type { ResourceConfig } from "@/lib/adminResources";

type Row = Record<string, unknown>;

function renderCell(value: unknown) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-mono bg-mint/15 text-[#0d7a63]">
        Yes
      </span>
    ) : (
      <span className="text-stone">—</span>
    );
  }
  return String(value ?? "—");
}

export function GenericResourceList({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await listResource<Row>(config.resource, "?ordering=order&page_size=100");
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
    <div>
      <AdminPageHeader
        title={config.pluralLabel}
        subtitle={config.description}
        action={
          <Link
            href={`${config.basePath}/new`}
            className="inline-flex items-center gap-2 rounded-full bg-violet text-white font-semibold px-5 py-2.5 text-sm hover:bg-violet-deep transition-colors"
          >
            <Plus className="size-4" /> New {config.singularLabel.toLowerCase()}
          </Link>
        }
      />

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <div className="rounded-2xl border border-hairline bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs font-mono uppercase tracking-wide text-stone">
              {config.listColumns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row) => (
              <tr key={String(row.id)} className="border-b border-hairline last:border-0">
                {config.listColumns.map((col) => (
                  <td key={col.key} className="px-5 py-3 text-ink">
                    {renderCell(row[col.key])}
                  </td>
                ))}
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`${config.basePath}/${row.id}`}
                      className="text-stone hover:text-violet-deep"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id as number, String(row[config.titleField]))}
                      className="text-stone hover:text-red-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows?.length === 0 ? (
          <p className="text-sm text-stone p-6 text-center">Nothing here yet.</p>
        ) : null}
        {rows === null && !error ? (
          <p className="text-sm text-stone p-6 text-center">Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
