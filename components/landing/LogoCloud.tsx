import React from 'react';

export default function LogoCloud() {
  const companies = [
    'GitHub', 'Vercel', 'Stripe', 'Google', 'Microsoft', 'Amazon'
  ];

  return (
    <section className="py-16 bg-white dark:bg-black border-y border-gray-200 dark:border-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-600 mb-8 uppercase tracking-wider">
          Backed by industry leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
          {companies.map((company) => (
            <div
              key={company}
              className="text-2xl md:text-3xl font-bold text-gray-400 dark:text-gray-700 hover:text-gray-600 dark:hover:text-gray-500 transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
