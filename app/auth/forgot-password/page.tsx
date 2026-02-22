'use client';

import React from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mb-12">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-semibold text-black dark:text-white">
            Afribase
          </span>
        </Link>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
          Reset your password
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Enter your email address and we'll send you a link to reset your password
        </p>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
          >
            Send reset link
          </button>
        </form>

        {/* Back to Sign In */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/auth/sign-in" className="font-medium text-black dark:text-white hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
