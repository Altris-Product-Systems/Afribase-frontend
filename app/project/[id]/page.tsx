'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Activity, Database, Zap, Users, Globe } from 'lucide-react';
import { getProjects, getProjectKeys, getOrganizations, isAuthenticated, Project, ProjectKeys, Organization } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import AuthSettings from '@/components/AuthSettings';
import AuthUsers from '@/components/AuthUsers';
import AuthPolicies from '@/components/AuthPolicies';
import ApiDocs from '@/components/ApiDocs';
import ProjectSettings from '@/components/ProjectSettings';
import ProjectUsage from '@/components/ProjectUsage';
import StorageManager from '@/components/StorageManager';
import FunctionsManager from '@/components/FunctionsManager';
import CronManager from '@/components/CronManager';
import LogsManager from '@/components/LogsManager';
import MigrationsManager from '@/components/MigrationsManager';
import SqlEditor from '@/components/SqlEditor';
import TableEditor from '@/components/TableEditor';
import BackupsManager from '@/components/BackupsManager';
import BranchesManager from '@/components/BranchesManager';
import WebhooksManager from '@/components/WebhooksManager';
import VaultManager from '@/components/VaultManager';
import SSOManager from '@/components/SSOManager';
import DomainsManager from '@/components/DomainsManager';
import NetworkRestrictions from '@/components/NetworkRestrictions';
import PoolerConfig from '@/components/PoolerConfig';
import RealtimeConfig from '@/components/RealtimeConfig';
import LogDrainsManager from '@/components/LogDrainsManager';
import AdvancedConfig from '@/components/AdvancedConfig';
import ForumManager from '@/components/ForumManager';
import HealthMonitor from '@/components/HealthMonitor';
import NocodeManager from '@/components/NocodeManager';
import DeepLinkManager from '@/components/DeepLinkManager';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [keys, setKeys] = useState<ProjectKeys | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/sign-in');
      return;
    }

    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }

    loadProjectData();
  }, [projectId, router, searchParams]);

  const loadProjectData = async () => {
    try {
      const projectsList = await getProjects();
      const foundProject = projectsList.find(p => p.id === projectId || p.slug === projectId);

      if (!foundProject) {
        setError('Project not found');
        setIsLoading(false);
        return;
      }

      setProject(foundProject);

      // Load organizations
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
        // Find and set the organization that owns this project
        const projectOrg = orgs.find(o => o.id === foundProject.organizationId);
        if (projectOrg) {
          setSelectedOrg(projectOrg);
        }
      } catch (err) {
        console.error('Failed to load organizations:', err);
      }

      // Try to fetch keys
      try {
        const projectKeys = await getProjectKeys(foundProject.id);
        setKeys(projectKeys);
      } catch (err) {
        console.error('Failed to load project keys:', err);
      }
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Project not found</h2>
          <Link href="/dashboard" className="text-green-600 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = project.status === 'active' || project.status === 'ACTIVE'
    ? 'bg-green-500'
    : project.status === 'paused'
      ? 'bg-yellow-500'
      : 'bg-gray-500';

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Sidebar */}
      <Sidebar
        organizations={organizations}
        selectedOrg={selectedOrg}
        onOrgChange={(org) => {
          setSelectedOrg(org);
          router.push('/dashboard');
        }}
        activeId={activeTab}
        onNavigate={(id) => {
          setActiveTab(id);
          router.push(`/project/${projectId}?tab=${id}`);
        }}
        showOrgSelector={false}
        projectName={project.name}
        projectPlan={project.plan || 'FREE'}
        projectRegion={project.region}
        projectStatus={project.status}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-black dark:text-white">{project.name}</h1>
            <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded uppercase">
              {project.plan || 'NANO'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Connect
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Project URL */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">PROJECT URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-black dark:text-white">
                    {`http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/rest/v1/${project.slug}`}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/rest/v1/${project.slug}`)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Project Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Status */}
                <div className="glass-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={64} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Live Status</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${statusColor}`} />
                      <span className="text-2xl font-black text-white capitalize tracking-tight">
                        {project.status || 'Healthy'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Database Metrics */}
                <div className="glass-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database size={64} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">DB Size</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white tracking-tight">12.4</span>
                      <span className="text-xs font-bold text-zinc-500">MB</span>
                    </div>
                  </div>
                </div>

                {/* API Requests */}
                <div className="glass-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={64} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Requests</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white tracking-tight">842</span>
                      <span className="text-xs font-bold text-zinc-500">/ 24h</span>
                    </div>
                  </div>
                </div>

                {/* Auth Users */}
                <div className="glass-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={64} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Total Users</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white tracking-tight">24</span>
                      <span className="text-xs font-bold text-zinc-500">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Health Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-[32px] p-8 border border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">Service Health</h3>
                      <p className="text-zinc-500 text-xs font-medium">Real-time performance metrics for {project.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase">System Optimal</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* CPU Usage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CPU Usage</span>
                        <span className="text-xs font-bold text-white">12%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[12%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      </div>
                    </div>

                    {/* Memory Usage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Memory</span>
                        <span className="text-xs font-bold text-white">142MB / 512MB</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[28%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      </div>
                    </div>

                    {/* Network I/O */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Network I/O</span>
                        <span className="text-xs font-bold text-white">2.4 MB/s</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-[32px] p-8 border border-white/5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white tracking-tight">Active Plan</h3>
                    <p className="text-zinc-500 text-xs font-medium">Your current subscription tier</p>
                  </div>

                  <div className="py-8">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 tracking-tighter uppercase">
                      {project.plan || 'Free'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-200 transition-all">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Database */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Primary Database</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Globe size={18} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white">{project.region}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{project.databaseName || `${project.slug}-db`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys */}
              {keys && (
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black dark:text-white">API Keys</h3>
                    <button
                      onClick={() => setShowApiKeys(!showApiKeys)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      {showApiKeys ? 'Hide' : 'Show'} keys
                    </button>
                  </div>

                  {showApiKeys && (
                    <div className="space-y-4">
                      {/* Anon Key */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Anon (public) key
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-black dark:text-white truncate">
                            {keys.anon_key}
                          </code>
                          <button
                            onClick={() => copyToClipboard(keys.anon_key)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Service Key */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Service (secret) key
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-black dark:text-white truncate">
                            {keys.service_key}
                          </code>
                          <button
                            onClick={() => copyToClipboard(keys.service_key)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* REST URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Rest API URL
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-black dark:text-white truncate">
                            {`http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/rest/v1/${project.slug}`}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/rest/v1/${project.slug}`)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Auth URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Auth API URL
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-black dark:text-white truncate">
                            {`http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/auth/v1/${project.slug}`}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/auth/v1/${project.slug}`)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="max-w-6xl mx-auto">
              <AuthSettings projectId={project.id} />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="max-w-6xl mx-auto">
              <AuthUsers projectId={project.id} />
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="max-w-6xl mx-auto">
              <AuthPolicies projectId={project.id} />
            </div>
          )}

          {activeTab === 'api' && (
            <div className="max-w-6xl mx-auto">
              <ApiDocs
                projectId={project.id}
                projectSlug={project.slug}
                anonKey={keys?.anon_key}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-6xl mx-auto">
              <ProjectSettings project={project} onUpdate={loadProjectData} />
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="max-w-6xl mx-auto">
              <ProjectUsage project={project} />
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <StorageManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'edge-functions' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <FunctionsManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'cron' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <CronManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <LogsManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'migrations' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <MigrationsManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <TableEditor projectId={project.id} />
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <SqlEditor projectId={project.id} />
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <BackupsManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <BranchesManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <WebhooksManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <VaultManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'sso' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <SSOManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <DomainsManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'network' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <NetworkRestrictions projectId={project.id} />
            </div>
          )}

          {activeTab === 'pooler' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <PoolerConfig projectId={project.id} />
            </div>
          )}

          {activeTab === 'realtime' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <RealtimeConfig projectId={project.id} />
            </div>
          )}

          {activeTab === 'log-drains' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <LogDrainsManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <AdvancedConfig projectId={project.id} />
            </div>
          )}

          {activeTab === 'forum' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <ForumManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'health' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <HealthMonitor projectId={project.id} />
            </div>
          )}

          {activeTab === 'nocode' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <NocodeManager projectId={project.id} />
            </div>
          )}

          {activeTab === 'deeplinks' && (
            <div className="max-w-6xl mx-auto h-full p-4">
              <DeepLinkManager projectId={project.id} projectSlug={project.slug} />
            </div>
          )}

          {!['dashboard', 'auth', 'users', 'policies', 'api', 'settings', 'usage', 'storage', 'edge-functions', 'cron', 'logs', 'migrations', 'tables', 'sql', 'backups', 'branches', 'webhooks', 'vault', 'sso', 'domains', 'network', 'pooler', 'realtime', 'log-drains', 'advanced', 'forum', 'health', 'nocode', 'deeplinks'].includes(activeTab) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This section is under construction
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
