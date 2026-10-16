import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";

const DEFAULT_TITLE = "Best Consultancy in Bagbazar, Nepal | Nexture Education";
const DEFAULT_DESCRIPTION =
  "Nexture Education is a study abroad consultancy in Bagbazar, Kathmandu, Nepal. Free counselling, university selection, applications, visas and IELTS/PTE preparation. Book a free consultation.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/nexture-logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Nexture Education",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Nexture Education",
    images: [{ url: DEFAULT_OG_IMAGE }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
