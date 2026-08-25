import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/sections/PageHeader";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getPage } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  return (
    <>
      <PageHeader eyebrow="Nexture Education" title={page.title} />
      <Section tone="paper">
        <div className="max-w-2xl mx-auto">
          <RichText html={page.body} className="text-ink/75 text-lg" />
        </div>
      </Section>
    </>
  );
}
