'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getProjects, 
  getProjectKeys, 
  Project, 
  ProjectKeys 
} from '@/lib/api';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import { 
  Database, 
  Key, 
  Activity, 
  Shield, 
  Zap, 
  Copy, 
  Check, 
  Terminal, 
  Code,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Users,
  Plus
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [keys, setKeys] = useState<ProjectKeys | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const projects = await getProjects();
      const found = projects.find(p => p.id === projectId);
      if (found) {
        setProject(found);
        try {
          const projectKeys = await getProjectKeys(projectId);
          setKeys(projectKeys);
        } catch (e) {
          console.error("Failed to load keys");
        }
      } else {
        // Handle not found
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) return null;
  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
        <Server size={32} />
      </div>
      <h3 className="text-white font-bold text-lg">Project not found</h3>
      <button onClick={() => router.push('/dashboard')} className="mt-4 text-emerald-500 text-sm font-bold">Return to Dashboard</button>
    </div>
  );

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shadow-lg">
              <Database className="text-emerald-400" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                  {project.name}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-white/5'}`}>
                  {project.status || 'Active'}
                </span>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                Project ID: <span className="text-zinc-400">{project.id}</span> • Region: <span className="text-zinc-400">{project.region}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 active:scale-95 uppercase tracking-widest">
            <Zap size={16} className="text-amber-500" />
            Upgrade Plan
          </button>
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            Pause
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-white/5 overflow-x-auto scrollbar-hide">
        {['overview', 'infrastructure', 'api-keys', 'usage', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {tab.replace('-', ' ')}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Database Size" value="24.4 MB" icon={HardDrive} trend="+2%" />
            <StatCard label="Monthly Users" value="1,280" icon={Users} trend="12%" />
            <StatCard label="CPU Usage" value="8%" icon={Cpu} trend="stable" />
            <StatCard label="Mem Usage" value="142 MB" icon={Activity} trend="low" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Start Card */}
            <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900/50 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Code size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Connect to Afribase</h3>
                  <p className="text-zinc-500 text-sm max-w-md font-medium leading-relaxed">Instantly integrate your database using our high-performance client libraries.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Node.js (Afribase-js)</span>
                      </div>
                      <button onClick={() => handleCopy('npm install @afribase/afribase-js', 'npm')} className="text-zinc-500 hover:text-white transition-colors">
                        {copiedKey === 'npm' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div className="p-4 font-mono text-[11px] text-zinc-400 bg-[#0c0c0e]">
                      <span className="text-emerald-500">npm</span> install @afribase/afribase-js
                    </div>
                  </div>

                  <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Initialize Client</span>
                      </div>
                    </div>
                    <div className="p-4 font-mono text-[11px] text-zinc-500 space-y-1 bg-[#0c0c0e]">
                      <p><span className="text-purple-500">import</span> {"{ createClient }"} <span className="text-purple-500">from</span> <span className="text-emerald-500">'@afribase/afribase-js'</span></p>
                      <p><span className="text-zinc-500">// Initialize your project</span></p>
                      <p><span className="text-purple-500">const</span> afribase = <span className="text-cyan-400">createClient</span>(</p>
                      <p className="pl-4 text-emerald-500">'{keys?.postgrest_url || 'https://your-project.afribase.co'}'</p>
                      <p className="pl-4 text-emerald-500">'{keys?.anon_key.slice(0, 20)}...[SECRET]'</p>
                      <p>)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info Side Card */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">Infrastructure</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <Globe size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Region</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{project.region || 'Nigeria (Lagos)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <Shield size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">SSL Mode</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Full (Trusted)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <Database size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Verison</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">PG 15.3</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button className="w-full h-11 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                    Restart Project
                  </button>
                </div>
              </div>

              {/* API Shortcuts */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => router.push('/dashboard/database/sql')} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-2 group">
                  <Terminal size={18} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[9px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest">SQL Editor</span>
                </button>
                <button onClick={() => router.push('/dashboard/database/tables')} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-2 group">
                  <Database size={18} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[9px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest">Table Editor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api-keys' && (
        <div className="space-y-8 max-w-4xl animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Project API Keys</h2>
            <p className="text-zinc-500 text-sm font-medium">Your project comes with two keys: a public "anon" key and a secret "service_role" key.</p>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Key size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">anon (public)</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Safe to use in browsers and client-side code.</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy(keys?.anon_key || '', 'anon')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  {copiedKey === 'anon' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copiedKey === 'anon' ? 'Copied' : 'Copy Key'}
                </button>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 font-mono text-[10px] text-zinc-500 break-all select-all">
                {keys?.anon_key}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">service_role (secret)</h4>
                    <p className="text-[10px] text-rose-500/70 font-black uppercase tracking-tighter">Never expose this key in client-side code.</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy(keys?.service_key || '', 'service')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                  {copiedKey === 'service' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copiedKey === 'service' ? 'Copied' : 'Copy Key'}
                </button>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 font-mono text-[10px] text-zinc-500 break-all blur-sm hover:blur-none transition-all cursor-pointer">
                {keys?.service_key}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="animate-fade-in py-10">
          <EmptyState
            title="Infrastructure Insights"
            description="Real-time monitoring of your database nodes, storage buckets, and edge runners. No incidents recorded in the last 24 hours."
            icon={Activity}
            actionLabel="View Logs"
            onAction={() => router.push('/dashboard/logs')}
            secondaryActionLabel="Status Page"
            onSecondaryAction={() => console.log('Status')}
          />
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="animate-fade-in space-y-8 max-w-4xl">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Resource Usage</h2>
            <p className="text-zinc-500 text-sm font-medium">Monthly resource consumption and allocation limits for your project.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Database Storage</span>
                <span className="text-xs font-bold text-white">24.4 MB / 500 MB</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 w-[5%] shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Egress Traffic</span>
                <span className="text-xs font-bold text-white">1.2 GB / 5 GB</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-blue-500 w-[24%] shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Realtime Connections</span>
                <span className="text-xs font-bold text-white">12 / 200</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-purple-500 w-[6%] shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monthly Active Users</span>
                <span className="text-xs font-bold text-white">1,280 / 50,000</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-amber-500 w-[2.5%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in space-y-10 max-w-4xl">
          <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-8">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Project Configuration</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Name</label>
                <input 
                  type="text" 
                  defaultValue={project.name}
                  className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Slug</label>
                <input 
                  type="text" 
                  defaultValue={project.slug}
                  disabled
                  className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-4">
              <button className="px-6 py-2.5 bg-emerald-500 text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:scale-105 transition-all">
                Save Changes
              </button>
            </div>
          </div>

          <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-3xl space-y-4">
            <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Danger Zone</h4>
            <p className="text-xs text-zinc-500 font-medium">Permanently delete this project and all its data. This action is irreversible.</p>
            <button className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black rounded-lg transition-all border border-red-500/20 uppercase tracking-widest">
              Delete Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

