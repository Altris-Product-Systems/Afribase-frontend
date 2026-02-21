import React from 'react';
import SectionContainer from '../ui/SectionContainer';

export default function Stats() {
  const stats = [
    { value: '10,000+', label: 'Active Businesses' },
    { value: '$50M+', label: 'Processed Monthly' },
    { value: '20+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <SectionContainer className="bg-black text-white dark:bg-white dark:text-black">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, index) => (
          <div key={index} className={`text-center animate-scale-in delay-${index + 1}00`}>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stat.value}
            </div>
            <div className="text-gray-300 dark:text-gray-700 text-sm md:text-base">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
