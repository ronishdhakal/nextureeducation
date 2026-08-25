import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { ServiceIcon } from "@/lib/icons";
import type { Service, TestPrep } from "@/lib/types";

export function ServicesAndTestPrep({
  services,
  testPreps,
}: {
  services: Service[];
  testPreps: TestPrep[];
}) {
  return (
    <div className="flex flex-col gap-16">
      <div>
        <SectionHeading
          eyebrow="What we actually do"
          title="Six services. Zero upsells."
          subcopy="Every service exists because a real step in the process needed it — not because it sounded good on a brochure."
        />

        <div className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden border border-hairline">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 50}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-3 h-full bg-paper p-6 transition-colors hover:bg-paper-2"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-violet-pale text-violet-deep">
                  <ServiceIcon name={service.icon} className="size-4.5" />
                </span>
                <h3 className="font-display font-bold text-lg text-ink">{service.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed flex-1">
                  {service.short_description}
                </p>
                <span className="text-sm font-semibold text-violet-deep inline-flex items-center gap-1">
                  Learn more <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {testPreps.length ? (
        <div>
          <SectionHeading
            eyebrow="Test prep"
            title="IELTS, PTE & SAT — taught for your target score."
            subcopy="Not generic classes. Batches built around the band score or score range your shortlist actually needs."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {testPreps.map((tp) => (
              <Link
                key={tp.id}
                href="/test-prep"
                className="rounded-lg border border-hairline bg-paper p-6 transition-colors hover:border-violet/40"
              >
                <p className="text-sm font-bold uppercase tracking-wide text-violet-deep mb-2">
                  {tp.name}
                </p>
                <p className="text-sm text-ink/65 leading-relaxed">{tp.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
