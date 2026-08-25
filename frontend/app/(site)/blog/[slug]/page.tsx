import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { getBlogPost, getDestinations, mediaUrl } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, destinations] = await Promise.all([getBlogPost(slug), getDestinations()]);

  if (!post) notFound();

  const cover = mediaUrl(post.cover_image);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: cover || undefined,
          author: post.author ? { "@type": "Person", name: post.author } : undefined,
          datePublished: post.published_at || undefined,
        }}
      />
      <PageHeader
        eyebrow={formatDate(post.published_at) + (post.author ? ` · ${post.author}` : "")}
        title={post.title}
      />

      <Section tone="paper">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="w-full rounded-lg object-cover" />
          ) : null}
          <div className="text-ink/75 leading-relaxed whitespace-pre-line text-lg">
            {post.body}
          </div>
        </div>
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
