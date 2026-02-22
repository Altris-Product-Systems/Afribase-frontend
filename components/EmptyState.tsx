'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-gelatinous-in">
      <div className="relative group mb-8">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Icon Container */}
        <div className="relative w-24 h-24 bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="text-emerald-500" size={40} strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl font-black text-white tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-zinc-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {actionLabel && (
          <button
            onClick={onAction}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(16,185,129,0.6)] active:scale-95 uppercase tracking-widest"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && (
          <button
            onClick={onSecondaryAction}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black rounded-xl transition-all duration-300 border border-white/10 active:scale-95 uppercase tracking-widest"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="mt-12 pt-8 border-t border-white/5 w-full max-w-md">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
          Need help? <a href="#" className="text-emerald-500 hover:text-emerald-400 transition-colors">Read our documentation</a>
        </p>
      </div>
    </div>
  );
}
