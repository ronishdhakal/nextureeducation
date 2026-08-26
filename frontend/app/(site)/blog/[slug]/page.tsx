import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getBlogPost, getDestinations, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: mediaUrl(post.cover_image) || undefined,
    type: "article",
  });
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
          ],
        }}
      />
      <PageHeader
        eyebrow={formatDate(post.published_at) + (post.author ? ` · ${post.author}` : "")}
        title={post.title}
      />

      <Section tone="paper">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {cover ? (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src={cover}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
                priority
              />
            </div>
          ) : null}
          <RichText html={post.body || ""} className="text-ink/75 text-lg" />
        </div>
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
