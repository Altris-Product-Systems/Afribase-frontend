'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getOrganizations, isAuthenticated, Organization } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/sign-in');
      return;
    }
    loadSidebarData();
  }, [router]);

  const loadSidebarData = async () => {
    try {
      const orgsData = await getOrganizations();
      const orgs = Array.isArray(orgsData) ? orgsData : [];
      setOrganizations(orgs);
      if (orgs.length > 0 && !selectedOrg) {
        setSelectedOrg(orgs[0]);
      }
    } catch (err) {
      console.error('Failed to load organizations', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveId = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/dashboard/projects')) return 'projects';
    return pathname.split('/').pop() || 'dashboard';
  };

  const handleNavigate = (id: string) => {
    const routes: Record<string, string> = {
      dashboard: '/dashboard',
      projects: '/dashboard/projects',
      database: '/dashboard/database',
      tables: '/dashboard/database/tables',
      sql: '/dashboard/database/sql',
      api: '/dashboard/database/api',
      users: '/dashboard/auth/users',
      policies: '/dashboard/auth/policies',
      storage: '/dashboard/storage',
      'edge-functions': '/dashboard/edge-functions',
      logs: '/dashboard/logs',
      settings: '/dashboard/settings',
    };
    router.push(routes[id] || '/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-pulse" />
          <svg className="animate-spin h-12 w-12 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex overflow-hidden">
      <Sidebar
        organizations={organizations}
        selectedOrg={selectedOrg}
        onOrgChange={setSelectedOrg}
        activeId={getActiveId()}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onNewOrganization={() => setShowOnboardingModal(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Shared Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#09090b]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-sm font-bold text-white/90 uppercase tracking-widest">
              {selectedOrg?.name || 'Afribase'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Platform Healthy</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400">
              RY
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#09090b]">
          {children}
        </main>
      </div>

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={loadSidebarData}
      />
    </div>
  );
}
