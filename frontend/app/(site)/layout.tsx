import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { PromoPopup } from "@/components/ui/PromoPopup";
import { ConsultationProvider } from "@/components/ui/ConsultationProvider";
import { getActivePopup, getDestinations, getServices, getSiteSettings } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, destinations, popup] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getDestinations(),
    getActivePopup(),
  ]);

  return (
    <ConsultationProvider destinations={destinations}>
    <div className="flex min-h-full flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["EducationalOrganization", "LocalBusiness"],
          "@id": `${SITE_URL}/#organization`,
          name: "Nexture Education",
          alternateName: "Nexture Education - Best Consultancy in Bagbazar, Kathmandu, Nepal",
          slogan: "Your next step to a bright future",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/nexture-logo.png`,
          image: `${SITE_URL}/assets/nexture-logo.png`,
          description:
            "Nexture Education is the best consultancy in Bagbazar, Kathmandu, Nepal for studying abroad, guiding Nepali students through counseling, university selection, applications, visas and test prep.",
          address: {
            "@type": "PostalAddress",
            streetAddress: settings?.address || "Bagbazar, Kathmandu",
            addressLocality: "Kathmandu",
            addressCountry: "NP",
          },
          areaServed: [
            { "@type": "Country", name: "Nepal" },
            { "@type": "City", name: "Kathmandu" },
          ],
          serviceType: "Study abroad consultancy",
          knowsAbout: destinations.map((d) => `Studying in ${d.name} from Nepal`),
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Nexture Education",
          url: SITE_URL,
          publisher: { "@id": `${SITE_URL}/#organization` },
          inLanguage: "en",
        }}
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} services={services} destinations={destinations} />
      <PromoPopup popup={popup} />
    </div>
    </ConsultationProvider>
  );
}
