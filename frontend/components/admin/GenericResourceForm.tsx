"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Checkbox, Dropzone, Field, Select, TextArea, TextInput } from "@/components/admin/FormField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  createResource,
  listResource,
  submitMultipart,
  updateResource,
  uploadResourceFiles,
} from "@/lib/adminApi";
import { loadRelationOptions, type RelationOption } from "@/lib/adminRelations";
import { mediaUrl } from "@/lib/api";
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
  const [files, setFiles] = useState<Record<string, File>>({});
  const [relations, setRelations] = useState<Record<string, RelationOption[]>>({});

  useEffect(() => {
    config.fields
      .filter((f) => f.type === "relation" && f.relation)
      .forEach((f) => {
        loadRelationOptions(f.relation!)
          .then((options) => setRelations((prev) => ({ ...prev, [f.key]: options })))
          .catch(() => {});
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

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
      // Images travel separately as multipart; the JSON body must not carry
      // the stored URL string back at an ImageField.
      for (const field of config.fields) {
        if (field.type === "image" || field.type === "file") delete payload[field.key];
        if (field.type === "time" && !payload[field.key]) payload[field.key] = null;
        if (field.type === "password" && !payload[field.key]) delete payload[field.key];
      }
      if (typeof payload.slug === "string" && !payload.slug.trim()) {
        delete payload.slug;
      }
      if (config.multipart) {
        const body = new FormData();
        for (const field of config.fields) {
          if (field.type === "image" || field.type === "file") {
            if (files[field.key]) body.append(field.key, files[field.key]);
            continue;
          }
          const value = form[field.key];
          if (value === null || value === undefined || value === "") continue;
          body.append(field.key, typeof value === "boolean" ? String(value) : String(value));
        }
        await submitMultipart(config.resource, row ? (row.id as number) : null, body);
      } else {
        const saved = row
          ? await updateResource<Row>(config.resource, row.id as number, payload)
          : await createResource<Row>(config.resource, payload);
        if (Object.keys(files).length) {
          await uploadResourceFiles(config.resource, saved.id as number, files);
        }
      }
      router.push(config.basePath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-4xl gap-x-6 gap-y-5 border border-hairline bg-white p-6 sm:grid-cols-2 sm:p-8"
    >
      {config.fields
        .filter((f) => f.type !== "boolean")
        .map((field) => (
          <div
            key={field.key}
            className={
              ["textarea", "richtext", "image", "file"].includes(field.type) ? "sm:col-span-2" : ""
            }
          >
          <Field label={field.label} htmlFor={field.key} hint={field.hint}>
            {field.type === "richtext" ? (
              <RichTextEditor
                value={String(form[field.key] ?? "")}
                onChange={(html) => set(field.key, html)}
              />
            ) : field.type === "image" ? (
              <Dropzone
                id={field.key}
                file={files[field.key] ?? null}
                existingUrl={
                  typeof row?.[field.key] === "string" ? mediaUrl(row[field.key] as string) : null
                }
                onChange={(file) =>
                  setFiles((f) => {
                    const next = { ...f };
                    if (file) next[field.key] = file;
                    else delete next[field.key];
                    return next;
                  })
                }
              />
            ) : field.type === "relation" ? (
              <Select
                id={field.key}
                required={field.required}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{field.required ? "Select…" : "Not set"}</option>
                {(relations[field.key] ?? []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            ) : field.type === "file" ? (
              <Dropzone
                id={field.key}
                accept="image/*,application/pdf,.doc,.docx"
                file={files[field.key] ?? null}
                existingUrl={null}
                onChange={(file) =>
                  setFiles((f) => {
                    const next = { ...f };
                    if (file) next[field.key] = file;
                    else delete next[field.key];
                    return next;
                  })
                }
              />
            ) : field.type === "rating" ? (
              <div className="flex gap-1.5 pt-1.5" role="radiogroup" aria-label={field.label}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={Number(form[field.key]) === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => set(field.key, n)}
                  >
                    <Star
                      className={`size-5 ${
                        n <= Number(form[field.key]) ? "fill-violet text-violet" : "text-violet/60"
                      }`}
                      strokeWidth={1.6}
                    />
                  </button>
                ))}
              </div>
            ) : field.type === "password" ? (
              <TextInput
                id={field.key}
                type="password"
                autoComplete="new-password"
                required={field.required && !row}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value)}
              />
            ) : field.type === "time" ? (
              <TextInput
                id={field.key}
                type="time"
                value={String(form[field.key] ?? "").slice(0, 5)}
                onChange={(e) => set(field.key, e.target.value ? `${e.target.value}:00` : "")}
              />
            ) : field.type === "date" ? (
              <TextInput
                id={field.key}
                type="date"
                required={field.required}
                value={String(form[field.key] ?? "").slice(0, 10)}
                onChange={(e) =>
                  set(
                    field.key,
                    !["published_at", "start_at", "end_at"].includes(field.key)
                      ? e.target.value
                      : e.target.value
                        ? `${e.target.value}${field.key === "end_at" ? "T23:59:59" : "T00:00:00"}`
                        : ""
                  )
                }
              />
            ) : field.type === "textarea" ? (
              <TextArea
                id={field.key}
                required={field.required}
                rows={field.rows ?? (field.key.includes("description") || field.key === "quote" ? 4 : 2)}
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
          </div>
        ))}

      <div className="flex items-center gap-6 bg-paper-2 px-4 py-3.5 sm:col-span-2">
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

      {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}

      <div className="flex items-center gap-3 pt-2 border-t border-hairline sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="mt-5 inline-flex items-center justify-center bg-violet text-white font-semibold px-8 py-3 text-sm shadow-sm shadow-violet/20 transition-all hover:bg-violet-deep disabled:opacity-60"
        >
          {saving ? "Saving…" : row ? "Save changes" : `Create ${config.singularLabel.toLowerCase()}`}
        </button>
        <button
          type="button"
          onClick={() => router.push(config.basePath)}
          className="mt-5 text-sm text-stone hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
