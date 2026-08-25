"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Checkbox, Field, Select, TextArea, TextInput } from "@/components/admin/FormField";
import { createResource, listResource, updateResource } from "@/lib/adminApi";
import type { ResourceConfig } from "@/lib/adminResources";
import type { Destination } from "@/lib/types";

type Row = Record<string, unknown>;

function toFormState(config: ResourceConfig, row?: Row): Row {
  const state: Row = {};
  for (const field of config.fields) {
    if (row) {
      state[field.key] = row[field.key] ?? field.defaultValue ?? "";
    } else {
      state[field.key] =
        field.defaultValue ?? (field.type === "boolean" ? false : field.type === "number" ? 0 : "");
    }
  }
  return state;
}

export function GenericResourceForm({ config, row }: { config: ResourceConfig; row?: Row }) {
  const router = useRouter();
  const [form, setForm] = useState<Row>(toFormState(config, row));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const needsDestinations = config.fields.some((f) => f.type === "destination-select");

  useEffect(() => {
    if (needsDestinations) {
      listResource<Destination>("destinations", "?page_size=50&ordering=order")
        .then((data) => setDestinations(data.results))
        .catch(() => {});
    }
  }, [needsDestinations]);

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (typeof payload.slug === "string" && !payload.slug.trim()) {
        delete payload.slug;
      }
      if (row) {
        await updateResource(config.resource, row.id as number, payload);
      } else {
        await createResource(config.resource, payload);
      }
      router.push(config.basePath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {config.fields
        .filter((f) => f.type !== "boolean")
        .map((field) => (
          <Field key={field.key} label={field.label} htmlFor={field.key} hint={field.hint}>
            {field.type === "textarea" ? (
              <TextArea
                id={field.key}
                required={field.required}
                rows={field.key.includes("description") || field.key === "quote" ? 4 : 2}
                maxLength={field.maxLength}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value)}
              />
            ) : field.type === "select" ? (
              <Select
                id={field.key}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value)}
              >
                <option value="">—</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : field.type === "destination-select" ? (
              <Select
                id={field.key}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Not linked</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            ) : field.type === "number" ? (
              <TextInput
                id={field.key}
                type="number"
                required={field.required}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value ? Number(e.target.value) : "")}
              />
            ) : (
              <TextInput
                id={field.key}
                required={field.required}
                maxLength={field.maxLength}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
          </Field>
        ))}

      <div className="flex items-center gap-6">
        {config.fields
          .filter((f) => f.type === "boolean")
          .map((field) => (
            <Checkbox
              key={field.key}
              label={field.label}
              checked={Boolean(form[field.key])}
              onChange={(e) => set(field.key, e.target.checked)}
            />
          ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-violet text-white font-semibold px-6 py-3 text-sm transition-all hover:bg-violet-deep disabled:opacity-60"
        >
          {saving ? "Saving…" : row ? "Save changes" : `Create ${config.singularLabel.toLowerCase()}`}
        </button>
        <button
          type="button"
          onClick={() => router.push(config.basePath)}
          className="text-sm text-stone hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
