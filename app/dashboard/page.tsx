'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, getOrganizations, isAuthenticated, Project, Organization } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import ProjectModal from '@/components/ProjectModal';
import StatCard from '@/components/StatCard';
import { LayoutGrid, Users, Globe, Zap, Server, Plus } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      loadProjects(selectedOrg.id);
    }
  }, [selectedOrg]);

  const loadData = async () => {
    try {
      const orgsData = await getOrganizations();
      const orgs = Array.isArray(orgsData) ? orgsData : [];
      setOrganizations(orgs);
      if (orgs.length > 0) setSelectedOrg(orgs[0]);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async (orgId: string) => {
    try {
      const projectsData = await getProjects(orgId);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Overview
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Manage your cloud infrastructure and active services.
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Projects" value={projects.length} icon={LayoutGrid} trend="12%" />
        <StatCard label="My Organizations" value={organizations.length} icon={Users} trend="0%" />
        <StatCard label="My Domains" value={0} icon={Globe} trend="new" />
        <StatCard label="Service Health" value="99.9%" icon={Zap} trend="stable" />
      </div>

      {/* Projects Grid */}
      <div className="pt-10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Active Projects</h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="py-20 border border-zinc-800/50 border-dashed rounded-3xl bg-zinc-900/20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <LayoutGrid className="text-zinc-600" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No projects found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mb-8 font-medium">Get started by creating your first project environment.</p>
            <button
              onClick={() => setShowProjectModal(true)}
              className="h-10 px-6 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Launch Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="group glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col h-full cursor-pointer animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-lg font-black text-white group-hover:border-emerald-500/50 transition-colors">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
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
        onSuccess={() => selectedOrg && loadProjects(selectedOrg.id)}
        preselectedOrgId={selectedOrg?.id}
      />
    </div>
  );
}
