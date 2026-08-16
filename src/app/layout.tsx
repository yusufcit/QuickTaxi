import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const headingFont = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Quick Taxi | Reliable Local Taxi Service in Ireland",
    template: "%s | Quick Taxi",
  },
  description:
    "Quick Taxi provides airport transfers, local journeys and long-distance travel. Submit your booking request and we will contact you by WhatsApp or phone.",
  openGraph: {
    title: "Quick Taxi",
    description:
      "Airport transfers, local journeys and long-distance travel. Booking requests are reviewed and confirmed manually.",
    url: siteConfig.siteUrl,
    siteName: "Quick Taxi",
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Taxi",
    description:
      "Reliable local taxi service. Book in advance and get confirmation by WhatsApp or phone.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
