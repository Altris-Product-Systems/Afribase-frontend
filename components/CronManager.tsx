import React, { useState, useEffect } from 'react';
import { Activity, Plus, Trash2, Clock, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { getCronJobs, createCronJob, deleteCronJob } from '@/lib/api';
import { useConfirm } from '@/lib/hooks/useConfirm';
import toast from 'react-hot-toast';

interface CronManagerProps {
    projectId: string;
}

export default function CronManager({ projectId }: CronManagerProps) {
    const { confirm, ConfirmDialog } = useConfirm();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newName, setNewName] = useState('');
    const [newSchedule, setNewSchedule] = useState('*/5 * * * *');
    const [newCommand, setNewCommand] = useState('');
    const [newDatabase, setNewDatabase] = useState('postgres');
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadJobs();
    }, [projectId]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCronJobs(projectId);
            setJobs(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || 'Failed to load cron jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newCommand.trim() || !newSchedule.trim()) return;
        try {
            setCreating(true);
            const newJob = await createCronJob(projectId, newName.trim(), newSchedule.trim(), newCommand.trim());
            setJobs(prev => [...prev, newJob]);
            setNewName('');
            setNewSchedule('*/5 * * * *');
            setNewCommand('');
            setShowForm(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create cron job');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        const ok = await confirm({
            title: 'Delete Cron Job',
            message: 'Are you sure you want to delete this scheduled job?',
            variant: 'danger',
            confirmText: 'Delete Job'
        });
        if (!ok) return;
        try {
            await deleteCronJob(projectId, jobId);
            setJobs(prev => prev.filter(j => j.id !== jobId));
        } catch (err: any) {
            setError(err.message || 'Failed to delete cron job.');
        }
    };

    const CRON_PRESETS = [
        { label: 'Every minute', value: '* * * * *' },
        { label: 'Every 5 min', value: '*/5 * * * *' },
        { label: 'Every hour', value: '0 * * * *' },
        { label: 'Daily at midnight', value: '0 0 * * *' },
        { label: 'Weekly (Sunday)', value: '0 0 * * 0' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock className="text-emerald-500" />
                        Cron Jobs
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">Schedule SQL commands using pg_cron expressions.</p>
                </div>
                <button
                    onClick={() => setShowForm(v => !v)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={14} />
                    New Job
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="border border-zinc-800 rounded-xl bg-zinc-950 p-6">
                    <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                        <Plus size={14} />
                        Create New Cron Job
                    </h3>
                    <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Job Name</label>
                            <input
                                type="text"
                                placeholder="e.g. cleanup-old-sessions"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-emerald-500 text-zinc-100"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Database</label>
                            <input
                                type="text"
                                placeholder="postgres"
                                value={newDatabase}
                                onChange={e => setNewDatabase(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-emerald-500 text-zinc-100"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Schedule (Cron Expression)</label>
                            <input
                                type="text"
                                value={newSchedule}
                                onChange={e => setNewSchedule(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-emerald-500 text-zinc-100"
                            />
                            <div className="flex flex-wrap gap-1 mt-2">
                                {CRON_PRESETS.map(p => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setNewSchedule(p.value)}
                                        className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded hover:bg-emerald-900/30 hover:text-emerald-400 transition-colors"
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">SQL Command</label>
                            <textarea
                                placeholder="DELETE FROM sessions WHERE expires_at < now();"
                                value={newCommand}
                                onChange={e => setNewCommand(e.target.value)}
                                rows={3}
                                className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-emerald-500 text-zinc-100"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating || !newName.trim() || !newSchedule.trim() || !newCommand.trim()}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {creating && <Loader2 size={14} className="animate-spin" />}
                                {creating ? 'Creating...' : 'Create Job'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Jobs Table */}
            <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Activity size={16} />
                        Scheduled Jobs
                    </h3>
                    {!loading && (
                        <span className="text-xs text-zinc-500">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-zinc-500">
                        <Clock size={32} className="mb-4 text-zinc-400" />
                        <p className="font-medium">No cron jobs yet</p>
                        <p className="text-xs text-zinc-400 mt-1">Click "New Job" to schedule your first SQL command.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Schedule</th>
                                <th className="px-6 py-3 font-medium">Command</th>
                                <th className="px-6 py-3 font-medium">Database</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {jobs.map(job => (
                                <tr key={job.id} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-100">{job.name}</td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs bg-zinc-800 px-2 py-1 rounded font-mono">{job.schedule}</code>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <code className="text-xs text-zinc-400 truncate block font-mono">{job.command}</code>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">{job.database || 'postgres'}</td>
                                    <td className="px-6 py-4">
                                        {job.active ? (
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Active</span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-zinc-500/10 text-zinc-500 rounded-full">Paused</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded"
                                            title="Delete Job"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <ConfirmDialog />
        </div>
    );
}
