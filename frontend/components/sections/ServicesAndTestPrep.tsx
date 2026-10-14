import { ArrowRight } from "lucide-react";
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
          subcopy="Every service exists because a real step in the process needed it, not because it sounded good on a brochure."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 50} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col gap-3.5 border border-hairline bg-paper p-7 shadow-soft transition-shadow duration-200 hover:border-violet/30 hover:shadow-md"
              >
                <span className="inline-flex size-11 items-center justify-center bg-violet-pale text-violet-deep">
                  <ServiceIcon name={service.icon} className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-ink">{service.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-ink/60">
                  {service.short_description}
                </p>
                <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-violet-deep">
                  Learn more
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
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
            title="IELTS, PTE & SAT, taught for your target score."
            subcopy="Not generic classes. Batches built around the band score or score range your shortlist actually needs."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {testPreps.map((tp, i) => (
              <Reveal key={tp.id} delay={i * 60}>
                <Link
                  href="/classes"
                  className="flex h-full flex-col border border-hairline bg-paper p-6 shadow-soft transition-shadow duration-200 hover:border-violet/30 hover:shadow-md"
                >
                  <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-violet-deep">
                    {tp.name}
                  </p>
                  <p className="text-sm leading-relaxed text-ink/65">{tp.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
