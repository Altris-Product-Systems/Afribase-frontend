'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { createOrganization, createProject, APIError } from '@/lib/api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OnboardingModal({ isOpen, onClose, onSuccess }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Organization data
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [organizationId, setOrganizationId] = useState('');

  // Project data
  const [projectName, setProjectName] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [region, setRegion] = useState('lagos-01');
  const [plan, setPlan] = useState('free');

  const handleOrgNameChange = (name: string) => {
    setOrgName(name);
    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setOrgSlug(slug);
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const org = await createOrganization({
        name: orgName,
        slug: orgSlug,
      });
      setOrganizationId(org.id);
      setStep(2);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to create organization');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createProject({
        name: projectName,
        region,
        organizationId,
      });
      setStep(3);
      // Call onSuccess after a short delay to show the success message
      setTimeout(() => {
        resetModal();
        onSuccess();
      }, 2000);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to create project');
      }
      setIsLoading(false);
    }
  };

  const handleProjectNameChange = (name: string) => {
    setProjectName(name);
    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setProjectSlug(slug);
  };

  const resetModal = () => {
    setStep(1);
    setError('');
    setOrgName('');
    setOrgSlug('');
    setOrganizationId('');
    setProjectName('');
    setProjectSlug('');
    setRegion('lagos-01');
    setPlan('free');
    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      resetModal();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Create Organization' : step === 2 ? 'Create Project' : 'Success'}
      size="lg"
    >
      <div>
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
              step >= 1 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
              step >= 2 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
            }`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
              step >= 3 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Create Organization */}
        {step === 1 && (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Organizations help you manage your team and projects
            </p>

            <form onSubmit={handleCreateOrganization} className="space-y-5">
              <div>
                <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization name
                </label>
                <input
                  type="text"
                  id="orgName"
                  value={orgName}
                  onChange={(e) => handleOrgNameChange(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Acme Inc"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="orgSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization slug
                </label>
                <input
                  type="text"
                  id="orgSlug"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="acme-inc"
                  pattern="[a-z0-9-]+"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only lowercase letters, numbers, and hyphens
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !orgName || !orgSlug}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Create Project */}
        {step === 2 && (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Projects contain your databases, APIs, and storage
            </p>

            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => handleProjectNameChange(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="My Awesome App"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="projectSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project slug
                </label>
                <input
                  type="text"
                  id="projectSlug"
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="my-awesome-app"
                  pattern="[a-z0-9-]+"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only lowercase letters, numbers, and hyphens
                </p>
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Region
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="lagos-01">Lagos, Nigeria</option>
                  <option value="nairobi-01">Nairobi, Kenya</option>
                  <option value="cairo-01">Cairo, Egypt</option>
                  <option value="johannesburg-01">Johannesburg, South Africa</option>
                </select>
              </div>

              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan
                </label>
                <select
                  id="plan"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="free">Free - Get started</option>
                  <option value="pro">Pro - $25/month</option>
                  <option value="team">Team - $100/month</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !projectName || !projectSlug}
                  className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create project'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-3">
              You're all set!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your organization and project have been created successfully.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
