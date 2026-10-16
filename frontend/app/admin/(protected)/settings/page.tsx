"use client";

import { useEffect, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Field, TextArea, TextInput } from "@/components/admin/FormField";
import { getSiteSettingsAdmin, updateSiteSettingsAdmin } from "@/lib/adminApi";
import type { SiteSettings } from "@/lib/types";

const TEXT_FIELDS: { key: keyof SiteSettings; label: string; hint?: string }[] = [
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "whatsapp_number", label: "WhatsApp number" },
  { key: "address", label: "Address" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "tiktok_url", label: "TikTok URL" },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettingsAdmin<SiteSettings>()
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load."));
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateSiteSettingsAdmin<SiteSettings>(settings);
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div>
        <AdminPageHeader title="Site Settings" />
        {error ? <p className="text-sm text-red-600">{error}</p> : <p className="text-sm text-stone">Loading…</p>}
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        subtitle="Contact details, homepage hero copy, and headline stats, shared across the whole site."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-5">
          {TEXT_FIELDS.map((f) => (
            <Field key={f.key} label={f.label} htmlFor={f.key}>
              <TextInput
                id={f.key}
                value={String(settings[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value as never)}
              />
            </Field>
          ))}
        </div>

        <div className="border-t border-hairline pt-6 flex flex-col gap-5">
          <h2 className="font-display font-bold text-ink">Homepage hero</h2>
          <Field label="Eyebrow" htmlFor="hero_eyebrow">
            <TextInput
              id="hero_eyebrow"
              value={settings.hero_eyebrow}
              onChange={(e) => set("hero_eyebrow", e.target.value)}
            />
          </Field>
          <Field label="Headline" htmlFor="hero_headline">
            <TextInput
              id="hero_headline"
              value={settings.hero_headline}
              onChange={(e) => set("hero_headline", e.target.value)}
            />
          </Field>
          <Field label="Subcopy" htmlFor="hero_subcopy">
            <TextArea
              id="hero_subcopy"
              rows={3}
              value={settings.hero_subcopy}
              onChange={(e) => set("hero_subcopy", e.target.value)}
            />
          </Field>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {saved ? <p className="text-sm text-[#0d7a63]">Saved.</p> : null}

        <div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center bg-violet text-white font-semibold px-6 py-3 text-sm transition-all hover:bg-violet-deep disabled:opacity-60 rounded-box"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
