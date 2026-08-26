"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Checkbox, Field, TextArea, TextInput } from "@/components/admin/FormField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { createResource, updateResource } from "@/lib/adminApi";
import type { Destination } from "@/lib/types";

type FormState = {
  name: string;
  slug: string;
  country_code: string;
  summary: string;
  cost_overview: string;
  intake_overview: string;
  visa_overview: string;
  eligibility_overview: string;
  popular_intakes: string;
  order: number;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
};

function toFormState(d?: Destination): FormState {
  return {
    name: d?.name || "",
    slug: d?.slug || "",
    country_code: d?.country_code || "",
    summary: d?.summary || "",
    cost_overview: d?.cost_overview || "",
    intake_overview: d?.intake_overview || "",
    visa_overview: d?.visa_overview || "",
    eligibility_overview: d?.eligibility_overview || "",
    popular_intakes: d?.popular_intakes || "",
    order: d?.order ?? 0,
    is_featured: d?.is_featured ?? false,
    is_published: d?.is_published ?? true,
    meta_title: d?.meta_title || "",
    meta_description: d?.meta_description || "",
  };
}

export function DestinationForm({ destination }: { destination?: Destination }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(destination));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, slug: form.slug.trim() || undefined };
      if (destination) {
        await updateResource("destinations", destination.id, payload);
      } else {
        await createResource("destinations", payload);
      }
      router.push("/admin/destinations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save destination.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" htmlFor="name">
          <TextInput
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Country code" htmlFor="country_code" hint="Shown as a short badge, e.g. AUS">
          <TextInput
            id="country_code"
            value={form.country_code}
            onChange={(e) => set("country_code", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the name">
        <TextInput
          id="slug"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder="australia"
        />
      </Field>

      <Field label="Summary" htmlFor="summary" hint="Short teaser shown on destination cards">
        <TextArea
          id="summary"
          required
          rows={2}
          maxLength={280}
          value={form.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </Field>

      <Field label="Cost of living & tuition" htmlFor="cost_overview">
        <RichTextEditor
          value={form.cost_overview}
          onChange={(html) => set("cost_overview", html)}
        />
      </Field>

      <Field label="Intakes" htmlFor="intake_overview">
        <RichTextEditor
          value={form.intake_overview}
          onChange={(html) => set("intake_overview", html)}
        />
      </Field>

      <Field label="Visa process" htmlFor="visa_overview">
        <RichTextEditor
          value={form.visa_overview}
          onChange={(html) => set("visa_overview", html)}
        />
      </Field>

      <Field label="Eligibility" htmlFor="eligibility_overview" hint="Entry requirements — grades, English test scores, etc.">
        <RichTextEditor
          value={form.eligibility_overview}
          onChange={(html) => set("eligibility_overview", html)}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Popular intakes" htmlFor="popular_intakes" hint="e.g. February, July">
          <TextInput
            id="popular_intakes"
            value={form.popular_intakes}
            onChange={(e) => set("popular_intakes", e.target.value)}
          />
        </Field>
        <Field label="Order" htmlFor="order" hint="Lower numbers appear first">
          <TextInput
            id="order"
            type="number"
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="SEO title" htmlFor="meta_title">
          <TextInput
            id="meta_title"
            value={form.meta_title}
            onChange={(e) => set("meta_title", e.target.value)}
          />
        </Field>
        <Field label="SEO description" htmlFor="meta_description">
          <TextInput
            id="meta_description"
            value={form.meta_description}
            onChange={(e) => set("meta_description", e.target.value)}
          />
        </Field>
      </div>

      <div className="flex items-center gap-6">
        <Checkbox
          label="Featured"
          checked={form.is_featured}
          onChange={(e) => set("is_featured", e.target.checked)}
        />
        <Checkbox
          label="Published"
          checked={form.is_published}
          onChange={(e) => set("is_published", e.target.checked)}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-md bg-violet text-white font-semibold px-6 py-3 text-sm transition-all hover:bg-violet-deep disabled:opacity-60"
        >
          {saving ? "Saving…" : destination ? "Save changes" : "Create destination"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/destinations")}
          className="text-sm text-stone hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
