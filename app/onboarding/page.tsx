'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrganization, createProject, getOrganizations, isAuthenticated, APIError } from '@/lib/api';
import { useLoader } from '@/components/ui/GlobalLoaderProvider';

export default function OnboardingPage() {
  const router = useRouter();
  const { setIsLoading: setGlobalLoading } = useLoader();
  const [step, setStep] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [databasePassword, setDatabasePassword] = useState('');
  const initialCheckDoneRef = useRef(false);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setDatabasePassword(password);
  };

  useEffect(() => {
    const checkExistingOrganizations = async () => {
      if (!isAuthenticated()) {
        router.push('/auth/sign-in');
        return;
      }

      setGlobalLoading(true, 'Verifying Node Access');
      try {
        const orgs = await getOrganizations();
        if (orgs.length > 0) {
          router.push('/dashboard');
          return;
        }
        setIsDataLoading(false);
      } catch (err) {
        // console.error('Failed to check organizations:', err);
        setIsDataLoading(false);
      } finally {
        setGlobalLoading(false);
      }
    };

    if (!initialCheckDoneRef.current) {
      checkExistingOrganizations();
      initialCheckDoneRef.current = true;
    }
  }, [router, setGlobalLoading]);

  const handleOrgNameChange = (name: string) => {
    setOrgName(name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setOrgSlug(slug);
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setGlobalLoading(true, 'Initializing Org Namespace');

    try {
      const org = await createOrganization({ name: orgName, slug: orgSlug });
      setOrganizationId(org.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setGlobalLoading(true, 'Provisioning New Instance');

    try {
      await createProject({ name: projectName, region, organizationId, databasePassword });
      setStep(3);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  const handleProjectNameChange = (name: string) => {
    setProjectName(name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setProjectSlug(slug);
  };

  if (isDataLoading) return null;

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mb-12 justify-center group">
          <img src="/AFR.png" alt="Afribase Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md" />
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-16 px-4">
          <div className="flex items-center gap-4">
            <StepIndicator current={step >= 1} success={step > 1} number={1} label="Identity" />
            <div className={`w-16 h-[2px] mb-6 transition-colors duration-500 ${step >= 2 ? 'bg-emerald-500' : 'bg-white/5'}`} />
            <StepIndicator current={step >= 2} success={step > 2} number={2} label="Namespace" />
            <div className={`w-16 h-[2px] mb-6 transition-colors duration-500 ${step >= 3 ? 'bg-emerald-500' : 'bg-white/5'}`} />
            <StepIndicator current={step >= 3} success={step >= 3} number={3} label="Global" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-gelatinous-in">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="bg-[#09090b] border border-white/5 p-8 lg:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Step 1: Create Organization */}
          {step === 1 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                  Establish Org
                </h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Management <span className="text-emerald-500 underline underline-offset-4">Cluster Unit</span>
                </p>
              </div>

              <form onSubmit={handleCreateOrganization} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Legal Entity Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => handleOrgNameChange(e.target.value)}
                    required
                    placeholder="e.g. Atlas Logistics"
                    className="w-full px-5 py-4 border border-white/5 rounded-xl bg-white/[0.02] text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Routing Slug</label>
                  <input
                    type="text"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value)}
                    required
                    className="w-full px-5 py-4 border border-white/5 rounded-xl bg-white/[0.02] text-zinc-400 focus:border-emerald-500/50 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !orgName || !orgSlug}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50"
                >
                  Allocate Resources
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Create Project */}
          {step === 2 && (
            <div className="animate-fade-in space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                  Init Environment
                </h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Provisioning <span className="text-emerald-500 underline underline-offset-4">Project Node</span>
                </p>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Node Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                    required
                    placeholder="Production Cluster A"
                    className="w-full px-5 py-4 border border-white/5 rounded-xl bg-white/[0.02] text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">A-Z Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-5 py-4 border border-white/5 rounded-xl bg-[#0c0c0e] text-zinc-300 focus:border-emerald-500/50 focus:outline-none transition-all"
                    >
                      <option value="lagos-01">Lagos, NG</option>
                      <option value="nairobi-01">Nairobi, KE</option>
                      <option value="cairo-01">Cairo, EG</option>
                      <option value="johannesburg-01">Joburg, ZA</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tier</label>
                    <select
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="w-full px-5 py-4 border border-white/5 rounded-xl bg-[#0c0c0e] text-zinc-300 focus:border-emerald-500/50 focus:outline-none transition-all"
                    >
                      <option value="free">Community (Free)</option>
                      <option value="pro">Base (Pro)</option>
                      <option value="team">Carrier (Team)</option>
                    </select>
                  </div>
                </div>

                {/* Database Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Database Password</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={databasePassword}
                      onChange={(e) => setDatabasePassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      className="flex-1 px-5 py-4 border border-white/5 rounded-xl bg-white/[0.02] text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:outline-none transition-all font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-4 py-2 border border-white/5 rounded-xl bg-white/[0.02] text-zinc-400 hover:text-white hover:border-emerald-500/30 transition-all text-xs font-black uppercase tracking-widest whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Save this password  it cannot be recovered.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-white/5 text-zinc-500 font-black rounded-xl hover:text-white transition-all uppercase tracking-widest text-xs"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !projectName || databasePassword.length < 8}
                    className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50"
                  >
                    Commit Instance
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center animate-gelatinous-in py-8 space-y-10">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                  Node Live
                </h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
                  Global provisioning <span className="text-emerald-500">successfully completed</span>. Your infrastructure is active.
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-5 bg-white text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs"
                >
                  Enter Command Center
                </button>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">
                    Connected to AFR-GRID-BRAVO : {region.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current, success, number, label }: { current: boolean; success: boolean; number: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 border-2 ${success ? 'bg-emerald-500 border-emerald-500 text-black' :
        current ? 'bg-zinc-900 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' :
          'bg-zinc-900 border-white/5 text-zinc-700'
        }`}>
        {success ? '✓' : number}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-500 ${current ? 'text-white' : 'text-zinc-700'}`}>
        {label}
      </span>
    </div>
  );
}
