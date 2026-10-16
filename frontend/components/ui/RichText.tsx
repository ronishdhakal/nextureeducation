import DOMPurify from "isomorphic-dompurify";

/**
 * Renders admin-authored HTML (from the CRM's rich text editor) safely.
 * Sanitized on render since the content is trusted-author but untrusted-input
 * (a compromised staff account shouldn't be able to inject scripts site-wide).
 */
export function RichText({ html, className = "" }: { html: string; className?: string }) {
  // Images inside admin-written content: load lazily, and never leave out the alt attribute.
  const clean = DOMPurify.sanitize(html).replace(/<img\b([^>]*?)\/?>/gi, (_m, attrs: string) => {
    let a = attrs;
    if (!/\sloading=/i.test(a)) a += ' loading="lazy"';
    if (!/\sdecoding=/i.test(a)) a += ' decoding="async"';
    if (!/\salt=/i.test(a)) a += ' alt=""';
    return `<img${a}>`;
  });
  return (
    <div
      className={`prose prose-sm sm:prose-base max-w-none prose-headings:font-display prose-h2:text-xl prose-h2:font-semibold prose-h2:text-brand sm:prose-h2:text-2xl prose-h3:text-base prose-h3:font-semibold prose-h3:text-ink sm:prose-h3:text-lg prose-a:text-violet-deep prose-a:no-underline hover:prose-a:underline ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
