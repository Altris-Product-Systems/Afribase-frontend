'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeAuthToken, Organization } from '@/lib/api';
import {
  LayoutGrid,
  Database,
  Users,
  FolderLock,
  Zap,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Terminal,
  ShieldCheck,
  HardDrive,
  Activity,
  Code,
  BarChart3
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
    isSubItem = false
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
          onClick={() => !isCollapsed && toggleSection(id)}
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
            {/* children implementation will be in the nav list */}
          </div>
        )}
      </div>
    );
  };

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
            {!isCollapsed && <span className="text-lg font-bold tracking-tighter text-white">Afriibase</span>}
          </Link>

          <button onClick={onToggleCollapse} className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-white/10 rounded-md items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all z-[60] shadow-xl">
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} strokeWidth={3} />
          </button>
        </div>

        {/* Organization Selector */}
        {showOrgSelector && (
          <div className={`py-5 border-b border-white/5 relative ${isCollapsed ? 'px-3 flex justify-center' : 'px-5'}`}>
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className={`flex items-center justify-between bg-white/[0.03] rounded-xl hover:bg-white/[0.06] transition-all duration-200 border border-white/5 hover:border-white/10 ${isCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full px-3 py-2 text-sm'}`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex-shrink-0" />
                {!isCollapsed && <span className="text-zinc-200 font-bold truncate">{selectedOrg?.name || 'Select Workspace'}</span>}
              </div>
              {!isCollapsed && <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${showOrgDropdown ? 'rotate-180' : ''}`} />}
            </button>

            {showOrgDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowOrgDropdown(false)} />
                <div className={`absolute left-4 right-4 mt-2 bg-zinc-950/95 backdrop-blur-2xl rounded-2xl shadow-2xl z-20 border border-white/10 animate-scale-in ${isCollapsed ? 'left-16 w-64' : ''}`}>
                  <div className="p-3 border-b border-white/5">
                    <input
                      type="text"
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      placeholder="Filter workspaces..."
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/5 rounded-lg focus:outline-none text-white placeholder-zinc-600"
                    />
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {organizations.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase())).map(org => (
                      <button key={org.id} onClick={() => { onOrgChange?.(org); setShowOrgDropdown(false); }} className="w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors flex items-center justify-between group">
                        <span className={`text-xs font-medium ${selectedOrg?.id === org.id ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-white'}`}>{org.name}</span>
                        {selectedOrg?.id === org.id && <div className="w-1 h-1 bg-emerald-500 rounded-full" />}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-white/5">
                    <button onClick={onNewOrganization} className="w-full text-center px-4 py-2 text-[10px] font-black text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all uppercase tracking-widest">+ New Workspace</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Global Navigation */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {/* General Section */}
          <div className="space-y-1">
            <NavigationItem id="dashboard" label="Dashboard" icon={LayoutGrid} />
            <NavigationItem id="projects" label="Projects" icon={Activity} />
          </div>

          {/* Development Section */}
          <div className="space-y-4">
            {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Development</div>}

            <div className="space-y-1">
              <SectionHeader id="database" label="Database" icon={Database} />
              {(!isCollapsed && expandedSections.includes('database')) && (
                <div className="space-y-0.5">
                  <NavigationItem id="tables" label="Table Editor" icon={ChevronRight} isSubItem />
                  <NavigationItem id="sql" label="SQL Editor" icon={Terminal} isSubItem />
                  <NavigationItem id="api" label="API Docs" icon={Code} isSubItem />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <SectionHeader id="auth" label="Authentication" icon={Users} />
              {(!isCollapsed && expandedSections.includes('auth')) && (
                <div className="space-y-0.5">
                  <NavigationItem id="auth" label="Configuration" icon={Settings} isSubItem />
                  <NavigationItem id="users" label="Users" icon={Users} isSubItem />
                  <NavigationItem id="policies" label="Policies" icon={ShieldCheck} isSubItem />
                </div>
              )}
            </div>

            <NavigationItem id="storage" label="Storage" icon={HardDrive} />
            <NavigationItem id="edge-functions" label="Edge Functions" icon={Zap} />
          </div>

          {/* Infrastructure Section */}
          <div className="space-y-4 pt-2">
            {!isCollapsed && <div className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Platform</div>}
            <NavigationItem id="logs" label="Logs" icon={Activity} />
            <NavigationItem id="usage" label="Usage" icon={BarChart3} />
          </div>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-white/5 space-y-1 ${isCollapsed ? 'flex flex-col items-center px-2' : ''}`}>
          <NavigationItem id="settings" label="Settings" icon={Settings} />
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
