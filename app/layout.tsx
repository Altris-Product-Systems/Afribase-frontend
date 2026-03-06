import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Afribase - Business Platform for African Entrepreneurs",
  description: "The all-in-one platform for African businesses. Manage payments, track inventory, and grow your business with tools built for the African market.",
  icons: {
    icon: "/AFRIBASE1.png?v=1",
    shortcut: "/AFRIBASE1.png?v=1",
    apple: "/AFRIBASE1.png?v=1",
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
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
