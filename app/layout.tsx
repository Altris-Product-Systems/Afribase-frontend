import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import GlobalLoaderProvider from "@/components/ui/GlobalLoaderProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Afribase - Business Platform for African Entrepreneurs",
  description: "The all-in-one platform for African businesses. Manage payments, track inventory, and grow your business with tools built for the African market.",
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
        <AuthProvider>
          <GlobalLoaderProvider>
            {children}
          </GlobalLoaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
