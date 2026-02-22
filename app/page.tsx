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

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main>
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
