'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, ShieldCheck, Mail, Key, LayoutGrid, ChevronRight } from 'lucide-react';
import { getProjects, Project } from '@/lib/api';
import EmptyState from '@/components/EmptyState';
import { useLoader } from '@/components/ui/GlobalLoaderProvider';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');
  const { setIsLoading: setGlobalLoading } = useLoader();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [orgId]);

  const loadProjects = async () => {
    setGlobalLoading(true, 'Analyzing Auth Providers');
    setIsLoading(true);
    try {
      const data = await getProjects();
      const filtered = orgId ? data.filter(p => p.organizationId === orgId) : data;
      setProjects(filtered);
    } catch (err) {
      // console.error('Failed to load projects for auth', err);
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    router.push(`/dashboard/project/${projectId}?tab=auth`);
  };

  if (isLoading) return null;

  if (projects.length === 0) {
    return (
      <div className="p-8 lg:p-10">
        <EmptyState
          title="Create a project first"
          description="Authentication settings are managed per project. You'll need to create a project before configuring social login and access policies."
          icon={ShieldCheck}
          actionLabel="Back to Projects"
          onAction={() => router.push(`/dashboard/projects${orgId ? `?orgId=${orgId}` : ''}`)}
        />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Authentication Console
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
          Select a project node to configure OAuth providers, Row Level Security, and manage your end-users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleSelectProject(project.id)}
            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all text-left flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="text-emerald-500" size={20} />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                <LayoutGrid size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{project.region}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter block mb-1">Users</span>
                <span className="text-sm font-bold text-white">-</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter block mb-1">Status</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">ACTIVE</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/5">
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500">
            <Mail size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">OAuth Providers</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Enable Google, GitHub, and other identity providers per project.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">RLS Policies</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Fine-grained access control enforced at the database layer.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500">
            <Key size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">JWT Access</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Secure your API with industry-standard JSON Web Tokens.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500">
            <Users size={20} />
          </div>
          <h4 className="text-sm font-bold text-white">User Management</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">Search, filter, and manage your end-users from one dashboard.</p>
        </div>
      </div>
    </div>
  );
}
