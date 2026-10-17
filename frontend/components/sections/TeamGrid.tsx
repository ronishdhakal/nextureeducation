import { Reveal } from "@/components/ui/Reveal";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { mediaUrl } from "@/lib/api";
import type { TeamMember } from "@/lib/types";

/** Team cards, shared by the About page (short bios) and the /team page (full bios). */
export function TeamGrid({ members, fullBio = false }: { members: TeamMember[]; fullBio?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {members.map((m, i) => {
        const photo = mediaUrl(m.photo);
        return (
          <Reveal key={m.id} delay={(i % 4) * 60}>
            <article className="flex h-full flex-col items-center bg-white p-6 text-center shadow-float rounded-box">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  loading="lazy"
                  decoding="async"
                  src={photo}
                  alt={`${m.name}, ${m.role} at Nexture Education`}
                  className="size-20 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-20 items-center justify-center rounded-full bg-violet-pale text-xl font-semibold text-violet-deep"
                >
                  {m.name[0]}
                </span>
              )}
              <h3 className="mt-4 text-base font-medium text-ink">{m.name}</h3>
              <p className="mt-0.5 text-sm text-ink/85">{m.role}</p>
              {m.bio ? (
                <p
                  className={`mt-3 text-[11px] leading-relaxed text-ink/70 ${fullBio ? "" : "line-clamp-4"}`}
                >
                  {m.bio}
                </p>
              ) : null}
              <SocialIcons links={m} className="mt-auto pt-4" />
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
