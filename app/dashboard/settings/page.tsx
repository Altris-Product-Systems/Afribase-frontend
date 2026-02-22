'use client';

import React from 'react';
import { Settings, User, Globe, Shield, CreditCard, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const SettingItem = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <button className="w-full text-left p-6 glass-card rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group flex items-start gap-5">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{description}</p>
      </div>
      <ChevronRight className="text-zinc-700 group-hover:text-zinc-400 transition-colors self-center" size={20} />
    </button>
  );

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          Settings
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
          Manage your organization, billing, and global platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        <SettingItem 
          icon={User} 
          title="General Settings" 
          description="Update your organization name, slug, and project defaults."
        />
        <SettingItem 
          icon={Globe} 
          title="Domain & Network" 
          description="Configure custom domains, SSL certificates, and IP whitelisting."
        />
        <SettingItem 
          icon={Shield} 
          title="Security & Access" 
          description="Manage API keys, environment secrets, and advanced RLS settings."
        />
        <SettingItem 
          icon={CreditCard} 
          title="Billing & Plan" 
          description="Overview of your current plan, usage limits, and invoices."
        />
      </div>

      <div className="pt-10">
        <div className="p-8 border border-rose-500/20 bg-rose-500/5 rounded-3xl space-y-4">
          <h4 className="text-lg font-bold text-rose-500">Danger Zone</h4>
          <p className="text-xs text-zinc-500 max-w-md font-medium">Irreversibly delete this organization and all its projects. This action cannot be undone.</p>
          <button className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-black rounded-lg transition-all border border-rose-500/20 uppercase tracking-widest">
            Delete Organization
          </button>
        </div>
      </div>
    </div>
  );
}
