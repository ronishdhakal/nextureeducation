import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { getBlogPosts, mediaUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and updates on studying abroad from Nepal — intakes, visas, scholarships and more.",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes on studying abroad, written plainly."
        subcopy="Intake deadlines, visa updates, scholarship windows — the practical stuff, without the filler."
      />

      <Section tone="paper">
        {posts.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cover = mediaUrl(post.cover_image);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-hairline bg-paper overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(23,11,34,0.25)]"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 w-full bg-violet-pale flex items-center justify-center">
                      <span className="font-display font-extrabold text-violet-deep text-3xl">
                        N
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-2 flex-1">
                    <span className="font-mono text-[11px] uppercase tracking-wide text-stone">
                      {formatDate(post.published_at)}
                      {post.author ? ` · ${post.author}` : ""}
                    </span>
                    <h3 className="font-display font-bold text-lg text-ink group-hover:text-violet-deep transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-ink/60 leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-hairline p-10 text-center text-ink/60">
            No posts yet — check back soon.
          </div>
        )}
      </Section>
    </>
  );
}
