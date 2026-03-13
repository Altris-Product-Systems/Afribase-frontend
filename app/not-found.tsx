'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center space-y-8 animate-fade-in">
        {/* Icon & Title */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 rounded-[2rem] bg-zinc-900/50 border border-emerald-500/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)] group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Ghost size={64} strokeWidth={1.5} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transform hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight uppercase">
            Page Not Found
          </h2>
          <p className="text-zinc-400 max-w-sm mx-auto text-base md:text-lg leading-relaxed font-medium">
            We searched far and wide, but the page you are looking for has vanished into the void.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 group backdrop-blur-xl shadow-lg"
          >
            <ArrowLeft size={16} className="text-zinc-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            <span className="mt-0.5">Go Back</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 group backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Home size={16} className="group-hover:scale-110 transition-transform" />
            <span className="mt-0.5">Dashboard</span>
          </Link>
        </div>

        {/* Footer Support Link */}
        <div className="pt-20">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            Lost? <Link href="/support" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
