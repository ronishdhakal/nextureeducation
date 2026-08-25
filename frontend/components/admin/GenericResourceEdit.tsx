"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { getResource } from "@/lib/adminApi";
import type { ResourceConfig } from "@/lib/adminResources";

type Row = Record<string, unknown>;

export function GenericResourceEdit({ config }: { config: ResourceConfig }) {
  const params = useParams<{ id: string }>();
  const [row, setRow] = useState<Row | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getResource<Row>(config.resource, params.id)
      .then(setRow)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div>
      <AdminPageHeader
        title={row ? `Edit ${String(row[config.titleField])}` : `Edit ${config.singularLabel}`}
        subtitle="Changes go live on the public site as soon as you save."
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {row ? (
        <GenericResourceForm config={config} row={row} />
      ) : !error ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : null}
    </div>
  );
}
