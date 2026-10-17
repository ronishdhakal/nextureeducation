import Script from "next/script";

// Google Analytics 4 measurement ID (a public identifier, safe to ship in the page).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0JG5PGN1EY";

/**
 * Google tag (gtag.js). Rendered only on the public site, never in the admin panel,
 * and only in production so local development does not pollute the stats.
 * GA4's built-in "page changes based on browser history" tracks navigation between pages.
 */
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
