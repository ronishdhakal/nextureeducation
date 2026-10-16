import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";

import { Button } from "@/components/ui/Button";
import { EventRegisterForm } from "@/components/ui/EventRegisterForm";
import { CheckList, Chip, DetailHeading, DetailHero, Index, WRAP } from "@/components/ui/blocks";
import { RichText } from "@/components/ui/RichText";
import { getEvent, mediaUrl } from "@/lib/api";
import { formatEventDate, formatEventTime } from "@/lib/eventFormat";
import { parseLines, parseTitled } from "@/lib/lines";
import { breadcrumbJsonLd, buildMetadata, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return buildMetadata({
    title: event.meta_title || event.title,
    absoluteTitle: Boolean(event.meta_title),
    description: event.meta_description || event.summary,
    path: `/events/${event.slug}`,
    image: mediaUrl(event.cover_image) || undefined,
  });
}

/** Colour the last two words of the title, as in the design. */
function renderTitle(title: string) {
  const words = title.split(" ");
  if (words.length < 3) return title;
  return (
    <>
      {words.slice(0, -2).join(" ")} <span className="text-violet-deep">{words.slice(-2).join(" ")}</span>
    </>
  );
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const time = formatEventTime(event.start_time, event.end_time);
  const discover = parseLines(event.what_youll_discover);
  const why = parseLines(event.why_attend);
  const who = parseLines(event.who_should_attend);
  const expect = parseTitled(event.what_to_expect);
  const canRegister = (event.registration_type ?? "open") === "open";

  // Nepal Standard Time is UTC+05:45.
  const stamp = (t: string | null) => `${event.event_date}T${(t || "00:00:00").slice(0, 8)}+05:45`;
  const attendance =
    event.mode === "online"
      ? "https://schema.org/OnlineEventAttendanceMode"
      : event.mode === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Events", path: "/events" },
          { name: event.title, path: `/events/${event.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.summary,
          startDate: stamp(event.start_time),
          ...(event.end_time ? { endDate: stamp(event.end_time) } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: attendance,
          location:
            event.mode === "online"
              ? { "@type": "VirtualLocation", url: `${SITE_URL}/events/${event.slug}` }
              : {
                  "@type": "Place",
                  name: event.venue || "Kathmandu, Nepal",
                  address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
                },
          image: mediaUrl(event.cover_image) || undefined,
          organizer: { "@type": "Organization", name: event.organizer || "Nexture Education", url: SITE_URL },
          url: `${SITE_URL}/events/${event.slug}`,
        }}
      />
      <DetailHero
        title={renderTitle(event.title)}
        summary={event.summary}
        image={mediaUrl(event.cover_image)}
        imageAlt={`${event.title}: ${event.category_display} by Nexture Education`}
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: event.title }]}
      >
        <span className=" bg-violet-pale px-2.5 py-1 text-[11px] font-medium text-violet-deep rounded-md">
          {event.category_display}
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-ink/70">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-violet-deep" />
            {formatEventDate(event.event_date)}
          </span>
          {time ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-violet-deep" />
              {time}
            </span>
          ) : null}
          {event.venue ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-violet-deep" />
              {event.venue}
            </span>
          ) : null}
        </div>
        {canRegister ? (
          <Button href="#register" arrow>
            Register Now
          </Button>
        ) : null}
      </DetailHero>

      <div className={`${WRAP} flex flex-col gap-12 py-12`}>
        {event.about ? (
          <section>
            <DetailHeading large>About the event</DetailHeading>
            <RichText html={event.about} className="max-w-3xl text-ink/75" />
          </section>
        ) : null}

        {discover.length ? (
          <section>
            <DetailHeading large>What you&apos;ll discover</DetailHeading>
            <CheckList items={discover} />
          </section>
        ) : null}

        {why.length ? (
          <section>
            <DetailHeading large>Why attend?</DetailHeading>
            <CheckList items={why} />
          </section>
        ) : null}

        {who.length ? (
          <section>
            <DetailHeading large>Who should attend?</DetailHeading>
            <div className="flex flex-wrap gap-3">
              {who.map((w) => (
                <Chip key={w} label={w} />
              ))}
            </div>
          </section>
        ) : null}

        {expect.length ? (
          <section>
            <DetailHeading large>What to expect</DetailHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {expect.map((x, i) => (
                <div key={x.title} className="border border-hairline border-t-2 border-t-brand bg-paper p-4 rounded-box">
                  <Index n={i + 1} />
                  <h3 className="mt-2 text-sm font-semibold text-ink">{x.title}</h3>
                  {x.detail ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{x.detail}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {canRegister ? (
          <section id="register" className="scroll-mt-28">
            <DetailHeading hint="Secure your place at the event and take the next step toward your global education journey.">
              Reserve your spot
            </DetailHeading>
            <EventRegisterForm eventTitle={event.title} eventSlug={event.slug} />
          </section>
        ) : null}
      </div>
    </>
  );
}
