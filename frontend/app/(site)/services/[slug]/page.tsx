import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { RichText } from "@/components/ui/RichText";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getDestinations, getService } from "@/lib/api";
import { ServiceIcon } from "@/lib/icons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, destinations] = await Promise.all([getService(slug), getDestinations()]);

  if (!service) notFound();

  return (
    <>
      <PageHeader eyebrow="Service" title={service.title} subcopy={service.short_description}>
        <span className="mt-6 inline-flex size-14 items-center justify-center rounded-lg bg-white/10 text-white">
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
