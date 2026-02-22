'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signUp, setAuthToken, getOrganizations, APIError } from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);

    try {
      const data = await signUp({ email, password });

      // Ensure we actually received a valid token before proceeding
      if (!data || !data.token) {
        setError('Signup failed. No authentication token received.');
        setIsLoading(false);
        return;
      }

      // Store the JWT token
      setAuthToken(data.token);
      
      // Check if user already has organizations (shouldn't happen for new signups, but good to check)
      try {
        const orgs = await getOrganizations();
        if (orgs && orgs.length > 0) {
          // User has organizations, go to dashboard
          router.push('/dashboard');
        } else {
          // New user, go to onboarding
          router.push('/onboarding');
        }
      } catch (orgErr) {
        // If we can't check organizations, default to onboarding
        console.error('Failed to check organizations:', orgErr);
        router.push('/onboarding');
      }
    } catch (err) {
      // Signup failed - DO NOT redirect, just show error
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Signup error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
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
            Get started
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Create a new account
          </p>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 hover:scale-[1.01]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Continue with GitHub
              </span>
              <span className="ml-auto px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                LAST USED
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                or
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in-up mb-5">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              {error.includes('already exists') && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Already have an account?{' '}
                  <Link href="/auth/sign-in" className="text-green-600 hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              )}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-black dark:focus:border-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-black dark:focus:border-white focus:outline-none transition-all duration-200 focus:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
            By continuing, you agree to Afribase's{' '}
            <Link href="/legal/terms" className="underline hover:text-black dark:hover:text-white">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="underline hover:text-black dark:hover:text-white">
              Privacy Policy
            </Link>
            , and to receive periodic emails with updates.
          </p>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Have an account?{' '}
            <Link href="/auth/sign-in" className="font-medium text-black dark:text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-900 items-center justify-center p-16">
        <div className="max-w-lg animate-slide-in-right">
          <svg className="w-12 h-12 text-gray-400 mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl font-medium text-gray-900 dark:text-white mb-6">
            Very impressed by Afribase's growth. For new startups, they seem to have gone from "promising" to "standard" in remarkably short order.
          </blockquote>
          <div className="flex items-center gap-3">
            <Image 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-gray-700 dark:text-gray-300 font-medium">
              @techfounder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
