'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, getOrganizations, isAuthenticated, Project, Organization } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import ProjectModal from '@/components/ProjectModal';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  bgIcon 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  bgIcon: React.ReactNode;
}) => (
  <div className="group relative glass-card rounded-2xl p-6 overflow-hidden flex items-center transition-all duration-300 hover:border-white/10">
    {/* Decorative Background Icon */}
    <div className="absolute -right-6 -bottom-6 w-32 h-32 text-white/[0.03] group-hover:text-white/[0.05] transition-colors duration-500 transform rotate-12">
      {bgIcon}
    </div>
    
    <div className="relative z-10 flex items-center gap-5">
      {/* Icon Container */}
      <div className="w-14 h-14 bg-zinc-900/80 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors duration-300 shadow-xl">
        {icon}
      </div>
      
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors">
          {title}
        </p>
        <p className="text-3xl font-black text-white tracking-tight">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/sign-in');
      return;
    }

    loadData();
  }, [router]);

  // Reload projects when selected organization changes
  useEffect(() => {
    if (selectedOrg) {
      loadProjects(selectedOrg.id);
    }
  }, [selectedOrg]);

  const loadData = async () => {
    try {
      const orgsData = await getOrganizations();
      // Ensure we always have arrays
      const orgs = Array.isArray(orgsData) ? orgsData : [];

      setOrganizations(orgs);

      // Set first organization as selected if available
      if (orgs.length > 0 && !selectedOrg) {
        setSelectedOrg(orgs[0]);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
      // Set empty arrays on error
      setOrganizations([]);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async (orgId: string) => {
    try {
      const projectsData = await getProjects(orgId);
      const projs = Array.isArray(projectsData) ? projectsData : [];
      setProjects(projs);
      setError('');
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
      setProjects([]);
    }
  };

  const handleOnboardingSuccess = () => {
    setShowOnboardingModal(false);
    loadData(); // Reload organizations and projects
  };

  const handleProjectSuccess = () => {
    setShowProjectModal(false);
    if (selectedOrg) {
      loadProjects(selectedOrg.id); // Reload projects for current org
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="text-center group">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-pulse" />
            <svg className="animate-spin h-16 w-16 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Sidebar */}
      <Sidebar
        organizations={organizations}
        selectedOrg={selectedOrg}
        onOrgChange={setSelectedOrg}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showOrgSelector={true}
        onNewOrganization={() => setShowOnboardingModal(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 glass-header flex items-center justify-between px-4 lg:px-8 z-20">
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <h1 className="text-base lg:text-lg font-bold tracking-tight text-white/90 truncate max-w-[150px] lg:max-w-none">
              {selectedOrg ? selectedOrg.name : 'Projects'}
            </h1>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <span className="hidden sm:inline-flex text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
              {projects.length} Total
            </span>
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-black shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400 hover:border-emerald-500/50 transition-colors cursor-pointer shadow-lg">
              RY
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-brand-background p-8 lg:p-10 scroll-smooth">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-scale-in">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Header & Controls Section */}
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-white">
                  Dashboard
                </h1>
                <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
                  {selectedOrg
                    ? `Managing infrastructure and services for ${selectedOrg.name}.`
                    : 'Select an organization to view and manage its cloud infrastructure.'
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(16,185,129,1.6)] active:scale-95 uppercase tracking-widest"
                >
                  <svg className="w-4 h-4 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </button>
              </div>
            </div>

            {/* Snippet Cards (Stat Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard 
                title="My Organizations" 
                value={organizations.length} 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                bgIcon={
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                }
              />
              <StatCard 
                title="Total Projects" 
                value={projects.length} 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zM3 7V5a2 2 0 012-2h2a2 2 0 012 2v2m0 0h6m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M9 11v1m0 4v1m6-5v1m0 4v1" />
                  </svg>
                }
                bgIcon={
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zM3 7V5a2 2 0 012-2h2a2 2 0 012 2v2m0 0h6m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2M9 11v1m0 4v1m6-5v1m0 4v1" /></svg>
                }
              />
              <StatCard 
                title="Active Databases" 
                value={projects.filter(p => (p as any).status === 'active' || (p as any).status === 'ACTIVE' || true).length} 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                }
                bgIcon={
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                }
              />
            </div>

            {/* Content Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-y border-white/5">
              <div className="flex-1 w-full relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search projects by name or ID..."
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none h-11 px-4 border border-white/5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between gap-3 min-w-[120px]">
                  Sort By
                  <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="h-6 w-px bg-white/5 mx-1" />
                <button className="h-11 w-11 flex items-center justify-center border border-white/5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Projects Section */}
            <div>
              {projects.length === 0 ? (
                <div className="relative group overflow-hidden py-24 border border-zinc-800/50 border-dashed rounded-3xl bg-zinc-900/20 flex flex-col items-center justify-center text-center animate-scale-in">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="relative w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/5">
                    <svg className="w-10 h-10 text-zinc-600 group-hover:text-emerald-500 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {selectedOrg ? `Ready to launch in ${selectedOrg.name}?` : 'No active projects detected'}
                  </h3>
                  <p className="text-zinc-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">
                    Create your first production environment to start deploying your applications with Afribase.
                  </p>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="h-11 px-8 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    Get Started Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                  {projects.map((project, idx) => (
                    <div
                      key={project.id}
                      className="group glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col h-full cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => router.push(`/project/${project.id}`)}
                    >
                      {/* Decorative Background Glow */}
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors duration-500" />
                      
                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-lg font-black text-white group-hover:border-emerald-500/50 transition-colors duration-300">
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === project.id ? null : project.id);
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === project.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                }}
                              />
                              <div className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-2xl z-30 border border-white/10 py-2 animate-scale-in backdrop-blur-3xl">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/project/${project.id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-5 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Engine
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-5 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  </svg>
                                  Settings
                                </button>
                                <div className="mx-3 my-2 h-px bg-white/5" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors font-bold"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{project.region}</span>
                          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global CDN</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                            <span className="text-[10px] text-emerald-400 font-black tracking-tighter uppercase leading-none">Healthy</span>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-white/5 rounded-md border border-white/5">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                            {project.plan || 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={handleOnboardingSuccess}
      />
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSuccess={handleProjectSuccess}
        preselectedOrgId={selectedOrg?.id}
      />
    </div>
  );
}
