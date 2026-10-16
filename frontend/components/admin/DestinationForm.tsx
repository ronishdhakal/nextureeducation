"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe2, ImageIcon, Search, SquarePen } from "lucide-react";

import { Checkbox, Dropzone, Field, FormSection, TextArea, TextInput } from "@/components/admin/FormField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { createResource, updateResource, uploadResourceFiles } from "@/lib/adminApi";
import { mediaUrl } from "@/lib/api";
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
  why_study_overview: string;
  popular_courses_overview: string;
  documents_overview: string;
  scholarships_overview: string;
  additional_info: string;
  key_highlights: string;
  why_choose_points: string;
  study_areas: string;
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
    why_study_overview: d?.why_study_overview || "",
    popular_courses_overview: d?.popular_courses_overview || "",
    documents_overview: d?.documents_overview || "",
    scholarships_overview: d?.scholarships_overview || "",
    additional_info: d?.additional_info || "",
    key_highlights: d?.key_highlights || "",
    why_choose_points: d?.why_choose_points || "",
    study_areas: d?.study_areas || "",
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
  const [flagFile, setFlagFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, slug: form.slug.trim() || undefined };
      const saved = destination
        ? await updateResource<Destination>("destinations", destination.id, payload)
        : await createResource<Destination>("destinations", payload);

      const files: Record<string, File> = {};
      if (flagFile) files.flag_image = flagFile;
      if (heroFile) files.hero_image = heroFile;
      if (Object.keys(files).length) {
        await uploadResourceFiles("destinations", saved.id, files);
      }
      router.push("/admin/destinations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save destination.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
      <FormSection
        title="Basics"
        description="Name, code and the teaser shown on destination cards."
        icon={Globe2}
      >
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

        <div className="flex items-center gap-6 bg-paper-2 px-4 py-3.5 rounded-box">
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
      </FormSection>

      <FormSection
        title="Images"
        description="The country logo and the card background shown in the homepage destination carousel."
        icon={ImageIcon}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Country logo / flag" htmlFor="flag_image" hint="Square image works best (PNG or SVG-sized)">
            <Dropzone
              id="flag_image"
              file={flagFile}
              existingUrl={mediaUrl(destination?.flag_image)}
              onChange={setFlagFile}
            />
          </Field>
          <Field label="Background image" htmlFor="hero_image" hint="Landscape photo, shown on the destination card">
            <Dropzone
              id="hero_image"
              file={heroFile}
              existingUrl={mediaUrl(destination?.hero_image)}
              onChange={setHeroFile}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection
        title="Quick lists"
        description="Short lists shown as chips and cards on the destination page. Use bullet lists, one item per bullet."
        icon={SquarePen}
      >
        <Field label="Why choose (chips)" htmlFor="why_choose_points" hint="e.g. World-Class Education">
          <RichTextEditor value={form.why_choose_points} onChange={(html) => set("why_choose_points", html)} />
        </Field>
        <Field label="Key highlights (cards)" htmlFor="key_highlights" hint="e.g. Post-study work visa (2-4 years)">
          <RichTextEditor value={form.key_highlights} onChange={(html) => set("key_highlights", html)} />
        </Field>
        <Field label="Popular study areas" htmlFor="study_areas" hint="e.g. Engineering">
          <RichTextEditor value={form.study_areas} onChange={(html) => set("study_areas", html)} />
        </Field>
      </FormSection>

      <FormSection
        title="Content sections"
        description="Each of these renders as its own section on the destination page."
        icon={SquarePen}
      >
      <Field label="Why study here" htmlFor="why_study_overview" hint="What makes this destination worth choosing">
        <RichTextEditor
          value={form.why_study_overview}
          onChange={(html) => set("why_study_overview", html)}
        />
      </Field>

      <Field label="Eligibility" htmlFor="eligibility_overview" hint="Entry requirements: grades, English test scores, etc.">
        <RichTextEditor
          value={form.eligibility_overview}
          onChange={(html) => set("eligibility_overview", html)}
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

      <Field label="Popular courses" htmlFor="popular_courses_overview" hint="In-demand fields of study for this destination">
        <RichTextEditor
          value={form.popular_courses_overview}
          onChange={(html) => set("popular_courses_overview", html)}
        />
      </Field>

      <Field label="Visa process" htmlFor="visa_overview">
        <RichTextEditor
          value={form.visa_overview}
          onChange={(html) => set("visa_overview", html)}
        />
      </Field>

      <Field label="Documents required" htmlFor="documents_overview" hint="What applicants need to gather for the application">
        <RichTextEditor
          value={form.documents_overview}
          onChange={(html) => set("documents_overview", html)}
        />
      </Field>

      <Field label="Scholarships & financial aid" htmlFor="scholarships_overview">
        <RichTextEditor
          value={form.scholarships_overview}
          onChange={(html) => set("scholarships_overview", html)}
        />
      </Field>

      <Field
        label="Additional information"
        htmlFor="additional_info"
        hint="Anything else specific to this destination that doesn't fit the sections above"
      >
        <RichTextEditor
          value={form.additional_info}
          onChange={(html) => set("additional_info", html)}
        />
      </Field>
      </FormSection>

      <FormSection
        title="SEO"
        description="Leave blank to fall back to the default title and description."
        icon={Search}
      >
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
      </FormSection>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center bg-violet text-white font-semibold px-6 py-3 text-sm shadow-sm shadow-violet/20 transition-all hover:bg-violet-deep hover:shadow-violet/30 disabled:opacity-60 rounded-box"
        >
          {saving ? "Saving…" : destination ? "Save changes" : "Create destination"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/destinations")}
          className="text-sm text-stone hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
