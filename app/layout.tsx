import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Afribase - The Unified Business Platform for Africa",
    template: "%s | Afribase"
  },
  description: "Afribase is the all-in-one infrastructure platform built specifically for the African continent. Scale your backend, manage payments, and deploy edge functions with low latency and high reliability across Lagos, Nairobi, Cairo, and Johannesburg.",
  keywords: ["African Business", "Cloud Platform Africa", "Database Hosting Africa", "Backend as a Service Africa", "Edge Functions Africa", "African Tech Infrastructure", "Supabase for Africa", "Afribase", "Lagos Cloud", "Nairobi Cloud"],
  authors: [{ name: "Afribase Team" }],
  creator: "Afribase",
  publisher: "Afribase",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://useafribase.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Afribase - Empowering African Innovation",
    description: "The next generation of cloud infrastructure built for Africa. Databases, Auth, Storage, and Edge Functions with local data residency.",
    url: "https://useafribase.app",
    siteName: "Afribase",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Afribase Cloud Infrastructure",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afribase - Scale Your African Business",
    description: "Cloud infrastructure nodes across Africa. Low latency, local billing, and edge performance.",
    images: ["/og-image.png"],
    creator: "@useafribase",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} antialiased font-sans bg-brand-background text-brand-text`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Afribase",
              "url": "https://useafribase.app",
              "logo": "https://useafribase.app/AFR.png",
              "description": "The unified business platform for African entrepreneurs.",
              "sameAs": [
                "https://twitter.com/useafribase",
                "https://github.com/afribase"
              ]
            })
          }}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
