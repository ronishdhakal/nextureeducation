import DOMPurify from "isomorphic-dompurify";

/**
 * Renders admin-authored HTML (from the CRM's rich text editor) safely.
 * Sanitized on render since the content is trusted-author but untrusted-input
 * (a compromised staff account shouldn't be able to inject scripts site-wide).
 */
export function RichText({ html, className = "" }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      className={`prose prose-sm sm:prose-base max-w-none prose-headings:font-display prose-a:text-violet-deep prose-a:no-underline hover:prose-a:underline ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
