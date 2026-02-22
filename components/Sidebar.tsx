'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { removeAuthToken, Organization } from '@/lib/api';

interface SidebarProps {
  organizations?: Organization[];
  selectedOrg?: Organization | null;
  onOrgChange?: (org: Organization) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showOrgSelector?: boolean;
  projectName?: string;
  projectPlan?: string;
  projectRegion?: string;
  projectStatus?: string;
  onNewOrganization?: () => void;
  // New responsiveness props
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  organizations = [],
  selectedOrg = null,
  onOrgChange,
  activeTab = 'home',
  onTabChange,
  showOrgSelector = true,
  projectName,
  projectPlan,
  projectRegion,
  projectStatus,
  onNewOrganization,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const router = useRouter();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');

  const handleSignOut = () => {
    removeAuthToken();
    router.push('/');
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const MenuItem = ({ 
    id, 
    label, 
    icon 
  }: { 
    id: string; 
    label: string; 
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => {
        onTabChange?.(id);
        if (isMobileOpen) onMobileClose?.();
      }}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        activeTab === id
          ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
      } ${isCollapsed ? 'justify-center px-2' : ''}`}
    >
      {activeTab === id && (
        <span className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full" />
      )}
      <span className={`transition-colors duration-200 ${activeTab === id ? 'text-emerald-400' : 'group-hover:text-zinc-100'}`}>
        {icon}
      </span>
      {!isCollapsed && <span className="truncate">{label}</span>}
      
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[50] lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out glass border-r border-white/5 flex flex-col h-screen overflow-visible
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Logo Section */}
        <div className={`h-16 flex items-center border-b border-white/5 relative ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex-shrink-0">
              <span className="text-black font-black text-xl">A</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-tighter text-white">
                Afribase
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-white/10 rounded-md items-center justify-center text-zinc-400 hover:text-white hover:border-emerald-500/50 transition-all z-[60] shadow-xl"
          >
            <svg className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Project Info */}
        {projectName && (
          <div className={`py-6 border-b border-white/5 bg-white/[0.01] ${isCollapsed ? 'px-2 flex flex-col items-center' : 'px-6'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isCollapsed ? 'flex-col' : ''}`}>
              {!isCollapsed && (
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Project
                </h2>
              )}
              {projectPlan && (
                <span className="px-1.5 py-0.5 text-[9px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded uppercase">
                  {projectPlan}
                </span>
              )}
            </div>
            <p className={`text-sm font-bold text-zinc-100 truncate w-full ${isCollapsed ? 'text-center' : ''}`}>
              {isCollapsed ? projectName.charAt(0).toUpperCase() : projectName}
            </p>
          </div>
        )}

        {/* Organization Selector */}
        {showOrgSelector && !projectName && (
          <div className={`py-6 border-b border-white/5 relative ${showOrgDropdown ? 'z-30' : 'z-10'} ${isCollapsed ? 'px-3 flex justify-center' : 'px-5'}`}>
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className={`flex items-center justify-between glass rounded-xl hover:bg-white/[0.08] transition-all duration-200 border border-white/5 hover:border-white/10 shadow-sm
                ${isCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full px-3 py-2.5 text-sm'}
              `}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex-shrink-0 animate-pulse" />
                {!isCollapsed && (
                  <span className="text-zinc-200 font-bold truncate">
                    {selectedOrg?.name || 'Select'}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <svg className={`w-4 h-4 text-zinc-500 flex-shrink-0 ml-2 transition-transform duration-200 ${showOrgDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Dropdown Menu - Refined with darker bg and better blur */}
            {showOrgDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowOrgDropdown(false)} />
                <div className={`absolute left-4 right-4 mt-2 bg-zinc-950/95 backdrop-blur-2xl rounded-2xl shadow-2xl z-20 max-h-80 overflow-y-auto border border-white/10 animate-scale-in ring-1 ring-white/5
                  ${isCollapsed ? 'left-16 w-64' : ''}
                `}>
                  <div className="p-3 border-b border-white/5">
                    <div className="relative">
                      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        placeholder="Search workspace..."
                        className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="py-2">
                    {filteredOrgs.length > 0 ? (
                      filteredOrgs.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            onOrgChange?.(org);
                            setShowOrgDropdown(false);
                            setOrgSearch('');
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors group flex items-center justify-between"
                        >
                          <span className={`text-sm font-medium tracking-tight ${selectedOrg?.id === org.id ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-white'}`}>
                            {org.name}
                          </span>
                          {selectedOrg?.id === org.id && (
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)]" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-xs text-zinc-600 font-medium italic">No matches found</p>
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOrgDropdown(false);
                        onNewOrganization?.();
                      }}
                      className="w-full text-center px-4 py-2.5 text-xs font-black text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all uppercase tracking-widest"
                    >
                      + New Workspace
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-2 scrollbar-hide ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {projectName ? (
            <>
              <MenuItem
                id="overview"
                label="Overview"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
              />
              <div className="pt-6">
                {!isCollapsed && <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Database</p>}
                <MenuItem id="tables" label="Table Editor" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
                <MenuItem id="sql" label="SQL Editor" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
              </div>
            </>
          ) : (
            <>
              <MenuItem id="home" label="Projects" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
              <MenuItem id="database" label="Database" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>} />
              <MenuItem id="auth" label="Auth" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />
              <MenuItem id="storage" label="Storage" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-white/5 space-y-1 ${isCollapsed ? 'flex flex-col items-center px-2' : ''}`}>
          <MenuItem
            id="settings"
            label="Settings"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
