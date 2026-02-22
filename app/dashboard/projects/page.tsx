'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProjects, getOrganizations, Organization, Project } from '@/lib/api';
import ProjectModal from '@/components/ProjectModal';
import { LayoutGrid, Users, Plus, ChevronRight } from 'lucide-react';
import { useLoader } from '@/components/ui/GlobalLoaderProvider';

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');
  const { setIsLoading: setGlobalLoading } = useLoader();

  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [orgId]);

  const loadData = async () => {
    setGlobalLoading(true, 'Accessing Environments');
    setIsLoading(true);
    try {
      const orgsData = await getOrganizations();
      const orgs = Array.isArray(orgsData) ? orgsData : [];
      setOrganizations(orgs);

      let targetOrg = null;
      if (orgId) {
        targetOrg = orgs.find(o => o.id === orgId) || (orgs.length > 0 ? orgs[0] : null);
      } else if (orgs.length > 0) {
        targetOrg = orgs[0];
      }

      setSelectedOrg(targetOrg);

      if (targetOrg) {
        const projectsData = await getProjects(targetOrg.id);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      }
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  const loadProjects = async (id: string) => {
    try {
      const projectsData = await getProjects(id);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error('Failed to reload projects');
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">
            <Users size={12} />
            {selectedOrg?.name || 'Organization'}
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Projects
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Management hub for all services within {selectedOrg?.name || 'this organization'}.
          </p>
        </div>
        <button
          onClick={() => setShowProjectModal(true)}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest"
        >
          <Plus size={16} strokeWidth={3} />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="pt-10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Active Environments</h2>
        </div>

        {projects.length === 0 ? (
          <div className="py-20 border border-zinc-800/50 border-dashed rounded-3xl bg-zinc-900/20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <LayoutGrid className="text-zinc-600" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No projects found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mb-8 font-medium">This organization doesn't have any projects yet.</p>
            <button
              onClick={() => setShowProjectModal(true)}
              className="h-10 px-6 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Init First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="group glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col h-full cursor-pointer animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => router.push(`/dashboard/project/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-lg font-black text-white group-hover:border-emerald-500/50 transition-colors">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronRight className="text-zinc-700 group-hover:text-emerald-500 transition-colors" size={20} />
                </div>

                <div className="flex-1 mb-6 relative z-10">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{project.region}</p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                    <span className="text-[10px] text-emerald-400 font-black tracking-tighter uppercase">Healthy</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">{project.plan || 'Free'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        preselectedOrgId={selectedOrg?.id}
        onSuccess={() => selectedOrg && loadProjects(selectedOrg.id)}
      />
    </div>
  );
}
