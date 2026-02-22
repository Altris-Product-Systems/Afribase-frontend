import React from 'react';
import SectionContainer from '../ui/SectionContainer';
import TestimonialCard from './TestimonialCard';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Afribase transformed how we handle payments. Mobile money integration made it so easy for our customers to pay, and we've seen a 300% increase in sales.",
      author: "Amara Okafor",
      role: "Founder",
      company: "Lagos Fashion Co",
    },
    {
      quote: "The inventory management is a game-changer. We manage three stores across Kenya and everything syncs perfectly. No more stockouts or overordering.",
      author: "David Kimani",
      role: "Operations Manager",
      company: "Nairobi Electronics",
    },
    {
      quote: "As a small business owner, I needed something affordable yet powerful. Afribase gave me everything I need at a price I could afford. Best decision ever!",
      author: "Fatima Hassan",
      role: "Owner",
      company: "Cairo Cafe",
    },
    {
      quote: "The analytics helped us understand our customers better. We optimized our product mix and increased profit margins by 45%. Simply incredible!",
      author: "Thabo Mokoena",
      role: "CEO",
      company: "Joburg Retail Group",
    },
    {
      quote: "Multi-currency support was exactly what we needed for our cross-border business. Real-time rates and automatic conversions save us hours every day.",
      author: "Zainab Mensah",
      role: "Finance Director",
      company: "Accra Trading Ltd",
    },
    {
      quote: "Customer support is outstanding. Whenever we have questions, the team responds quickly with helpful solutions. They really understand African businesses.",
      author: "James Nkosi",
      role: "Business Owner",
      company: "Cape Town Services",
    },
  ];

  return (
    <SectionContainer id="testimonials" className="bg-white dark:bg-black">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Loved by Businesses Across Africa
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          See what entrepreneurs and business owners are saying about Afribase
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className={`animate-fade-in-up delay-${Math.min(index + 1, 8)}00`}>
            <TestimonialCard
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
            />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
