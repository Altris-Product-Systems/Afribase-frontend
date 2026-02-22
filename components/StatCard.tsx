'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'emerald' | 'cyan' | 'purple' | 'amber';
  trend?: string;
  trendLabel?: string;
  isNegative?: boolean;
}

const colorMap = {}; // Left as empty if needed later, but the component now uses fixed gray styles.

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'emerald',
  trend,
  trendLabel,
  isNegative
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 shadow-lg">
      <div className="relative z-10 flex items-center gap-4">
        {/* Icon Container - Minimalist Gray Style */}
        <div className={`w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-white/[0.06]`}>
          <Icon className="text-zinc-400 group-hover:text-zinc-200 transition-colors" size={20} strokeWidth={2} />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest truncate group-hover:text-zinc-400 transition-colors">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white tracking-tight">
              {value}
            </span>
            {trend && (
              <span className={`text-[10px] font-black ${isNegative ? 'text-rose-500/80' : 'text-emerald-500/80'}`}>
                {isNegative ? '↓' : '↑'}{trend}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Background Large Icon - Very faint and minimal */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-700 pointer-events-none transform group-hover:scale-110">
        <Icon size={100} strokeWidth={1} />
      </div>

      {/* Subtle Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </div>
  );
}
