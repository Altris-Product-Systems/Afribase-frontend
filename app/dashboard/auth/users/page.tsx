'use client';

import React from 'react';
import { Users, UserPlus, Mail, Settings, Filter } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function UsersPage() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Users
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Manage your application users and their authentication methods.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <UserPlus size={16} strokeWidth={3} />
            Invite User
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-b border-white/5">
        <div className="flex items-center gap-6">
          <button className="text-xs font-black text-white px-2 py-1 border-b-2 border-emerald-500 uppercase tracking-widest">All Users</button>
          <button className="text-xs font-black text-zinc-500 hover:text-white px-2 py-1 uppercase tracking-widest transition-colors">Invited</button>
          <button className="text-xs font-black text-zinc-500 hover:text-white px-2 py-1 uppercase tracking-widest transition-colors">Banned</button>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      <div className="pt-8">
        <EmptyState
          title="No users yet"
          description="Your application is ready for authentication. Invite your first user or start testing with mock accounts."
          icon={Users}
          actionLabel="Invite First User"
          onAction={() => console.log('Invite')}
          secondaryActionLabel="Auth Settings"
          onSecondaryAction={() => console.log('Settings')}
        />
      </div>
    </div>
  );
}
