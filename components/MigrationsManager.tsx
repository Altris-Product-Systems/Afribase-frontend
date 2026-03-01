import React, { useState, useEffect } from 'react';
import { Database, Plus, RefreshCw, Loader2, GitMerge, ChevronDown, ChevronUp } from 'lucide-react';
import { getDatabaseMigrations, createDatabaseMigration } from '@/lib/api';

interface MigrationsManagerProps {
    projectId: string;
}

// DatabaseMigration from backend: { id, projectId, version, name, sql, status, error, appliedAt, createdAt }
const STATUS_COLORS: Record<string, string> = {
    applied: 'text-emerald-500 bg-emerald-500/10',
    pending: 'text-yellow-500 bg-yellow-500/10',
    failed: 'text-red-500 bg-red-500/10',
    rolled_back: 'text-zinc-500 bg-zinc-500/10',
};

export default function MigrationsManager({ projectId }: MigrationsManagerProps) {
    const [migrations, setMigrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Expanded SQL preview
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Create form
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newSQL, setNewSQL] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadMigrations();
    }, [projectId]);

    const loadMigrations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getDatabaseMigrations(projectId);
            setMigrations(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch database migrations');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMigration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newSQL.trim()) return;

        try {
            setCreating(true);
            setError(null);
            const result = await createDatabaseMigration(projectId, newName.trim(), newSQL.trim());
            setMigrations(prev => [result, ...prev]);
            setNewName('');
            setNewSQL('');
            setShowForm(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create database migration');
        } finally {
            setCreating(false);
        }
    };

    const SQL_TEMPLATES = [
        { label: 'Create Table', sql: 'CREATE TABLE IF NOT EXISTS users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email TEXT NOT NULL UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);' },
        { label: 'Add Column', sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;' },
        { label: 'Create Index', sql: 'CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);' },
        { label: 'Enable RLS', sql: 'ALTER TABLE users ENABLE ROW LEVEL SECURITY;' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Database className="text-emerald-500" />
                        Database Migrations
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Track schema changes with versioned SQL migrations.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadMigrations}
                        disabled={loading}
                        className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin text-zinc-500' : 'text-zinc-500'} />
                    </button>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={14} />
                        New Migration
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-6">
                    <h3 className="font-semibold text-sm mb-4">Create New Migration</h3>
                    <form onSubmit={handleCreateMigration} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Migration Name</label>
                            <input
                                type="text"
                                placeholder="e.g. create_users_table"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm rounded focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-medium text-zinc-500">SQL</label>
                                <div className="flex gap-1">
                                    {SQL_TEMPLATES.map(t => (
                                        <button
                                            key={t.label}
                                            type="button"
                                            onClick={() => setNewSQL(t.sql)}
                                            className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                placeholder="ALTER TABLE users ADD COLUMN avatar_url TEXT;"
                                value={newSQL}
                                onChange={e => setNewSQL(e.target.value)}
                                rows={6}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm font-mono rounded focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating || !newName.trim() || !newSQL.trim()}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {creating && <Loader2 size={14} className="animate-spin" />}
                                {creating ? 'Applying...' : 'Apply Migration'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Migrations Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <GitMerge size={16} />
                        Migration History
                    </h3>
                    {!loading && (
                        <span className="text-xs text-zinc-500">{migrations.length} migration{migrations.length !== 1 ? 's' : ''}</span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : migrations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-zinc-500">
                        <Database size={32} className="mb-4 text-zinc-400" />
                        <p className="font-medium">No migrations yet</p>
                        <p className="text-xs text-zinc-400 mt-1">Click "New Migration" to apply your first SQL schema change.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {migrations.map(mig => (
                            <div key={mig.id}>
                                <div
                                    className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                                    onClick={() => setExpandedId(expandedId === mig.id ? null : mig.id)}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <code className="text-xs text-zinc-400 font-mono shrink-0">{mig.version || '—'}</code>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{mig.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLORS[mig.status] || STATUS_COLORS.pending}`}>
                                            {mig.status || 'pending'}
                                        </span>
                                        <span className="text-xs text-zinc-400">
                                            {mig.appliedAt ? new Date(mig.appliedAt).toLocaleString() : mig.createdAt ? new Date(mig.createdAt).toLocaleString() : 'Not applied'}
                                        </span>
                                        {expandedId === mig.id ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
                                    </div>
                                </div>
                                {expandedId === mig.id && (
                                    <div className="px-6 pb-4">
                                        {mig.error && (
                                            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-xs font-mono">
                                                Error: {mig.error}
                                            </div>
                                        )}
                                        <pre className="text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 overflow-x-auto text-zinc-700 dark:text-zinc-300">
                                            {mig.sql || '-- No SQL recorded'}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
