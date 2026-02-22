import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import LogoCloud from '@/components/landing/LogoCloud';
import ProductShowcase from '@/components/landing/ProductShowcase';
import Features from '@/components/landing/Features';
import Stats from '@/components/landing/Stats';
import About from '@/components/landing/About';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import AfricaOrb from '@/components/AfricaOrb';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <AfricaOrb />
      <Header />
      <main className="relative z-10">
        <Hero />
        <LogoCloud />
        <Stats />
        <ProductShowcase />
        <Features />
        <About />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
