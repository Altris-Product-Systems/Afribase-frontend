'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    getOrganizationMembers,
    inviteOrganizationMember,
    removeOrganizationMember,
    User,
    InviteMemberRequest,
    MemberResponse
} from '@/lib/api';
import { Users, Mail, Shield, UserPlus, Trash2, ChevronLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '@/lib/hooks/useConfirm';

export default function MembersPage() {
    const { confirm, ConfirmDialog } = useConfirm();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orgId = searchParams.get('orgId');

    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

    useEffect(() => {
        if (orgId) {
            loadMembers();
        }
    }, [orgId]);

    const loadMembers = async () => {
        if (!orgId) return;
        setIsLoading(true);
        try {
            const data = await getOrganizationMembers(orgId);
            setMembers(data);
        } catch (err) {
            console.error('Failed to load members:', err);
            toast.error('Failed to load team members');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgId || !inviteEmail) return;

        setIsInviting(true);
        try {
            await inviteOrganizationMember(orgId, {
                email: inviteEmail,
                role: inviteRole
            });
            toast.success(`Invitation sent to ${inviteEmail}`);
            setInviteEmail('');
            loadMembers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to send invitation');
        } finally {
            setIsInviting(false);
        }
    };

    const handleRemove = async (userId: string) => {
        if (!orgId) return;
        const ok = await confirm({
            title: 'Remove Member',
            message: 'Are you sure you want to remove this member?',
            variant: 'danger',
            confirmText: 'Remove Member'
        });
        if (!ok) return;

        try {
            await removeOrganizationMember(orgId, userId);
            toast.success('Member removed');
            loadMembers();
        } catch (err: any) {
            toast.error(err.message || 'Failed to remove member');
        }
    };

    return (
        <div className="p-8 lg:p-10 max-w-5xl mx-auto space-y-10 animate-gelatinous-in">
            {/* Breadcrumbs/Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
                <ChevronLeft size={16} />
                Back to Settings
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
                        <Users className="text-emerald-500" size={36} />
                        Team Members
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-md leading-relaxed font-medium">
                        Manage who has access to this organization and its projects.
                    </p>
                </div>

                <button
                    onClick={loadMembers}
                    className="p-3 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white rounded-xl transition-all"
                >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Invite Form */}
                <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6 h-fit sticky top-8">
                    <div className="flex items-center gap-3">
                        <UserPlus className="text-emerald-500" size={20} />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Invite Collaborator</h3>
                    </div>

                    <form onSubmit={handleInvite} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Role</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['member', 'admin'] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setInviteRole(r)}
                                        className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${inviteRole === r
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                                            : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isInviting || !inviteEmail}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.3)]"
                        >
                            {isInviting ? <RefreshCw size={16} className="animate-spin" /> : <UserPlus size={16} />}
                            Send Invitation
                        </button>
                    </form>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 size={12} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Team Tip</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                            Admins can manage billing and other members. Members can only view and edit projects.
                        </p>
                    </div>
                </div>

                {/* Members List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Current Members ({members.length})</h3>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : members.length === 0 ? (
                        <div className="py-20 text-center glass-card rounded-3xl border border-dashed border-white/10">
                            <Users size={40} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-zinc-500 text-sm font-medium">No members found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.user.id}
                                    className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 text-emerald-500">
                                            {member.user.user_metadata?.avatar_url ? (
                                                <img src={member.user.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-black">{member.user.email.slice(0, 1).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">
                                                {member.user.user_metadata?.full_name || member.user.email.split('@')[0] || member.user.name}
                                                {member.role === 'owner' && (
                                                    <span className="ml-2 text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Owner</span>
                                                )}
                                            </h4>
                                            <p className="text-zinc-500 text-[10px] font-medium">{member.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Shield size={10} className={member.role === 'member' ? 'text-zinc-500' : 'text-emerald-500'} />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{member.role}</span>
                                            </div>
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                                                {member.role === 'owner' ? 'Full Control' : member.role === 'admin' ? 'Management Access' : 'Read/Write Access'}
                                            </span>
                                        </div>

                                        {member.role !== 'owner' && (
                                            <button
                                                onClick={() => handleRemove(member.user.id)}
                                                className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
