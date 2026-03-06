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
      // console.error('Failed to load organizations:', err);
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
      onClose();
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
        <p className="text-zinc-400 text-sm mb-6">
          Your project will have its own dedicated instance and full Postgres database.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organization */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
              Organization
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-left bg-black/40 border border-white/10 rounded-xl hover:border-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    {selectedOrg?.name || 'Select organization'}
                  </span>
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="absolute z-20 w-full mt-2 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-2">
                    <div className="pb-2">
                      <input
                        type="text"
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        placeholder="Search organizations..."
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-1">
                      {filteredOrgs.map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => {
                            setSelectedOrg(org);
                            setShowOrgDropdown(false);
                            setOrgSearch('');
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group"
                        >
                          <span className="text-zinc-300 group-hover:text-white text-sm font-medium">{org.name}</span>
                          {selectedOrg?.id === org.id && (
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
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
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
              Project name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My awesome project"
              disabled={isSubmitting}
              required
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
              Description <span className="text-zinc-600 font-medium normal-case tracking-normal text-[10px] ml-1">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your project about?"
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Database Password */}
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
              Database password
            </label>
            <div className="relative">
              <input
                type="text"
                value={databasePassword}
                onChange={(e) => setDatabasePassword(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={isSubmitting}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed pr-24"
              />
              <button
                type="button"
                onClick={generatePassword}
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white bg-zinc-900 border border-white/5 rounded-lg transition-all"
              >
                Generate
              </button>
            </div>
            <p className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              This password is required to access your full Postgres database.
            </p>
          </div>

          {/* Region */}
          <div className="z-10 relative">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
              Region
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-left bg-black/40 border border-white/10 rounded-xl hover:border-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{selectedRegion?.name}</span>
                  </div>
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="absolute bottom-full mb-2 z-20 w-full bg-zinc-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-2">
                    <div className="max-h-52 overflow-y-auto space-y-1">
                      {regions.map((reg) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => {
                            setRegion(reg.id);
                            setShowRegionDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between group"
                        >
                          <span className="text-zinc-300 group-hover:text-white text-sm font-medium">{reg.name}</span>
                          {reg.id === region && (
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
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
            <p className="mt-2 text-[10px] text-zinc-500">
              Select the region closest to your users for the best performance.
            </p>
          </div>

          {/* Security & Advanced Configuration */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Security Configuration</h3>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={enableDataApi}
                  onChange={(e) => setEnableDataApi(e.target.checked)}
                  disabled={isSubmitting}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors border border-white/5 ${enableDataApi ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
                <div className={`absolute left-1 top-1 bg-white shadow-sm w-4 h-4 rounded-full transition-transform ${enableDataApi ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Enable Data API</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-medium leading-relaxed">Autogenerate a RESTful API for your public schema using PostgREST.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={enableRls}
                  onChange={(e) => setEnableRls(e.target.checked)}
                  disabled={isSubmitting}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors border border-white/5 ${enableRls ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
                <div className={`absolute left-1 top-1 bg-white shadow-sm w-4 h-4 rounded-full transition-transform ${enableRls ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Enable automatic RLS</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-medium leading-relaxed">Enforce Row Level Security heavily on your databases automatically.</p>
              </div>
            </label>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-3 rounded-xl flex gap-2 items-start mt-6">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[10px] font-medium leading-relaxed">These settings cannot be changed easily after the project is created without manual intervention.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedOrg || !projectName.trim()}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creating project...
                </>
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
