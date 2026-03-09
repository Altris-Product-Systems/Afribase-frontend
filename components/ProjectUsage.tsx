'use client';

import React, { useState, useEffect } from 'react';
import {
    Database,
    Zap,
    Users,
    HardDrive,
    BarChart3,
    Info,
    RefreshCw,
    LayoutGrid
} from 'lucide-react';
import { getProjectUsage, ProjectUsage as ProjectUsageData, Project } from '@/lib/api';
import toast from 'react-hot-toast';

interface ProjectUsageProps {
    project: Project;
}

export default function ProjectUsage({ project }: ProjectUsageProps) {
    const [usage, setUsage] = useState<ProjectUsageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUsage();
    }, [project.id]);

    const loadUsage = async () => {
        setIsLoading(true);
        try {
            const data = await getProjectUsage(project.id);
            setUsage(data);
        } catch (err: any) {
            toast.error('Failed to load usage data');
            // console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Calculating Usage...</p>
            </div>
        );
    }

    if (!usage) return null;

    const UsageCard = ({
        title,
        value,
        limit,
        percent,
        icon: Icon,
        colorClass
    }: {
        title: string,
        value: string | number,
        limit: string | number,
        percent: number,
        icon: any,
        colorClass: string
    }) => (
        <div className="glass-card rounded-[32px] p-8 border border-white/5 space-y-6 group hover:border-white/10 transition-all duration-500">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${colorClass}/10 text-${colorClass}`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{title}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                    <h4 className="text-3xl font-black text-white tracking-tighter">{value}</h4>
                    <span className="text-[10px] font-bold text-zinc-500">/ {limit}</span>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${colorClass === 'emerald-500' ? 'from-emerald-500 to-cyan-500' :
                            colorClass === 'blue-500' ? 'from-blue-500 to-indigo-500' :
                                colorClass === 'amber-500' ? 'from-amber-500 to-orange-500' :
                                    'from-purple-500 to-pink-500'} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className={`${percent > 90 ? 'text-rose-500' : 'text-zinc-600'}`}>{percent.toFixed(1)}% Used</span>
                    <span className="text-zinc-500">{project.plan || 'Free'} Plan</span>
                </div>
            </div>
        </div>
    );

    // Helper to parse sizes and convert to MB for comparison
    const parseToMB = (s: string) => {
        const value = parseFloat(s.match(/[0-9.]+/)?.[0] || '0');
        const unit = s.toUpperCase();
        if (unit.includes('GB')) return value * 1024;
        if (unit.includes('KB')) return value / 1024;
        if (unit.includes('B') && !unit.includes('KB') && !unit.includes('MB') && !unit.includes('GB')) return value / (1024 * 1024);
        return value; // Assume MB
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white tracking-tight">Project Usage</h3>
                    <p className="text-zinc-500 text-xs font-medium">Monitoring resources for your {project.plan || 'Free'} tier project.</p>
                </div>
                <button
                    onClick={loadUsage}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UsageCard
                    title="Database Size"
                    value={usage.db_size}
                    limit={usage.db_size_limit}
                    percent={(parseToMB(usage.db_size) / parseToMB(usage.db_size_limit)) * 100}
                    icon={Database}
                    colorClass="emerald-500"
                />
                <UsageCard
                    title="Bandwidth"
                    value={usage.bandwidth}
                    limit={usage.bandwidth_limit}
                    percent={(parseToMB(usage.bandwidth) / parseToMB(usage.bandwidth_limit)) * 100}
                    icon={Zap}
                    colorClass="blue-500"
                />
                <UsageCard
                    title="Storage"
                    value={usage.storage}
                    limit={usage.storage_limit}
                    percent={(parseToMB(usage.storage) / parseToMB(usage.storage_limit)) * 100}
                    icon={HardDrive}
                    colorClass="purple-500"
                />
                <UsageCard
                    title="Auth Users (MAU)"
                    value={usage.auth_users}
                    limit={usage.auth_users_limit}
                    percent={(usage.auth_users / usage.auth_users_limit) * 100}
                    icon={Users}
                    colorClass="amber-500"
                />
            </div>

            <div className="glass-card rounded-[40px] p-10 border border-white/5 relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.03] to-cyan-500/[0.03]">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <BarChart3 size={200} />
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                <Info size={18} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Usage Policy</span>
                        </div>
                        <h4 className="text-2xl font-black text-white tracking-tight">Optimized for Scale</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                            Your Free plan offers <span className="text-white">600MB Database</span> and <span className="text-white">6GB Bandwidth</span> —
                            that's 20% more than industry leaders. We calculate usage daily based on stored primitives and egress packets.
                        </p>
                        <div className="pt-4 flex gap-4">
                            <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">
                                Upgrade to Pro
                            </button>
                            <button className="px-6 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                View Invoices
                            </button>
                        </div>
                    </div>

                    <div className="w-px h-32 bg-white/10 hidden md:block" />

                    <div className="grid grid-cols-2 gap-8 shrink-0">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-600 uppercase">Rows</p>
                            <p className="text-xl font-black text-white">{usage.row_count.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-600 uppercase">Avg Response</p>
                            <p className="text-xl font-black text-white">12ms</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-600 uppercase">Uptime</p>
                            <p className="text-xl font-black text-white">99.9%</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-600 uppercase">Region</p>
                            <p className="text-xl font-black text-white">{project.region}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
