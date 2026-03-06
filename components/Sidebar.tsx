'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeAuthToken, Organization } from '@/lib/api';
import {
  LayoutGrid,
  Database,
  Users,
  Zap,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Terminal,
  ShieldCheck,
  HardDrive,
  Activity,
  HeartPulse,
  Code,
  BarChart3,
  Archive,
  GitBranch,
  Webhook,
  Lock,
  Globe,
  Shield,
  Radio,
  Rss,
  Cpu,
  Table,
  Server,
  Library,
  MessageSquare,
  Share2,
  Home,
  Layers,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  organizations?: Organization[];
  selectedOrg?: Organization | null;
  onOrgChange?: (org: Organization) => void;
  activeId?: string;
  onNavigate?: (id: string) => void;
  showOrgSelector?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onNewOrganization?: () => void;
  // Project context props
  projectId?: string;
  projectName?: string;
  projectPlan?: string;
  projectRegion?: string;
  projectStatus?: string;
}

export default function Sidebar({
  organizations = [],
  selectedOrg = null,
  onOrgChange,
  activeId = 'projects',
  onNavigate,
  showOrgSelector = true,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
  onNewOrganization,
  projectId,
  projectName,
  projectPlan,
  projectRegion,
  projectStatus,
}: SidebarProps) {
  const router = useRouter();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['database', 'auth']);

  const handleSignOut = () => {
    removeAuthToken();
    router.push('/auth/sign-in');
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const NavigationItem = ({
    id,
    label,
    icon: Icon,
    isSubItem = false,
  }: {
    id: string;
    label: string;
    icon: any;
    isSubItem?: boolean;
  }) => (
    <button
      onClick={() => {
        onNavigate?.(id);
        if (isMobileOpen) onMobileClose?.();
      }}
      className={`relative w-full flex items-center gap-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${activeId === id
        ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
        } ${isCollapsed ? 'justify-center px-2' : isSubItem ? 'pl-9 pr-3' : 'px-3'}`}
    >
      <Icon className={`w-4 h-4 transition-colors duration-200 ${activeId === id ? 'text-emerald-400' : 'group-hover:text-zinc-100'}`} />
      {!isCollapsed && <span className="truncate">{label}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );

  const SectionHeader = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => {
    const isExpanded = expandedSections.includes(id);
    return (
      <div className="space-y-1">
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between px-3 py-2 text-zinc-500 hover:text-zinc-300 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4" />
            {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">{label}</span>}
          </div>
          {!isCollapsed && (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </button>
        {(!isCollapsed && isExpanded) && (
          <div className="space-y-0.5 mt-1">
            {/* children handled in parent */}
          </div>
        )}
      </div>
    );
  };

  const projectMode = !!projectId;

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden animate-fade-in" onClick={onMobileClose} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[50] lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out glass border-r border-white/5 flex flex-col h-screen overflow-visible
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Logo Section */}
        <div className={`h-16 flex items-center border-b border-white/5 relative ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-200 flex-shrink-0">
              <span className="text-black font-black text-lg">A</span>
            </div>
            {!isCollapsed && <span className="text-lg font-bold tracking-tighter text-white">Afribase</span>}
          </Link>

          <button onClick={onToggleCollapse} className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-white/10 rounded-md items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all z-[60] shadow-xl">
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} strokeWidth={3} />
          </button>
        </div>

        {/* Top-level Navigation (Always visible) */}
        {!projectMode && (
          <div className={`py-4 border-b border-white/5 ${isCollapsed ? 'px-3' : 'px-4'} space-y-1`}>
            <NavigationItem id="dashboard" label="Organizations" icon={Home} />
            <NavigationItem id="projects" label="Projects" icon={Layers} />
            <NavigationItem id="forum" label="Developer Forum" icon={MessageSquare} />
            <NavigationItem id="settings" label="Global Settings" icon={Settings} />
          </div>
        )}

        {/* Project Back Button & Name */}
        {projectMode && (
          <div className={`py-4 border-b border-white/5 ${isCollapsed ? 'px-3' : 'px-4'}`}>
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors mb-4 group"
            >
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Back to Projects</span>}
            </button>

            <div className="flex items-center gap-3 w-full overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Database size={18} className="text-emerald-400" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-white truncate uppercase italic tracking-tighter">{projectName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded-[4px] bg-zinc-800 text-zinc-500 border border-white/5 text-[8px] font-black uppercase">
                      {projectStatus || 'Active'}
                    </span>
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">
                      {projectPlan || 'Free'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Contextual Navigation */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {projectMode ? (
            <>
              {/* Project Specific Sections */}
              <div className="space-y-4">
                <NavigationItem id="overview" label="Project Home" icon={LayoutGrid} />

                <div className="space-y-1">
                  <SectionHeader id="database" label="Database" icon={Database} />
                  {expandedSections.includes('database') && (
                    <div className="space-y-0.5">
                      <NavigationItem id="tables" label="Table Editor" icon={Table} isSubItem />
                      <NavigationItem id="sql" label="SQL Editor" icon={Terminal} isSubItem />
                      <NavigationItem id="api" label="API Docs" icon={Code} isSubItem />
                      <NavigationItem id="libraries" label="Client Libraries" icon={Library} isSubItem />
                      <NavigationItem id="migrations" label="Migrations" icon={ChevronRight} isSubItem />
                      <NavigationItem id="backups" label="Backups" icon={Archive} isSubItem />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <SectionHeader id="auth" label="Authentication" icon={Users} />
                  {expandedSections.includes('auth') && (
                    <div className="space-y-0.5">
                      <NavigationItem id="auth" label="Configuration" icon={Settings} isSubItem />
                      <NavigationItem id="users" label="Users" icon={Users} isSubItem />
                      <NavigationItem id="policies" label="Policies" icon={ShieldCheck} isSubItem />
                      <NavigationItem id="deeplinks" label="Deep Linking" icon={Smartphone} isSubItem />
                    </div>
                  )}
                </div>

                <NavigationItem id="storage" label="Storage" icon={HardDrive} />
                <NavigationItem id="edge-functions" label="Edge Functions" icon={Zap} />

                {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest pt-2">Integrations</div>}
                <NavigationItem id="nocode" label="No-Code Hub" icon={Share2} />
              </div>

              <div className="space-y-4 pt-2">
                {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Monitoring</div>}
                <NavigationItem id="health" label="Health" icon={HeartPulse} />
                <NavigationItem id="logs" label="Logs" icon={Terminal} />
                <NavigationItem id="usage" label="Usage" icon={BarChart3} />
              </div>

              <div className="space-y-4 pt-2">
                {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Infrastructure</div>}
                <NavigationItem id="domains" label="Custom Domains" icon={Globe} />
                <NavigationItem id="vault" label="Vault / Secrets" icon={Lock} />
                <NavigationItem id="settings" label="Project Settings" icon={Settings} />
              </div>
            </>
          ) : (
            <>
              {/* Organization/Global Level Sections */}
              <div className="space-y-4">
                <div className="px-3 py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mb-4">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1 text-center">Active Workspace</p>
                  <p className="text-xs font-bold text-white text-center truncate">{selectedOrg?.name || 'Loading...'}</p>
                </div>

                <div className="space-y-1">
                  {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Management</div>}
                  <NavigationItem id="org-settings" label="Org Settings" icon={Settings} />
                  <NavigationItem id="members" label="Members" icon={Users} />
                  <NavigationItem id="billing" label="Billing" icon={Zap} />
                </div>

                <div className="space-y-1 pt-4">
                  {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Support</div>}
                  <NavigationItem id="docs" label="Documentation" icon={Library} />
                  <NavigationItem id="support" label="Contact Support" icon={HelpCircle} />
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-white/5 space-y-1 ${isCollapsed ? 'flex flex-col items-center px-2' : ''}`}>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
