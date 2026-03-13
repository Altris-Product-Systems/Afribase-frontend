'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, getOrganizations, Organization, APIError } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('lagos-01');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [databasePassword, setDatabasePassword] = useState('');

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setDatabasePassword(password);
  };

  const regions = [
    { id: 'lagos-01', name: 'Lagos, Nigeria' },
    { id: 'accra-01', name: 'Accra, Ghana' },
    { id: 'nairobi-01', name: 'Nairobi, Kenya' },
    { id: 'cape-town-01', name: 'Cape Town, South Africa' },
    { id: 'cairo-01', name: 'Cairo, Egypt' },
  ];

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await getOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        setSelectedOrg(orgs[0]);
      }
    } catch (err) {
      // console.error('Failed to load organizations:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrg) {
      setError('Please select an organization');
      return;
    }

    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createProject({
        name: projectName,
        description: description || undefined,
        region: region,
        organizationId: selectedOrg.id,
        databasePassword,
      });

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to create project. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const selectedRegion = regions.find(r => r.id === region);
  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-lg font-semibold text-black dark:text-white">
                {selectedOrg?.name || 'Organization'}
              </span>
              {selectedOrg && (
                <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded">
                  FREE
                </span>
              )}
            </div>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <span className="text-gray-600 dark:text-gray-400">New project</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
              Feedback
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
              Create a new project
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your project will have its own dedicated instance and full Postgres database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Organization
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                  className="w-full px-4 py-2.5 text-left bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-black dark:text-white">
                        {selectedOrg?.name || 'Select organization'}
                      </span>
                      {selectedOrg && (
                        <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded">
                          FREE
                        </span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showOrgDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-2">
                      <input
                        type="text"
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        placeholder="Search organizations..."
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredOrgs.map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => {
                            setSelectedOrg(org);
                            setShowOrgDropdown(false);
                            setOrgSearch('');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-black dark:text-white">{org.name}</span>
                              <span className="px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded">
                                FREE
                              </span>
                            </div>
                            {selectedOrg?.id === org.id && (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => router.push('/onboarding')}
                        className="w-full px-4 py-2 text-left text-green-600 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        + New organization
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My awesome project"
                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is your project about?"
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors resize-none"
              />
            </div>

            {/* Database Password */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Database Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={databasePassword}
                  onChange={(e) => setDatabasePassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Save this password  it cannot be recovered once set.</p>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Region
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="w-full px-4 py-2.5 text-left bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-black dark:text-white">{selectedRegion?.name}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showRegionDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    {regions.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRegion(r.id);
                          setShowRegionDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-black dark:text-white">{r.name}</span>
                          </div>
                          {region === r.id && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Select the region closest to your users for the best performance.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating project...' : 'Create new project'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
