import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      <div className="w-14 h-14 rounded-xl bg-black dark:bg-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 text-white dark:text-black">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
