import type { Metadata, Viewport } from "next";
import { SITE_DESCRIPTION, SITE_NAME, copy } from "@/lib/config";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${SITE_NAME}: ${copy.heroTitle}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: copy.heroTitle,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: copy.heroTitle,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
