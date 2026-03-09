'use client';

import React, { useState } from 'react';
import {
    Activity,
    Bell,
    RefreshCw,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Settings,
    Clock,
    HeartPulse
} from 'lucide-react';

interface HealthMonitorProps {
    projectId: string;
}

export default function HealthMonitor({ projectId }: HealthMonitorProps) {
    const [alertingEnabled, setAlertingEnabled] = useState(true);
    const [autoRecoveryEnabled, setAutoRecoveryEnabled] = useState(true);

    const services = [
        { name: 'Database', status: 'healthy', latency: '12ms', uptime: '99.99%' },
        { name: 'Auth', status: 'healthy', latency: '45ms', uptime: '99.95%' },
        { name: 'Storage', status: 'healthy', latency: '89ms', uptime: '100%' },
        { name: 'Edge Functions', status: 'degraded', latency: '450ms', uptime: '98.2%' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <HeartPulse className="text-emerald-500" />
                        Health & Monitoring
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Monitor project health, configure alerts, and enable auto-recovery.
                    </p>
                </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service) => (
                    <div key={service.name} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{service.name}</span>
                            {service.status === 'healthy' ? (
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                                <AlertCircle size={16} className="text-yellow-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Uptime</span>
                                <span className="font-medium text-zinc-200">{service.uptime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Latency</span>
                                <span className="font-medium text-zinc-200">{service.latency}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerting Configuration */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="text-blue-500" size={20} />
                            <h3 className="font-bold">Real-time Alerting</h3>
                        </div>
                        <button
                            onClick={() => setAlertingEnabled(!alertingEnabled)}
                            className={`w-10 h-5 rounded-full relative transition-colors ${alertingEnabled ? 'bg-emerald-600' : 'bg-zinc-800'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${alertingEnabled ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <p className="text-sm text-zinc-500">
                        Receive instant notifications via Email or Slack when services are degraded or down.
                    </p>
                    <div className="pt-2">
                        <button className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                            <Settings size={12} />
                            Configure alert destinations
                        </button>
                    </div>
                </div>

                {/* Auto-Recovery Configuration */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="text-purple-500" size={20} />
                            <h3 className="font-bold">Auto-Recovery</h3>
                        </div>
                        <button
                            onClick={() => setAutoRecoveryEnabled(!autoRecoveryEnabled)}
                            className={`w-10 h-5 rounded-full relative transition-colors ${autoRecoveryEnabled ? 'bg-emerald-600' : 'bg-zinc-800'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoRecoveryEnabled ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <p className="text-sm text-zinc-500">
                        Automatically restart services and run health checks when failures are detected.
                    </p>
                    <div className="pt-2 flex gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500/80 uppercase">
                            <ShieldCheck size={12} />
                            Active
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-zinc-500 uppercase">
                            <Clock size={12} />
                            Last check: 2m ago
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Logs */}
            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        <Activity size={16} />
                        Recent Health Events
                    </h3>
                </div>
                <div className="divide-y divide-zinc-800">
                    <div className="p-4 flex items-center justify-between hover:bg-zinc-900/20 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-500/10 rounded">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Database backup completed</p>
                                <p className="text-xs text-zinc-500">12:45 PM Today</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Success</span>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-zinc-900/20 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-yellow-500/10 rounded">
                                <AlertCircle size={14} className="text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Edge Function high latency detected</p>
                                <p className="text-xs text-zinc-500">11:30 AM Today</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Degraded</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
