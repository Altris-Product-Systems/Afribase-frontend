import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/landing/Navbar";
import Languages from "@/components/landing/Languages";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import AIFeatures from "@/components/landing/AIFeatures";
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
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="languages">
        <Languages />
      </div>
      <CTA />
      <Footer />
    </main>
  );
}
