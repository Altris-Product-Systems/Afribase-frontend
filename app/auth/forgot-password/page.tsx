'use client';

import React from 'react';
import Link from 'next/link';
import AfricaMapAnimation from '@/components/auth/AfricaMapAnimation';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-16 relative z-10 border-r border-white/5 bg-[#09090b]">
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
            <h1 className="text-3xl font-black text-white mb-3 tracking-tighter italic uppercase">
              Reset Key
            </h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
              Initiate <span className="text-emerald-500">recovery protocol</span>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Verified Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="developer@afribase.io"
                className="w-full px-4 py-3.5 border border-white/5 rounded-xl bg-white/[0.02] text-sm text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all focus:scale-[1.01]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all duration-300 transform active:scale-95 uppercase tracking-widest text-xs shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] mt-4"
            >
              Dispatch Recovery Link
            </button>
          </form>

          {/* Back to Sign In */}
          <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <Link href="/auth/sign-in" className="text-white hover:text-emerald-400 transition-colors underline underline-offset-4">
              ← Return to Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Africa Map Animation */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center bg-[#060608] overflow-hidden">
        <AfricaMapAnimation />
      </div>
    </div>
  );
}
