import React from 'react';
import Button from '../ui/Button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-white text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-glow" />
            Now Available Across Africa
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
            Build in a weekend
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-300 to-gray-500">
              Scale to millions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
            Afribase is the complete business platform. 
            Start with payments, grow with analytics, scale with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up delay-300">
            <Button variant="primary" size="lg" className="bg-white text-black hover:bg-gray-200">
              Start your project
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button variant="outline" size="lg" className="border-gray-700 text-white hover:bg-gray-900">
              Request a demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm animate-fade-in-up delay-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>1.2k stars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <Image 
                  src="https://randomuser.me/api/portraits/women/65.jpg" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-black"
                />
                <Image 
                  src="https://randomuser.me/api/portraits/men/46.jpg" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-black"
                />
                <Image 
                  src="https://randomuser.me/api/portraits/women/28.jpg" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-black"
                />
              </div>
              <span>10,000+ businesses</span>
            </div>
            <div>20+ countries</div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white dark:from-black to-transparent" />
    </section>
  );
}
