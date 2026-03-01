'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, signInWithGitHub, setAuthToken, getOrganizations, APIError } from '@/lib/api';
import AfricaMapAnimation from '@/components/auth/AfricaMapAnimation';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    // Check for session expiration or redirect messages
    const reason = searchParams.get('reason');
    if (reason === 'inactive') {
      setInfoMessage('Your session expired due to inactivity. Please sign in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login({ email, password });

      // Ensure we actually received a valid token before proceeding
      if (!data || !data.token) {
        setError('Login failed. No authentication token received.');
        setIsLoading(false);
        return;
      }

      // Store the JWT token
      setAuthToken(data.token);

      // Check if user already has organizations
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
      // Login failed - DO NOT redirect, just show error
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col xl:flex-row text-white relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Left Side - Form */}
      <div className="w-full xl:w-[45%] flex items-center justify-center p-8 xl:p-16 relative z-10 border-r border-white/5 bg-[#09090b]">
        <div className="w-full max-w-sm animate-gelatinous-in">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <span className="text-black font-black text-lg italic">A</span>
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">
              Afribase
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Sign in to your account to continue
            </p>
          </div>

          {/* Info Message */}
          {infoMessage && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                {infoMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl mb-6">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="developer@afribase.io"
                className="w-full px-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.02] text-sm text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-400">
                  Password
                </label>
                <Link href="/auth/forgot-password" core-message="Forgot password?" className="text-xs text-zinc-500 hover:text-emerald-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.02] text-sm text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all disabled:opacity-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:transform-none text-sm shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin h-4 w-4" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#09090b] text-zinc-600 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => signInWithGitHub()}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-white/5 bg-white/[0.02] rounded-xl hover:bg-white/[0.05] transition-all duration-300 hover:border-white/10"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">GitHub</span>
            </button>
            <button title="Currently Disabled" className="flex items-center justify-center gap-3 px-4 py-3 border border-white/5 bg-white/[0.02] rounded-xl hover:bg-white/[0.05] transition-all duration-300 hover:border-white/10 opacity-50 cursor-not-allowed">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Enterprise SSO</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-12 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-white hover:text-emerald-400 transition-colors ml-1 font-medium underline underline-offset-4">
              Sign Up
            </Link>
          </p>

          {/* Policy Text */}
          <p className="mt-8 text-center text-[11px] text-zinc-600 leading-relaxed font-medium">
            By continuing, you agree to Afribase's{' '}
            <Link href="/terms" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>, and to receive periodic emails with updates.
          </p>
        </div>
      </div>

      {/* Right Side - Africa Map Animation - Hidden on mobile */}
      <div className="hidden xl:flex xl:w-[55%] relative items-center justify-center bg-[#060608] overflow-hidden">
        <AfricaMapAnimation />
      </div>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
      <path d="M3 3v5h5"></path>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
      <path d="M16 16h5v5"></path>
    </svg>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center font-black uppercase tracking-widest text-zinc-800 animate-pulse">Initializing...</div>}>
      <SignInContent />
    </Suspense>
  );
}
