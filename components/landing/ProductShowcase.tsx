import React from 'react';
import SectionContainer from '../ui/SectionContainer';

export default function ProductShowcase() {
  return (
    <SectionContainer className="bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Database Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="animate-slide-in-left">
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              DATABASE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Every business is data-driven
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Store and manage your business data with ease. From inventory to customer records, 
              everything you need in one place.
            </p>
            <ul className="space-y-4">
              {['Real-time data sync', 'Automatic backups', 'Advanced analytics', 'Multi-location support'].map((feature) => (
                <li key={feature} className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-slide-in-right">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 font-mono text-sm">
              <div className="text-gray-500 mb-2">// Query your data</div>
              <div className="text-purple-400">const</div>
              <span className="text-blue-400"> transactions </span>
              <span className="text-white">= </span>
              <span className="text-purple-400">await</span>
              <span className="text-white"> afribase</span>
              <br />
              <span className="text-white ml-4">.from(</span>
              <span className="text-green-400">'transactions'</span>
              <span className="text-white">)</span>
              <br />
              <span className="text-white ml-4">.select(</span>
              <span className="text-green-400">'*'</span>
              <span className="text-white">)</span>
              <br />
              <span className="text-white ml-4">.eq(</span>
              <span className="text-green-400">'status'</span>
              <span className="text-white">, </span>
              <span className="text-green-400">'completed'</span>
              <span className="text-white">)</span>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="order-2 md:order-1 animate-slide-in-left">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 font-mono text-sm">
              <div className="text-gray-500 mb-2">// Secure authentication</div>
              <div className="text-purple-400">const</div>
              <span className="text-blue-400"> user </span>
              <span className="text-white">= </span>
              <span className="text-purple-400">await</span>
              <span className="text-white"> afribase.auth</span>
              <br />
              <span className="text-white ml-4">.signIn(</span>
              <span className="text-white">{'{'}</span>
              <br />
              <span className="text-white ml-8">email: </span>
              <span className="text-green-400">'user@example.com'</span>
              <span className="text-white">,</span>
              <br />
              <span className="text-white ml-8">password: </span>
              <span className="text-green-400">'********'</span>
              <br />
              <span className="text-white ml-4">{'})'};</span>
            </div>
          </div>
          <div className="order-1 md:order-2 animate-slide-in-right">
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              AUTHENTICATION
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              User management made simple
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Secure authentication for your customers and team members. Social logins, 
              multi-factor authentication, and more.
            </p>
            <ul className="space-y-4">
              {['Email & password', 'Social OAuth providers', 'Multi-factor auth', 'Team permissions'].map((feature) => (
                <li key={feature} className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payments Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              PAYMENTS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Accept payments anywhere
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Integrate mobile money, cards, and bank transfers. Get paid instantly 
              with the lowest fees in Africa.
            </p>
            <ul className="space-y-4">
              {['M-Pesa, MTN, Airtel Money', 'Bank transfers', 'Card payments', 'Instant settlements'].map((feature) => (
                <li key={feature} className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-slide-in-right">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 font-mono text-sm">
              <div className="text-gray-500 mb-2">// Process payments</div>
              <div className="text-purple-400">const</div>
              <span className="text-blue-400"> payment </span>
              <span className="text-white">= </span>
              <span className="text-purple-400">await</span>
              <span className="text-white"> afribase</span>
              <br />
              <span className="text-white ml-4">.payments.create(</span>
              <span className="text-white">{'{'}</span>
              <br />
              <span className="text-white ml-8">amount: </span>
              <span className="text-orange-400">5000</span>
              <span className="text-white">,</span>
              <br />
              <span className="text-white ml-8">currency: </span>
              <span className="text-green-400">'KES'</span>
              <span className="text-white">,</span>
              <br />
              <span className="text-white ml-8">method: </span>
              <span className="text-green-400">'mpesa'</span>
              <br />
              <span className="text-white ml-4">{'})'};</span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
