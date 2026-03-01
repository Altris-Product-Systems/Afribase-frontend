'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { createProject, getOrganizations, Organization, APIError } from '@/lib/api';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedOrgId?: string;
}

export default function ProjectModal({ isOpen, onClose, onSuccess, preselectedOrgId }: ProjectModalProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('lagos-01');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [databasePassword, setDatabasePassword] = useState('');
  const [enableDataApi, setEnableDataApi] = useState(true);
  const [enableRls, setEnableRls] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orgSearch, setOrgSearch] = useState('');

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
    if (isOpen) {
      loadOrganizations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedOrgId && organizations.length > 0) {
      const org = organizations.find(o => o.id === preselectedOrgId);
      if (org) {
        setSelectedOrg(org);
      }
    }
  }, [preselectedOrgId, organizations]);

  const loadOrganizations = async () => {
    try {
      const orgs = await getOrganizations();
      setOrganizations(orgs);

      // If preselected org ID is provided, select it
      if (preselectedOrgId) {
        const org = orgs.find(o => o.id === preselectedOrgId);
        if (org) {
          setSelectedOrg(org);
        } else if (orgs.length > 0) {
          setSelectedOrg(orgs[0]);
        }
      } else if (orgs.length > 0) {
        setSelectedOrg(orgs[0]);
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
      setError('Failed to load organizations');
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
        databasePassword: databasePassword,
        enableDataApi: enableDataApi,
        enableRls: enableRls,
      });

      resetModal();
      onSuccess();
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to create project. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setProjectName('');
    setDescription('');
    setRegion('lagos-01');
    setDatabasePassword('');
    setEnableDataApi(true);
    setEnableRls(false);
    setError('');
    setIsSubmitting(false);
    setOrgSearch('');
    setShowOrgDropdown(false);
    setShowRegionDropdown(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetModal();
      onClose();
    }
  };

  const selectedRegion = regions.find(r => r.id === region);
  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a new project"
      size="lg"
    >
      <div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your project will have its own dedicated instance and full Postgres database.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Organization
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-left bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className="text-black dark:text-white">
                    {selectedOrg?.name || 'Select organization'}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {showOrgDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowOrgDropdown(false)}
                  />
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
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
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors flex items-center justify-between"
                        >
                          <span className="text-black dark:text-white">{org.name}</span>
                          {selectedOrg?.id === org.id && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
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
              disabled={isSubmitting}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Database Password */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Database password
            </label>
            <div className="relative">
              <input
                type="password"
                value={databasePassword}
                onChange={(e) => setDatabasePassword(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={isSubmitting}
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed pr-24"
              />
              <button
                type="button"
                onClick={generatePassword}
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 bg-gray-100 dark:bg-gray-800 rounded transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              This password is required to access your full Postgres database.
            </p>
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
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-left bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowRegionDropdown(false)}
                  />
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    {regions.map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => {
                          setRegion(reg.id);
                          setShowRegionDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors flex items-center gap-2"
                      >
                        <span className="text-black dark:text-white">{reg.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select the region closest to your users for the best performance.
            </p>
          </div>

          {/* Security & Advanced Configuration */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
            <h3 className="text-sm font-medium text-black dark:text-white">Security Configuration</h3>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={enableDataApi}
                  onChange={(e) => setEnableDataApi(e.target.checked)}
                  disabled={isSubmitting}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${enableDataApi ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enableDataApi ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white">Enable Data API</p>
                <p className="text-xs text-gray-500 mt-1">Autogenerate a RESTful API for your public schema using PostgREST.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={enableRls}
                  onChange={(e) => setEnableRls(e.target.checked)}
                  disabled={isSubmitting}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${enableRls ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enableRls ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white">Enable automatic RLS</p>
                <p className="text-xs text-gray-500 mt-1">Enforce Row Level Security heavily on your databases automatically.</p>
              </div>
            </label>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-xs mt-4">
              <p><strong>Note:</strong> These settings cannot be changed easily after the project is created without manual intervention.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selectedOrg || !projectName.trim()}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating project...
                </span>
              ) : (
                'Create project'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
