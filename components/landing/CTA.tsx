import React from 'react';
import SectionContainer from '../ui/SectionContainer';
import Button from '../ui/Button';

export default function CTA() {
  return (
    <SectionContainer id="contact" className="bg-black dark:bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Start building today
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Join thousands of African businesses building the future
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" size="lg">
            Start your project
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
            Request a demo
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
