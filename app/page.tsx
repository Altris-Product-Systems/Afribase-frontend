
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/landing/Navbar";
import Languages from "@/components/landing/Languages";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Languages />
      <Footer />
    </main>
  );
}
