"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteResource, listResource } from "@/lib/adminApi";
import type { Destination } from "@/lib/types";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await listResource<Destination>("destinations", "?ordering=order&page_size=50");
      setDestinations(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load destinations.");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount
    load();
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete ${name}? This can't be undone.`)) return;
    try {
      await deleteResource("destinations", id);
      setDestinations((prev) => prev?.filter((d) => d.id !== id) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete destination.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Destinations"
        subtitle="Countries shown on the public site, in the order below."
        action={
          <Link
            href="/admin/destinations/new"
            className="inline-flex items-center gap-2 rounded-md bg-violet text-white font-semibold px-5 py-2.5 text-sm hover:bg-violet-deep transition-colors"
          >
            <Plus className="size-4" /> New destination
          </Link>
        }
      />

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <div className="rounded-2xl border border-hairline bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs font-semibold uppercase tracking-wide text-stone">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Featured</th>
              <th className="px-5 py-3 font-medium">Published</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations?.map((d) => (
              <tr key={d.id} className="border-b border-hairline last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{d.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-stone">{d.country_code}</td>
                <td className="px-5 py-3 text-stone">{d.order}</td>
                <td className="px-5 py-3">
                  {d.is_featured ? <span className="text-violet-deep">★</span> : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                      d.is_published ? "bg-mint/15 text-[#0d7a63]" : "bg-stone/15 text-stone"
                    }`}
                  >
                    {d.is_published ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/destinations/${d.id}`}
                      className="text-stone hover:text-violet-deep"
                      aria-label={`Edit ${d.name}`}
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id, d.name)}
                      className="text-stone hover:text-red-600"
                      aria-label={`Delete ${d.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {destinations?.length === 0 ? (
          <p className="text-sm text-stone p-6 text-center">
            No destinations yet — add your first one.
          </p>
        ) : null}
        {destinations === null && !error ? (
          <p className="text-sm text-stone p-6 text-center">Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
