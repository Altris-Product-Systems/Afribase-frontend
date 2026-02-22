'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, getOrganizations, isAuthenticated, Project, Organization } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import StatCard from '@/components/StatCard';
import { LayoutGrid, Users, Globe, Zap, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const orgsData = await getOrganizations();
      const orgs = Array.isArray(orgsData) ? orgsData : [];
      setOrganizations(orgs);
      
      // Fetch total projects for all orgs to fill stats correctly
      let totalProjects = 0;
      for (const org of orgs) {
        try {
          const projs = await getProjects(org.id);
          if (Array.isArray(projs)) totalProjects += projs.length;
        } catch (e) {
          console.error(`Failed to load projects for org ${org.id}`);
        }
      }
      setProjects(new Array(totalProjects).fill({ id: 'temp' } as Project));
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Dashboard
          </h1>
          <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
            Welcome back. Overview of your cloud organizations and global stats.
          </p>
        </div>
      </div>

      {/* Stat Cards - Preserving UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Projects" value={projects.length} icon={LayoutGrid} trend="12%" />
        <StatCard label="My Organizations" value={organizations.length} icon={Users} trend="0%" />
        <StatCard label="My Domains" value={0} icon={Globe} trend="new" />
        <StatCard label="Service Health" value="99.9%" icon={Zap} trend="stable" />
      </div>

      {/* Organizations Grid */}
      <div className="pt-10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Your Organizations</h2>
        </div>
        
        {organizations.length === 0 ? (
          <div className="py-20 border border-zinc-800/50 border-dashed rounded-3xl bg-zinc-900/20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <Users className="text-zinc-600" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No organizations found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mb-8 font-medium">Create an organization to start managing your projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {organizations.map((org, idx) => (
              <div
                key={org.id}
                className="group glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col h-full cursor-pointer animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => router.push(`/dashboard/projects?orgId=${org.id}`)}
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/5 flex items-center justify-center text-lg font-black text-white group-hover:border-emerald-500/50 transition-colors">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronRight className="text-zinc-700 group-hover:text-emerald-500 transition-colors" size={20} />
                </div>

                <div className="flex-1 mb-6 relative z-10">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {org.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{org.id.slice(0, 8)}...</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Organization</span>
                  <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
                    <span className="text-[10px] text-zinc-400 font-black tracking-tighter uppercase">View Projects</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
