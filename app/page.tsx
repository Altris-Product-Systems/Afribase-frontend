import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/landing/Navbar";
import Languages from "@/components/landing/Languages";


export default function Home() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Navbar />
      <Hero />
      <Features />
      <Languages />
    </main>
  );
}
