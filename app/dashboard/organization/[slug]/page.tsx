'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Users, FolderOpen, LogIn, ArrowRight,
  CheckCircle, Loader2, Globe, Cpu, Database
} from 'lucide-react';
import {
  isAuthenticated,
  getOrganizations,
  getOrganizationMembers,
  getProjects,
  Organization,
  Project,
} from '@/lib/api';

export default function OrganizationLandingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [org, setOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated_, setIsAuthenticated_] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authed = isAuthenticated();
    setIsAuthenticated_(authed);

    if (authed) {
      loadOrgData();
    } else {
      // Not logged in — still try to show org info by storing slug for post-login redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('invite_redirect', `/dashboard/organization/${slug}`);
      }
      setIsLoading(false);
    }
  }, [slug]);

  const loadOrgData = async () => {
    setIsLoading(true);
    try {
      // Find matching org by slug
      const orgs = await getOrganizations();
      const foundOrg = orgs.find((o) => o.slug === slug);

      if (!foundOrg) {
        setError("Organization not found or you haven't been added yet. Ask the inviter to re-send your invite.");
        setIsLoading(false);
        return;
      }

      setOrg(foundOrg);

      // Load members and projects in parallel
      const [members, allProjects] = await Promise.allSettled([
        getOrganizationMembers(foundOrg.id),
        getProjects(),
      ]);

      if (members.status === 'fulfilled') {
        setMemberCount(members.value.length);
      }

      if (allProjects.status === 'fulfilled') {
        // Filter projects that belong to this org
        const orgProjects = allProjects.value.filter(
          (p: Project) => p.organizationId === foundOrg.id
        );
        setProjects(orgProjects);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    if (org) {
      router.push(`/dashboard?orgId=${org.id}`);
    } else {
      router.push('/dashboard');
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm font-medium">Loading organization...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated ────────────────────────────────────────────────────────
  if (!isAuthenticated_) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              You've been invited!
            </h1>
            <p className="text-zinc-400 text-sm">
              Sign in or create an account to join{' '}
              <span className="text-white font-bold">
                {slug.replace(/-/g, ' ')}
              </span>{' '}
              on Afribase.
            </p>
          </div>

          {/* Invite card */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <CheckCircle className="text-emerald-500 shrink-0" size={20} />
              <p className="text-sm text-zinc-300 leading-relaxed">
                You've been invited to collaborate on <strong className="text-white">{slug}</strong>.
                Sign in to access the team workspace, projects and infrastructure.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href={`/auth/sign-in?redirect=/dashboard/organization/${slug}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 text-black text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all"
              >
                <LogIn size={16} />
                Sign In to Accept
              </Link>
              <Link
                href={`/auth/sign-up?redirect=/dashboard/organization/${slug}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 text-white text-sm font-black uppercase tracking-widest rounded-2xl border border-white/5 hover:border-white/10 transition-all"
              >
                Create Account
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-600">
            Powered by{' '}
            <span className="text-emerald-600 font-bold">Afribase</span>
            {' '}— The Open-Source Backend for Africa
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Invite Issue</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-zinc-900 border border-white/5 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:border-white/10 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated — show org overview ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#09090b] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest font-bold">
            <CheckCircle size={14} className="text-emerald-500" />
            <span>You're a member of this organization</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {org?.name}
          </h1>
          {org?.description && (
            <p className="text-zinc-400 text-base">{org.description}</p>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Users size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Members</span>
            </div>
            <p className="text-3xl font-black text-white">
              {memberCount ?? '—'}
            </p>
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <FolderOpen size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Projects</span>
            </div>
            <p className="text-3xl font-black text-white">{projects.length}</p>
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Globe size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Slug</span>
            </div>
            <p className="text-sm font-mono font-bold text-emerald-400 truncate">{slug}</p>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            Organization Projects
          </h2>

          {projects.length === 0 ? (
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-10 text-center space-y-3">
              <FolderOpen className="text-zinc-700 mx-auto" size={40} />
              <p className="text-zinc-500 text-sm">No projects in this organization yet.</p>
              <button
                onClick={() => router.push(`/dashboard/projects?orgId=${org?.id}`)}
                className="px-6 py-3 bg-emerald-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all"
              >
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/project/${project.id}?orgId=${org?.id}`}
                  className="group bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-all">
                        <Database size={18} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {project.name}
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">{project.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        project.status === 'active' || project.status === 'ACTIVE'
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-zinc-600'
                      }`} />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">{project.region}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={handleGoToDashboard}
            className="px-8 py-4 bg-emerald-500 text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-3"
          >
            Go to Full Dashboard
            <ArrowRight size={16} />
          </button>
          <Link
            href="/dashboard/settings/members"
            className="px-8 py-4 bg-zinc-900 border border-white/5 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:border-white/10 transition-all flex items-center gap-3"
          >
            <Users size={16} />
            Manage Members
          </Link>
        </div>

      </div>
    </div>
  );
}
