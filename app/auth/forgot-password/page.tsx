'use client';

import React from 'react';
import Link from 'next/link';
import AfricaMapAnimation from '@/components/auth/AfricaMapAnimation';

export default function ForgotPasswordPage() {
  return (
    <div className="h-screen bg-[#0c0c0e] flex flex-col xl:flex-row text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 xl:flex-none xl:w-[45%] flex items-center justify-center p-8 xl:p-16 relative z-10 border-r border-white/5 bg-[#09090b] overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-sm animate-gelatinous-in">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center justify-center w-full mb-10 group mt-4">
            <img src="/AFR.png" alt="Afribase Logo" className="h-16 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md" />
          </Link>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Reset Password
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Enter your email to receive recovery instructions
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="developer@afribase.io"
                className="w-full px-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.02] text-sm text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all duration-300 transform active:scale-95 text-sm shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] mt-4"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Sign In */}
          <p className="mt-12 text-center text-sm text-zinc-500">
            <Link href="/auth/sign-in" className="text-white hover:text-emerald-400 transition-colors font-medium underline underline-offset-4">
              ← Return to Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Africa Map Animation */}
      <div className="hidden xl:flex xl:w-[55%] relative items-center justify-center bg-[#060608] overflow-hidden">
        <AfricaMapAnimation />
      </div>
    </div>
  );
}
