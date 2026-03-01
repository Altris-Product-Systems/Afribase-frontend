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

import { Toaster } from 'react-hot-toast';

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
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#18181b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: '12px'
                },
              }}
            />
          </GlobalLoaderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
