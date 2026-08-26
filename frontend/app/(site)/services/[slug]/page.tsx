import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { RichText } from "@/components/ui/RichText";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getService } from "@/lib/api";
import { ServiceIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, destinations] = await Promise.all([getService(slug), getDestinations()]);

  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: service.title,
          description: service.short_description,
          provider: { "@type": "EducationalOrganization", name: "Nexture Education", url: SITE_URL },
          areaServed: "Nepal",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
            {
              "@type": "ListItem",
              position: 3,
              name: service.title,
              item: `${SITE_URL}/services/${service.slug}`,
            },
          ],
        }}
      />
      <PageHeader eyebrow="Service" title={service.title} subcopy={service.short_description}>
        <span className="mt-6 inline-flex size-14 items-center justify-center rounded-lg bg-violet-pale text-violet-deep">
          <ServiceIcon name={service.icon} className="size-6" strokeWidth={2} />
        </span>
      </PageHeader>

      <Section tone="paper">
        <div className="grid lg:grid-cols-[1fr_0.7fr] gap-16">
          <div>
            {service.long_description ? (
              <RichText html={service.long_description} className="text-ink/70" />
            ) : (
              <p className="text-ink/70 leading-relaxed text-lg">{service.short_description}</p>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit rounded-lg border border-hairline bg-paper-2 p-6 sm:p-7">
            <SectionHeading
              title="Ready to talk it through?"
              subcopy="A quick form now saves a lot of back-and-forth later."
            />
            <div className="mt-6">
              <InquiryForm
                destinations={destinations}
                sourcePage={`/services/${service.slug}`}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
