'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getOrganizations, isAuthenticated, Organization, getUser, User } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import { useLoader } from '@/components/ui/GlobalLoaderProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading: setGlobalLoading } = useLoader();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    const orgId = searchParams.get('orgId');
    if (orgId && organizations.length > 0) {
      const found = organizations.find(o => o.id === orgId);
      if (found) setSelectedOrg(found);
    }
  }, [searchParams, organizations]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/sign-in');
      return;
    }
    loadSidebarData();
  }, [router]);

  const loadSidebarData = async () => {
    try {
      setGlobalLoading(true, 'Accessing Grid Console');

      // Load user and organizations in parallel
      const [userData, orgsData] = await Promise.all([
        getUser(),
        getOrganizations()
      ]);

      setUser(userData);
      const orgs = Array.isArray(orgsData) ? orgsData : [];
      setOrganizations(orgs);

      const searchParams = new URLSearchParams(window.location.search);
      const urlOrgId = searchParams.get('orgId');

      if (urlOrgId) {
        const found = orgs.find(o => o.id === urlOrgId);
        if (found) setSelectedOrg(found);
        else if (orgs.length > 0) setSelectedOrg(orgs[0]);
      } else if (orgs.length > 0 && !selectedOrg) {
        setSelectedOrg(orgs[0]);
      }
    } catch (err) {
      console.error('Failed to load organizations', err);
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleOrgChange = (org: Organization) => {
    setSelectedOrg(org);

    if (pathname.startsWith('/dashboard/project/')) {
      // Switching orgs while in a project detail should go to the projects list of the new org
      router.push(`/dashboard/projects?orgId=${org.id}`);
    } else {
      // Maintain current path but update the orgId
      router.push(`${pathname}?orgId=${org.id}`);
    }
  };

  const getActiveId = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/dashboard/projects')) return 'projects';
    return pathname.split('/').pop() || 'dashboard';
  };

  const handleNavigate = (id: string) => {
    // Detect if we are in a project context
    const projectMatch = pathname.match(/^\/dashboard\/project\/([^\/]+)/);
    const projectId = projectMatch ? projectMatch[1] : null;

    if (projectId) {
      // If in project context, certain IDs should stay within the project detail tabs
      const projectTabs: Record<string, string> = {
        tables: 'tables',
        sql: 'sql',
        api: 'api-keys',
        auth: 'auth',
        users: 'users',
        policies: 'policies',
      };

      if (projectTabs[id]) {
        router.push(`/dashboard/project/${projectId}?tab=${projectTabs[id]}${selectedOrg ? `&orgId=${selectedOrg.id}` : ''}`);
        return;
      }
    }

    const routes: Record<string, string> = {
      dashboard: '/dashboard',
      projects: '/dashboard/projects',
      database: '/dashboard/database',
      tables: '/dashboard/database/tables',
      sql: '/dashboard/database/sql',
      api: '/dashboard/database/api',
      auth: '/dashboard/auth',
      users: '/dashboard/auth/users',
      policies: '/dashboard/auth/policies',
      storage: '/dashboard/storage',
      'edge-functions': '/dashboard/edge-functions',
      logs: '/dashboard/logs',
      settings: '/dashboard/settings',
    };

    const baseRoute = routes[id] || '/dashboard';
    const finalRoute = selectedOrg ? `${baseRoute}?orgId=${selectedOrg.id}` : baseRoute;
    router.push(finalRoute);
  };

  // While the global loader handles the initial technical reveal, we check isLoading here
  // to avoid rendering the heavy dashboard UI before sidebar data is ready.
  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#09090b] flex overflow-hidden">
      <Sidebar
        organizations={organizations}
        selectedOrg={selectedOrg}
        onOrgChange={handleOrgChange}
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
              {selectedOrg?.name || 'Afriibase'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Platform Healthy</span>
            </div> */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  {user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) ||
                    user?.email?.slice(0, 2).toUpperCase() || '??'}
                </span>
              )}
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
