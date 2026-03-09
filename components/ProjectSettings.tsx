'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Pause,
    Play,
    Trash2,
    AlertTriangle,
    RefreshCw,
    Server,
    Database,
    ShieldAlert
} from 'lucide-react';
import { pauseProject, reactivateProject, deleteProject, Project } from '@/lib/api';
import toast from 'react-hot-toast';
import { useConfirm } from '@/lib/hooks/useConfirm';

interface ProjectSettingsProps {
    project: Project;
    onUpdate: () => void;
}

export default function ProjectSettings({ project, onUpdate }: ProjectSettingsProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const router = useRouter();
    const [isPausing, setIsPausing] = useState(false);
    const [isReactivating, setIsReactivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    const handlePause = async () => {
        const ok = await confirm({
            title: 'Pause Project',
            message: 'Are you sure you want to pause this project? Services will be stopped but data is safe.',
            variant: 'default',
            confirmText: 'Pause Project'
        });
        if (!ok) return;

        setIsPausing(true);
        try {
            await pauseProject(project.id);
            toast.success('Project paused successfully');
            onUpdate();
        } catch (err: any) {
            toast.error(err.message || 'Failed to pause project');
        } finally {
            setIsPausing(false);
        }
    };

    const handleReactivate = async () => {
        setIsReactivating(true);
        try {
            await reactivateProject(project.id);
            toast.success('Project reactivated successfully');
            onUpdate();
        } catch (err: any) {
            toast.error(err.message || 'Failed to reactivate project');
        } finally {
            setIsReactivating(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirm !== project.slug) {
            toast.error('Please type the project slug to confirm');
            return;
        }

        setIsDeleting(true);
        try {
            await deleteProject(project.id);
            toast.success('Project deleted successfully');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete project');
            setIsDeleting(false);
        }
    };

    const isPaused = project.status === 'paused';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Card */}
                <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isPaused ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Project Status</h3>
                            <p className="text-zinc-500 text-xs font-medium">Current state of your project services.</p>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-950/50 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                <span className={`text-sm font-black uppercase tracking-widest ${isPaused ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                Last checked: Just now
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                        {isPaused
                            ? "Your project is currently paused. No API requests will be served, but your database content is preserved. Reactivate to resume services."
                            : "Your project is healthy and serving requests. It will be automatically paused after 7 days of inactivity (Free Tier policy)."}
                    </p>

                    <div className="pt-4">
                        {isPaused ? (
                            <button
                                onClick={handleReactivate}
                                disabled={isReactivating}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
                            >
                                {isReactivating ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} fill="black" />}
                                Reactivate Project
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                disabled={isPausing}
                                className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 flex items-center justify-center gap-3"
                            >
                                {isPausing ? <RefreshCw className="animate-spin" size={16} /> : <Pause size={16} />}
                                Pause Project
                            </button>
                        )}
                    </div>
                </div>

                {/* Database Info */}
                <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Database Info</h3>
                            <p className="text-zinc-500 text-xs font-medium">Logical database details.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">DB Name</span>
                            <span className="text-xs font-bold text-zinc-300">{project.databaseName}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Region</span>
                            <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                                {project.region}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plan</span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{project.plan || 'Free'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-10">
                <div className="glass-card border border-rose-500/20 bg-rose-500/[0.02] rounded-[32px] overflow-hidden">
                    <div className="p-8 lg:p-12 space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                                <ShieldAlert size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-white tracking-tight">Danger Zone</h4>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                                    Irreversibly delete this project and all its data. This includes all database tables,
                                    auth users, and stored files. <span className="text-rose-500/80">This action is permanent and cannot be undone.</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-rose-500/10 space-y-4">
                            <label className="text-[10px] font-black text-rose-500/70 uppercase tracking-[0.2em]">
                                Type <span className="text-white mx-1">{project.slug}</span> to confirm
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                    placeholder="Enter project slug..."
                                    className="flex-1 bg-zinc-900 border border-rose-500/20 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all font-mono"
                                />
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting || deleteConfirm !== project.slug}
                                    className="px-8 py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-30 disabled:hover:bg-rose-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center gap-3 shrink-0"
                                >
                                    {isDeleting ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}
