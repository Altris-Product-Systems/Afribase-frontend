'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Terminal, ChevronRight } from 'lucide-react';
import { getProjects, Project } from '@/lib/api';
import EmptyState from '@/components/EmptyState';
import { useLoader } from '@/components/ui/GlobalLoaderProvider';

export default function SqlEditorPage() {
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
    setGlobalLoading(true, 'Initializing Terminal Instance');
    setIsLoading(true);
    try {
      const data = await getProjects();
      const filtered = orgId ? data.filter(p => p.organizationId === orgId) : data;
      setProjects(filtered);
    } catch (err) {
      console.error('Failed to load projects for SQL', err);
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    router.push(`/dashboard/project/${projectId}?tab=sql`);
  };

  if (isLoading) return null;

  if (projects.length === 0) {
    return (
      <div className="p-8 lg:p-10">
        <EmptyState
          title="Create a project first"
          description="The SQL Editor requires a project database to execute queries. Create a project to start writing SQL."
          icon={Terminal}
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
          SQL Console
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
          Select a project node to run raw SQL queries directly against your cluster, browse schema history, and manage snippets.
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
                <Terminal size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{project.region}</p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Open Editor</span>
              <ChevronRight size={14} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
