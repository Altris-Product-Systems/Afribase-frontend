import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/landing/Navbar";
import Languages from "@/components/landing/Languages";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import AIFeatures from "@/components/landing/AIFeatures";
import AfricaFirst from "@/components/landing/AfricaFirst";
import OfflineFirst from "@/components/landing/OfflineFirst";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-background scroll-smooth">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <AIFeatures />
      <AfricaFirst />
      <OfflineFirst />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="languages">
        <Languages />
      </div>
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
