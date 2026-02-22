'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getOrganizations, isAuthenticated, removeAuthToken, Project, Organization } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');

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

  const handleSignOut = () => {
    removeAuthToken();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-black dark:bg-white rounded-md flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-lg">A</span>
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">
              Afribase
            </span>
          </Link>
        </div>

        {/* Organization Selector */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="w-full px-3 py-2 flex items-center justify-between text-sm border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
              {selectedOrg?.name || 'Select Organization'}
            </span>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showOrgDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowOrgDropdown(false)}
              />
              <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto">
                {/* Search */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                  <input
                    type="text"
                    placeholder="Find organization..."
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border-0 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Selected Organization */}
                {selectedOrg && (
                  <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => {
                        setShowOrgDropdown(false);
                      }}
                      className="w-full px-3 py-2 flex items-center justify-between text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">{selectedOrg.name}</span>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* All Organizations */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedOrg(null);
                      setShowOrgDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    All Organizations
                  </button>
                </div>

                {/* Organization List */}
                {organizations.length > 0 && selectedOrg && (
                  <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                    {organizations
                      .filter(org => org.id !== selectedOrg?.id)
                      .map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            setSelectedOrg(org);
                            setShowOrgDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          {org.name}
                        </button>
                      ))}
                  </div>
                )}

                {/* New Organization */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    href="/onboarding"
                    onClick={() => setShowOrgDropdown(false)}
                    className="w-full px-3 py-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New organization
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'database'
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Database
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'auth'
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Authentication
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'storage'
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Storage
          </button>
          <button
            onClick={() => setActiveTab('functions')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'functions'
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Functions
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>

        {/* User Menu */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-black dark:text-white">
              {selectedOrg ? `${selectedOrg.name} projects` : 'All projects'}
            </h1>
            {projects.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({projects.length})
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">\n          {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Header with Organization Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
                {selectedOrg ? selectedOrg.name : 'All projects'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedOrg 
                  ? `${projects.length} project${projects.length !== 1 ? 's' : ''} in this organization`
                  : 'Manage and monitor all your Afribase projects'
                }
              </p>
            </div>
            <Link
              href="/projects/new"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New project
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for a project"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-black dark:focus:border-white focus:outline-none transition-colors text-sm"
              />
            </div>
            <button className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2">
              Status
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {projects.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4\" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              {selectedOrg ? `No projects in ${selectedOrg.name}` : 'No projects yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first project
            </p>
            <Link
              href="/projects/new"
              className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              New project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-black group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-black dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {project.region}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">ACTIVE</span>
                    </div>
                    <span className="text-xs text-gray-400">\u2022</span>
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium rounded uppercase">
                      {project.plan || 'FREE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
