"use client";

export interface RelationOption {
  value: number;
  label: string;
}

/** Options for a relation field: a paginated resource, or a plain array endpoint. */
export async function loadRelationOptions(source: {
  resource: string;
  labelKey: string;
  plain?: boolean;
}): Promise<RelationOption[]> {
  const url = `/api/admin/proxy/${source.resource}${source.plain ? "" : "?page_size=200"}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const rows: Record<string, unknown>[] = Array.isArray(data) ? data : (data.results ?? []);
  return rows.map((r) => ({ value: Number(r.id), label: String(r[source.labelKey] ?? r.id) }));
}
