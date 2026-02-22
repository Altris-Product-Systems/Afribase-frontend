import React from 'react';
import SectionContainer from '../ui/SectionContainer';

export default function About() {
  return (
    <SectionContainer id="about" className="bg-white dark:bg-black">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="animate-slide-in-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Built for Africa, by Africans
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            We understand the unique challenges African businesses face because we've lived them. 
            From unreliable internet connections to complex payment systems, we've built Afribase 
            to work seamlessly in the African context.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Our mission is to democratize access to world-class business tools, making them 
            affordable and accessible to every entrepreneur across the continent.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-black dark:text-white mb-2">2020</div>
              <div className="text-gray-600 dark:text-gray-400">Founded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black dark:text-white mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black dark:text-white mb-2">10k+</div>
              <div className="text-gray-600 dark:text-gray-400">Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black dark:text-white mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="relative animate-slide-in-right">
          <div className="aspect-square rounded-2xl bg-gray-900 dark:bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-white dark:text-black text-6xl font-bold opacity-20">
              AFRIBASE
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent dark:from-white/20" />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl -z-10 animate-float" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full -z-10 animate-float delay-300" />
        </div>
      </div>
    </SectionContainer>
  );
}
