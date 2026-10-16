import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

/** Visible breadcrumb trail; pairs with the BreadcrumbList JSON-LD on the same page. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink/65">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-violet-deep">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-violet-deep">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink/85">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
