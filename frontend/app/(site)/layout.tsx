import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { getBranches, getSiteSettings } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, branches] = await Promise.all([getSiteSettings(), getBranches()]);

  return (
    <div className="flex min-h-full flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Nexture Education",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/nexture-logo.jpeg`,
          description:
            "Study-abroad consultancy in Kathmandu guiding Nepali students through counseling, applications, visas and test prep.",
          address: {
            "@type": "PostalAddress",
            streetAddress: settings?.address || "Bagbazar, Kathmandu",
            addressCountry: "NP",
          },
          telephone: settings?.phone || undefined,
          email: settings?.email || undefined,
          sameAs: [
            settings?.facebook_url,
            settings?.instagram_url,
            settings?.linkedin_url,
            settings?.youtube_url,
            settings?.tiktok_url,
          ].filter(Boolean),
        }}
      />
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} branches={branches} />
    </div>
  );
}
