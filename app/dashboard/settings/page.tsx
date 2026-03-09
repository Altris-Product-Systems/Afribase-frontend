'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Globe, Shield, CreditCard, ChevronRight, Users, Trash2, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteOrganization, getOrganizations, Organization } from '@/lib/api';
import toast from 'react-hot-toast';
import { useConfirm } from '@/lib/hooks/useConfirm';

export default function SettingsPage() {
  const { confirm, ConfirmDialog } = useConfirm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId');

  const [isDeleting, setIsDeleting] = useState(false);
  const [org, setOrg] = useState<Organization | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (orgId) {
      loadOrg();
    }
  }, [orgId]);

  const loadOrg = async () => {
    try {
      const orgs = await getOrganizations();
      const currentOrg = orgs.find(o => o.id === orgId);
      if (currentOrg) {
        setOrg(currentOrg);
      }
    } catch (err) {
      // console.error('Failed to load organization:', err);
    }
  };

  const handleDeleteOrg = async () => {
    if (!org) return;
    if (deleteConfirm !== org.slug) {
      toast.error('Please type the workspace slug to confirm');
      return;
    }

    const ok = await confirm({
      title: 'Delete Workspace',
      message: 'This will permanently delete the workspace and all its projects. Are you absolutely sure?',
      variant: 'danger',
      confirmText: 'Delete Permanently'
    });
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deleteOrganization(org.id);
      toast.success('Workspace deleted successfully');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete workspace');
    } finally {
      setIsDeleting(false);
    }
  };

  const SettingItem = ({ icon: Icon, title, description, onClick }: { icon: any, title: string, description: string, onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="w-full text-left p-6 glass-card rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group flex items-start gap-5"
    >
      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{description}</p>
      </div>
      <ChevronRight className="text-zinc-700 group-hover:text-zinc-400 transition-colors self-center" size={20} />
    </button>
  );

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          Settings {org && <span className="text-zinc-600 font-medium">/ {org.name}</span>}
        </h1>
        <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
          Manage your organization, billing, and global platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        <SettingItem
          icon={User}
          title="General Settings"
          description="Update your organization name, slug, and project defaults."
        />
        <SettingItem
          icon={Globe}
          title="Domain & Network"
          description="Configure custom domains, SSL certificates, and IP whitelisting."
        />
        <SettingItem
          icon={Shield}
          title="Security & Access"
          description="Manage API keys, environment secrets, and advanced RLS settings."
        />
        <SettingItem
          icon={Users}
          title="Team Members"
          description="Invite your collaborators and manage their roles and permissions."
          onClick={() => {
            router.push(`/dashboard/settings/members${orgId ? `?orgId=${orgId}` : ''}`);
          }}
        />
        <SettingItem
          icon={CreditCard}
          title="Billing & Plan"
          description="Overview of your current plan, usage limits, and invoices."
        />
      </div>

      {org && (
        <div className="pt-10">
          <div className="p-8 border border-rose-500/20 bg-rose-500/[0.02] rounded-3xl space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-rose-500">Danger Zone</h4>
                <p className="text-xs text-zinc-500 max-w-md font-medium leading-relaxed">
                  Irreversibly delete this workspace and all its projects.
                  This action <span className="text-rose-500">cannot be undone</span>.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-rose-500/10 space-y-4">
              <label className="text-[10px] font-black text-rose-500/70 uppercase tracking-widest block">
                Type <span className="text-white mx-1">{org.slug}</span> to confirm
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Enter workspace slug..."
                  className="flex-1 bg-zinc-900 border border-rose-500/20 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all font-mono"
                />
                <button
                  onClick={handleDeleteOrg}
                  disabled={isDeleting || deleteConfirm !== org.slug}
                  className="px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-30 disabled:hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-500/10 flex items-center gap-2"
                >
                  {isDeleting ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
                  Delete Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}
