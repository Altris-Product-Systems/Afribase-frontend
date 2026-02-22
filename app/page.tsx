import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/landing/Navbar";
import Languages from "@/components/landing/Languages";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

import AuthHashHandler from "@/components/auth/AuthHashHandler";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-background">
      <AuthHashHandler />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Languages />
      <Footer />
    </main>
  );
}
