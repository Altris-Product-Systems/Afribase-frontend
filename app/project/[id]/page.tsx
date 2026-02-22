'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectKeys, getOrganizations, isAuthenticated, Project, ProjectKeys, Organization } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import AuthSettings from '@/components/AuthSettings';
import AuthUsers from '@/components/AuthUsers';
import AuthPolicies from '@/components/AuthPolicies';
import ApiDocs from '@/components/ApiDocs';

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
                    {project.postgrestUrl || `https://${project.slug}.afribase.co`}
                  </code>
                  <button
                    onClick={() => copyToClipboard(project.postgrestUrl || `https://${project.slug}.afribase.co`)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Project Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">STATUS</span>
                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
                    <span className="text-lg font-semibold text-black dark:text-white capitalize">
                      {project.status || 'Healthy'}
                    </span>
                  </div>
                </div>

                {/* Last Migration */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LAST MIGRATION</span>
                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    No migrations
                  </p>
                </div>

                {/* Last Backup */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LAST BACKUP</span>
                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    No backups
                  </p>
                </div>

                {/* Recent Branch */}
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">RECENT BRANCH</span>
                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    No branches
                  </p>
                </div>
              </div>

              {/* Primary Database */}
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Primary Database</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🇳🇬</span>
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

                      {/* PostgREST URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          PostgREST URL
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-black dark:text-white truncate">
                            {keys.postgrest_url}
                          </code>
                          <button
                            onClick={() => copyToClipboard(keys.postgrest_url)}
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

          {activeTab !== 'dashboard' && activeTab !== 'auth' && activeTab !== 'users' && activeTab !== 'policies' && activeTab !== 'api' && (
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
