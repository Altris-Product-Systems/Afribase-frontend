'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  getProject,
  getProjectKeys,
  updateProject,
  deleteProject,
  runProjectQuery,
  getProjectTables,
  deleteProjectTable,
  getProjectUsage,
  Project,
  ProjectKeys,
  TableInfo,
  ProjectUsage,
  QueryResult,
} from '@/lib/api';
import {
  Database,
  Key,
  Activity,
  Shield,
  Zap,
  Copy,
  Check,
  Terminal,
  Code,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Users,
  Play,
  Trash2,
  Save,
  RefreshCw,
  Table,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Settings,
  Search,
  Filter,
  XCircle,
} from 'lucide-react';

import { useLoader } from '@/components/ui/GlobalLoaderProvider';
import ApiDocs from '@/components/ApiDocs';
import ClientLibraries from '@/components/ClientLibraries';
import AuthSettings from '@/components/AuthSettings';
import AuthUsers from '@/components/AuthUsers';
import AuthPolicies from '@/components/AuthPolicies';
import SSOManager from '@/components/SSOManager';
import StorageManager from '@/components/StorageManager';
import FunctionsManager from '@/components/FunctionsManager';
import RealtimeConfig from '@/components/RealtimeConfig';
import MigrationsManager from '@/components/MigrationsManager';
import BackupsManager from '@/components/BackupsManager';
import BranchesManager from '@/components/BranchesManager';
import WebhooksManager from '@/components/WebhooksManager';
import PoolerConfig from '@/components/PoolerConfig';
import CronManager from '@/components/CronManager';
import LogsManager from '@/components/LogsManager';
import LogDrainsManager from '@/components/LogDrainsManager';
import DomainsManager from '@/components/DomainsManager';
import NetworkRestrictions from '@/components/NetworkRestrictions';
import VaultManager from '@/components/VaultManager';
import AdvancedConfig from '@/components/AdvancedConfig';
import ForumManager from '@/components/ForumManager';
import HealthMonitor from '@/components/HealthMonitor';
import NocodeManager from '@/components/NocodeManager';
import DeepLinkManager from '@/components/DeepLinkManager';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import DataTable from '@/components/DataTable';

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatBytes(bytes?: number): string {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function usagePct(used?: number, limit?: number): number {
  if (!used || !limit || limit === 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function parseSizeToBytes(sizeStr?: string | number): number {
  if (sizeStr == null) return 0;
  if (typeof sizeStr === 'number') return sizeStr;
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]*)$/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const units: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
  };
  return value * (units[unit] || 1);
}

const TABS = [
  'overview', 'tables', 'sql', 'api', 'libraries', 'auth', 'users', 'policies', 'sso',
  'api-keys', 'storage', 'edge-functions', 'realtime',
  'migrations', 'backups', 'branches', 'webhooks', 'pooler',
  'cron', 'logs', 'log-drains', 'usage', 'domains', 'network', 'vault', 'advanced', 'forum', 'health', 'nocode', 'deeplinks', 'settings',
] as const;
type Tab = (typeof TABS)[number];

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const { setIsLoading: setGlobalLoading } = useLoader();

  // Core project state
  const [project, setProject] = useState<Project | null>(null);
  const [keys, setKeys] = useState<ProjectKeys | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab && TABS.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const tabTitles: Record<string, string> = {
    overview: project?.name || 'Project Overview',
    database: 'Table Editor',
    sql: 'SQL Editor',
    auth: 'Authentication',
    users: 'Users',
    policies: 'RLS Policies',
    storage: 'Storage',
    'edge-functions': 'Edge Functions',
    nocode: 'No-Code Hub',
    health: 'Health & Monitoring',
    forum: 'Developer Forum',
    domains: 'Custom Domains',
    'api-keys': 'Project Keys & API Settings',
    settings: 'Project Settings',
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Tables tab
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [tableViewState, setTableViewState] = useState<'schema' | 'data'>('schema');
  const [tableSearch, setTableSearch] = useState('');
  const [columnSearch, setColumnSearch] = useState('');

  // SQL tab
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM public.users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const sqlRef = useRef<HTMLTextAreaElement>(null);

  // Usage tab
  const [usage, setUsage] = useState<ProjectUsage | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [deletingTable, setDeletingTable] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<{ schema: string, name: string } | null>(null);

  // Settings tab
  const [settingsName, setSettingsName] = useState('');
  const [settingsDesc, setSettingsDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ── Load project + keys ──────────────────────────────────────────────────
  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setError(null);
      setGlobalLoading(true, 'Fetching Project Data');
      const found = await getProject(projectId);
      setProject(found);
      setSettingsName(found.name);
      setSettingsDesc(found.description || '');
      try {
        const projectKeys = await getProjectKeys(projectId);
        setKeys(projectKeys);
      } catch {
        // console.error('Failed to load project keys');
      }
    } catch (err: unknown) {
      // console.error('Failed to load project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setIsLoading(false);
      setGlobalLoading(false);
    }
  };

  // ── Tab-specific loaders ─────────────────────────────────────────────────
  const loadTables = useCallback(async () => {
    setTablesLoading(true);
    setTablesError(null);
    try {
      const data = await getProjectTables(projectId);
      setTables(data);
    } catch (err: unknown) {
      setTablesError(err instanceof Error ? err.message : 'Failed to fetch tables');
    } finally {
      setTablesLoading(false);
    }
  }, [projectId]);

  const loadUsage = useCallback(async () => {
    setUsageLoading(true);
    try {
      const data = await getProjectUsage(projectId);
      setUsage(data);
    } catch {
      /* non-fatal */
    } finally {
      setUsageLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'tables' && tables.length === 0 && !tablesLoading) loadTables();
    if (activeTab === 'usage' && !usage && !usageLoading) loadUsage();
  }, [activeTab]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCopy = (text: string, type: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(type);
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      // Fallback for older browsers or insecure contexts
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedKey(type);
        setTimeout(() => setCopiedKey(null), 2000);
      } catch (err) {
        // console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    setQueryRunning(true);
    setQueryError(null);
    setQueryResult(null);
    try {
      const result = await runProjectQuery(projectId, sqlQuery);
      setQueryResult(result);
    } catch (err: unknown) {
      setQueryError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setQueryRunning(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!project) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateProject(projectId, {
        name: settingsName,
        description: settingsDesc,
      });
      setProject(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (deleteConfirm !== project?.name) return;
    setDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
      setDeleting(false);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteProject = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTable = (schema: string, tableName: string) => {
    setTableToDelete({ schema, name: tableName });
    setIsTableModalOpen(true);
  };

  const confirmDeleteTable = async () => {
    if (!tableToDelete) return;
    const { schema, name: tableName } = tableToDelete;

    setDeletingTable(tableName);
    try {
      await deleteProjectTable(projectId, schema, tableName);
      setTables(tables.filter((t) => t.name !== tableName));
      if (selectedTable?.name === tableName) {
        setSelectedTable(null);
      }
      toast.success(`Table ${tableName} deleted successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete table');
    } finally {
      setDeletingTable(null);
      setIsTableModalOpen(false);
      setTableToDelete(null);
    }
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
          <Server size={32} />
        </div>
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Loading project...</p>
      </div>
    );

  if (error || !project)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Server size={32} className="text-red-400" />
        </div>
        <h3 className="text-white font-bold text-lg">Project not found</h3>
        {error && <p className="mt-2 text-zinc-500 text-sm text-center max-w-sm">{error}</p>}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 text-emerald-500 text-sm font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-gelatinous-in">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shadow-lg">
              <Database className="text-emerald-400" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  {tabTitles[activeTab] || project.name}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${project.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-800 text-zinc-500 border border-white/5'
                    }`}
                >
                  {project.status || 'Active'}
                </span>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                ID: <span className="text-zinc-400">{project.id}</span> • Region:{' '}
                <span className="text-zinc-400">{project.region}</span>
                {project.description && (
                  <span className="text-zinc-600 normal-case font-medium ml-2">— {project.description}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadProject()}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2 active:scale-95 uppercase tracking-widest"
          >
            <RefreshCw size={14} />
          </button>
          <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 text-xs font-black rounded-lg transition-all duration-300 flex items-center gap-2.5 active:scale-95 uppercase tracking-widest">
            <Zap size={16} className="text-amber-500" />
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Navigation is handled by the sidebar */}

      {/* ════════════════════════════════════════════
          OVERVIEW TAB
      ════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Database', value: project.databaseName || 'N/A', icon: HardDrive, color: 'text-emerald-400' },
              { label: 'Plan', value: project.plan || 'Free', icon: Zap, color: 'text-amber-400' },
              { label: 'Region', value: project.region, icon: Globe, color: 'text-cyan-400' },
              { label: 'Status', value: project.status || 'Active', icon: Activity, color: 'text-green-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
                  <p className="text-sm font-black text-white mt-0.5 truncate max-w-[120px]">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Start */}
            <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900/50 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Code size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
                    Connect to Afribase
                  </h3>
                  <p className="text-zinc-500 text-sm max-w-md font-medium leading-relaxed">
                    Instantly integrate your database using our high-performance client libraries.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          Node.js (Afribase-js)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy('npm install @afribase/afribase-js', 'npm')}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        {copiedKey === 'npm' ? (
                          <Check size={14} className="text-emerald-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <div className="p-4 font-mono text-[11px] text-zinc-400 bg-[#0c0c0e]">
                      <span className="text-emerald-500">npm</span> install @afribase/afribase-js
                    </div>
                  </div>

                  <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          Initialize Client
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            `import { createClient } from '@afribase/afribase-js'\nconst afribase = createClient('http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/rest/v1/${project.slug}', '${keys?.anon_key || project.anonKey || ''}')`,
                            'init'
                          )
                        }
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        {copiedKey === 'init' ? (
                          <Check size={14} className="text-emerald-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <div className="p-4 font-mono text-[11px] text-zinc-500 space-y-1 bg-[#0c0c0e]">
                      <p>
                        <span className="text-purple-500">import</span> {"{ createClient }"}{' '}
                        <span className="text-purple-500">from</span>{' '}
                        <span className="text-emerald-500">'@afribase/afribase-js'</span>
                      </p>
                      <p>
                        <span className="text-purple-500">const</span> afribase ={' '}
                        <span className="text-cyan-400">createClient</span>(
                      </p>
                      <p className="pl-4 text-emerald-500 truncate">
                        {`'http://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/rest/v1/${project.slug}'`}
                      </p>
                      <p className="pl-4 text-yellow-500">
                        '{keys?.anon_key ? keys.anon_key.slice(0, 24) + '…' : 'your-anon-key'}'
                      </p>
                      <p>)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side info */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-5">
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Infrastructure</h4>
                {[
                  { icon: Globe, label: 'Region', value: project.region || 'NG (Lagos)' },
                  { icon: Shield, label: 'SSL Mode', value: 'Full (Trusted)', color: 'text-emerald-400' },
                  { icon: Database, label: 'Database', value: project.databaseName || 'N/A' },
                  { icon: Server, label: 'Postgres', value: 'PG 15.3' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <Icon size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{label}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest truncate ml-4 text-right flex-1 ${color || 'text-white'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTabChange('sql')}
                  className="glass-card p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-2 group"
                >
                  <Terminal size={18} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[9px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest">
                    SQL Editor
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange('tables')}
                  className="glass-card p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-2 group"
                >
                  <Table size={18} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[9px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest">
                    Tables
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TABLES TAB
      ════════════════════════════════════════════ */}
      {activeTab === 'tables' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Database Tables</h2>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                All tables in your project&apos;s public schema.
              </p>
            </div>
            <button
              onClick={loadTables}
              disabled={tablesLoading}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={tablesLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {tablesLoading && (
            <div className="flex items-center justify-center py-20 text-zinc-500">
              <RefreshCw size={20} className="animate-spin mr-3" />
              <span className="text-sm font-bold">Loading tables…</span>
            </div>
          )}

          {tablesError && (
            <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-sm">
              <AlertTriangle size={16} />
              {tablesError}
            </div>
          )}

          {!tablesLoading && !tablesError && tables.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Table size={40} className="mb-4 opacity-30" />
              <p className="text-sm font-bold">No tables found in the public schema.</p>
              <button
                onClick={() => {
                  setSqlQuery('CREATE TABLE example (id SERIAL PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());');
                  handleTabChange('sql');
                }}
                className="mt-4 text-emerald-500 text-xs font-black uppercase tracking-widest hover:text-emerald-400 transition-colors"
              >
                Create your first table →
              </button>
            </div>
          )}

          {!tablesLoading && tables.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table List */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={14} className="text-zinc-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tables..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 transition-all uppercase tracking-widest"
                  />
                  {tableSearch && (
                    <button
                      onClick={() => setTableSearch('')}
                      className="absolute inset-y-0 right-3 flex items-center text-zinc-600 hover:text-white transition-colors"
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {tables
                    .filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((tbl, i) => (
                      <button
                        key={tbl.name || `table-${i}`}
                        onClick={() => {
                          if (selectedTable?.name === tbl.name) {
                            setSelectedTable(null);
                          } else {
                            setSelectedTable(tbl);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${selectedTable?.name === tbl.name
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Table size={14} />
                          <span className="text-xs font-black uppercase tracking-widest">{tbl.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          {tbl.rowCount != null && (
                            <span className="text-[10px] font-bold text-zinc-500">
                              {tbl.rowCount.toLocaleString()} rows
                            </span>
                          )}
                          <ChevronRight size={12} />
                        </div>
                      </button>
                    ))}
                  {tables.filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase())).length === 0 && (
                    <div className="py-10 text-center border border-dashed border-white/5 rounded-xl">
                      <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">No matching tables</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Detail */}
              <div className="lg:col-span-2">
                {selectedTable ? (
                  <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black text-white uppercase italic">{selectedTable.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                          Schema: {selectedTable.schema || 'public'}
                          {selectedTable.sizeBytes != null && (
                            <span className="ml-3">· Size: {formatBytes(selectedTable.sizeBytes)}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex bg-zinc-950 p-1 rounded-lg border border-white/5 mr-4">
                          <button
                            onClick={() => setTableViewState('schema')}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${tableViewState === 'schema' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                            Schema
                          </button>
                          <button
                            onClick={() => setTableViewState('data')}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${tableViewState === 'data' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                            Data
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setSqlQuery(`SELECT * FROM ${selectedTable.schema || 'public'}.${selectedTable.name} LIMIT 50;`);
                            handleTabChange('sql');
                          }}
                          className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
                        >
                          <Terminal size={12} /> Query
                        </button>
                        <button
                          onClick={() => handleDeleteTable(selectedTable.schema || 'public', selectedTable.name)}
                          disabled={deletingTable === selectedTable.name}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {deletingTable === selectedTable.name ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>

                    {tableViewState === 'data' ? (
                      <DataTable
                        projectId={projectId}
                        schema={selectedTable.schema || 'public'}
                        tableName={selectedTable.name}
                      />
                    ) : selectedTable.columns && selectedTable.columns.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th colSpan={4} className="pb-4">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Filter size={14} className="text-zinc-600" />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Filter columns..."
                                    value={columnSearch}
                                    onChange={(e) => setColumnSearch(e.target.value)}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 transition-all uppercase tracking-widest"
                                  />
                                </div>
                              </th>
                            </tr>
                            <tr className="border-b border-white/5">
                              {['Column', 'Type', 'Nullable', 'Default'].map((h) => (
                                <th
                                  key={h}
                                  className="py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest pr-6"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTable.columns
                              .filter(col => col.name.toLowerCase().includes(columnSearch.toLowerCase()) || col.type.toLowerCase().includes(columnSearch.toLowerCase()))
                              .map((col) => (
                                <tr key={col.name} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                  <td className="py-3 text-xs font-bold text-white pr-6">{col.name}</td>
                                  <td className="py-3 text-[10px] font-mono text-cyan-400 pr-6">{col.type}</td>
                                  <td className="py-3 text-[10px] pr-6">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${col.nullable
                                        ? 'bg-zinc-800 text-zinc-500'
                                        : 'bg-emerald-500/10 text-emerald-400'
                                        }`}
                                    >
                                      {col.nullable ? 'YES' : 'NO'}
                                    </span>
                                  </td>
                                  <td className="py-3 text-[10px] font-mono text-zinc-500">{col.default || '—'}</td>
                                </tr>
                              ))}
                            {selectedTable.columns.filter(col => col.name.toLowerCase().includes(columnSearch.toLowerCase()) || col.type.toLowerCase().includes(columnSearch.toLowerCase())).length === 0 && (
                              <tr>
                                <td colSpan={4} className="py-10 text-center text-zinc-600 text-xs italic uppercase tracking-widest">
                                  No matching columns
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm">No column details available.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-zinc-600">
                    <Table size={32} className="mb-3 opacity-30" />
                    <p className="text-sm font-bold">Select a table to view its schema</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          SQL TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'sql' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">SQL Editor</h2>
                <p className="text-zinc-500 text-sm font-medium mt-1">
                  Run raw SQL against <span className="text-zinc-300">{project.databaseName || project.name}</span>
                </p>
              </div>
              <button
                onClick={handleRunQuery}
                disabled={queryRunning}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black text-xs font-black rounded-lg transition-all flex items-center gap-2.5 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] active:scale-95 uppercase tracking-widest"
              >
                {queryRunning ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Play size={14} strokeWidth={3} />
                )}
                {queryRunning ? 'Running…' : 'Run Query'}
              </button>
            </div>

            {/* Editor */}
            <div className="bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SQL</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {sqlQuery.split('\n').length} lines
                  </span>
                  <button
                    onClick={() => setSqlQuery('')}
                    className="text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                ref={sqlRef}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleRunQuery();
                  }
                }}
                rows={10}
                spellCheck={false}
                className="w-full bg-[#0c0c0e] text-zinc-300 font-mono text-sm p-4 focus:outline-none resize-y min-h-[180px]"
                placeholder="SELECT * FROM public.users LIMIT 10;"
              />
              <div className="px-4 py-2 bg-white/[0.01] border-t border-white/5">
                <span className="text-[10px] text-zinc-600">⌘ + Enter to run</span>
              </div>
            </div>

            {/* Query Error */}
            {queryError && (
              <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px] mb-1">Query Error</p>
                  <p className="font-mono text-xs">{queryError}</p>
                </div>
              </div>
            )}

            {/* Query Result */}
            {queryResult && (
              <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Result</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    {queryResult.rowCount != null
                      ? `${queryResult.rowCount} row${queryResult.rowCount !== 1 ? 's' : ''}`
                      : queryResult.rows != null
                        ? `${queryResult.rows.length} row${queryResult.rows.length !== 1 ? 's' : ''}`
                        : 'OK'}
                  </span>
                </div>

                {queryResult.rows && queryResult.rows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                          {(queryResult.columns || Object.keys(queryResult.rows[0])).map((col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.rows.map((row, i) => (
                          <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                            {(queryResult.columns || Object.keys(row)).map((col) => (
                              <td key={col} className="px-4 py-3 font-mono text-zinc-400 whitespace-nowrap max-w-[200px] truncate">
                                {row[col] == null ? (
                                  <span className="text-zinc-600 italic">null</span>
                                ) : (
                                  String(row[col])
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-5 py-6 text-zinc-500 text-sm font-medium">
                    Query executed successfully. No rows returned.
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          AUTH TABS (INTEGRATED)
      ════════════════════════════════════════════ */}
      {
        activeTab === 'auth' && (
          <div className="animate-fade-in">
            <AuthSettings projectId={project.id} />
          </div>
        )
      }

      {
        activeTab === 'users' && (
          <div className="animate-fade-in">
            <AuthUsers projectId={project.id} />
          </div>
        )
      }

      {
        activeTab === 'policies' && (
          <div className="animate-fade-in">
            <AuthPolicies projectId={project.id} />
          </div>
        )
      }

      {
        activeTab === 'sso' && (
          <div className="animate-fade-in">
            <SSOManager projectId={project.id} />
          </div>
        )
      }

      {/* ─────────────────────────────────────────────────────────────────────────────
          API / SDK DOCS TAB
      ───────────────────────────────────────────────────────────────────────────── */}
      {
        activeTab === 'api' && (
          <div className="animate-fade-in">
            <ApiDocs
              projectId={project.id}
              projectSlug={project.slug}
              anonKey={keys?.anon_key || project.anonKey || ''}
            />
          </div>
        )
      }

      {/* ─────────────────────────────────────────────────────────────────────────────
          CLIENT LIBRARIES (SDK GALLERY)
      ───────────────────────────────────────────────────────────────────────────── */}
      {
        activeTab === 'libraries' && (
          <div className="animate-fade-in">
            <ClientLibraries />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          API KEYS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'api-keys' && (
          <div className="space-y-10 max-w-5xl animate-fade-in pb-20">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Project API Keys</h2>
              <p className="text-zinc-500 text-sm font-medium">
                Use these keys to authenticate your client-side and server-side requests.
                Your project comes with two keys: a public <span className="text-zinc-300 font-bold">anon</span> key and a secret <span className="text-red-400 font-bold uppercase tracking-tighter italic">service_role</span> key.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Connection URLs */}
              {(keys?.postgrest_url || project.postgrestUrl) && (
                <div className="glass-card p-8 rounded-[2rem] border border-white/5 space-y-6 bg-zinc-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
                      <Globe size={20} />
                    </div>
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Project Infrastructure URLs</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'REST / PostgREST URL', value: keys?.postgrest_url || project.postgrestUrl },
                      { label: 'Realtime WebSocket URL', value: project.realtimeUrl },
                      { label: 'Storage CDN URL', value: project.storageUrl },
                      { label: 'Auth Endpoint', value: project.authUrl },
                    ]
                      .filter((u) => u.value)
                      .map(({ label, value }) => (
                        <div key={label} className="space-y-2">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
                          <div className="flex items-center gap-2 group">
                            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 font-mono text-[11px] text-zinc-400 truncate group-hover:border-white/10 transition-colors">
                              {value}
                            </div>
                            <button
                              onClick={() => handleCopy(value!, label)}
                              className="shrink-0 w-10 h-10 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95"
                              title="Copy URL"
                            >
                              {copiedKey === label ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                {/* Anon Key */}
                <div className="glass-card p-8 rounded-[2rem] border border-white/5 space-y-6 bg-emerald-500/[0.02]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Key size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-white uppercase italic">anon</h4>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">Public</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium mt-1 max-w-md">Safe to use in browsers and client-side code. This key is subject to RLS policies you define on your tables.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(keys?.anon_key || project.anonKey || '', 'anon')}
                      className="px-6 py-3 bg-white text-black hover:bg-zinc-200 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl shrink-0"
                    >
                      {copiedKey === 'anon' ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      {copiedKey === 'anon' ? 'Copied to clipboard' : 'Copy Public Key'}
                    </button>
                  </div>
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] text-zinc-400 break-all select-all leading-relaxed group hover:border-white/10 transition-colors">
                    {keys?.anon_key || project.anonKey || 'Key not available'}
                  </div>
                </div>

                {/* Service Key */}
                <div className="glass-card p-8 rounded-[2rem] border border-red-500/5 space-y-6 bg-red-500/[0.02]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                        <Shield size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-white uppercase italic">service_role</h4>
                          <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/10">Secret</span>
                        </div>
                        <p className="text-xs text-rose-500/70 font-black uppercase tracking-tight mt-1">
                          CRITICAL: NEVER expose this key in client-side code.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(keys?.service_key || project.serviceKey || '', 'service')}
                      className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-red-500/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-2xl shrink-0"
                    >
                      {copiedKey === 'service' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      {copiedKey === 'service' ? 'Copied to clipboard' : 'Copy Secret Key'}
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] text-zinc-600 break-all blur-md group-hover:blur-none transition-all duration-300 cursor-pointer select-all leading-relaxed">
                      {keys?.service_key || project.serviceKey || 'Key not available'}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 bg-black/80 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">Hover to reveal secret key</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          USAGE TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'usage' && (
          <div className="animate-fade-in space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Resource Usage</h2>
                <p className="text-zinc-500 text-sm font-medium mt-1">
                  Monthly resource consumption and allocation limits.
                </p>
              </div>
              <button
                onClick={loadUsage}
                disabled={usageLoading}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw size={12} className={usageLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>

            {usageLoading && (
              <div className="flex items-center justify-center py-16 text-zinc-500">
                <BarChart3 size={20} className="animate-pulse mr-3" />
                <span className="text-sm font-bold">Loading usage data…</span>
              </div>
            )}

            {!usageLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    label: 'Database Storage',
                    used: usage?.db_size,
                    limit: usage?.db_size_limit,
                    fallbackUsed: '— MB',
                    fallbackLimit: '500 MB',
                    color: 'bg-emerald-500',
                    shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
                    icon: HardDrive,
                  },
                  {
                    label: 'Row Count',
                    used: usage?.row_count,
                    limit: 1000000,
                    fallbackUsed: '—',
                    fallbackLimit: '1M',
                    color: 'bg-cyan-500',
                    shadow: '',
                    icon: Table,
                    raw: true,
                  },
                  {
                    label: 'Bandwidth (Egress)',
                    used: usage?.bandwidth,
                    limit: usage?.bandwidth_limit,
                    fallbackUsed: '— GB',
                    fallbackLimit: '5 GB',
                    color: 'bg-blue-500',
                    shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
                    icon: Activity,
                  },
                  {
                    label: 'File Storage',
                    used: usage?.storage,
                    limit: usage?.storage_limit,
                    fallbackUsed: '— GB',
                    fallbackLimit: '1 GB',
                    color: 'bg-purple-500',
                    shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.3)]',
                    icon: HardDrive,
                  },
                  {
                    label: 'Monthly Active Users',
                    used: usage?.auth_users,
                    limit: usage?.auth_users_limit,
                    fallbackUsed: '—',
                    fallbackLimit: '50,000',
                    color: 'bg-amber-500',
                    shadow: '',
                    icon: Users,
                    raw: true,
                  },
                ].map(({ label, used, limit, fallbackUsed, fallbackLimit, color, shadow, icon: Icon, raw }) => {
                  const usedVal = parseSizeToBytes(used as any);
                  const limitVal = parseSizeToBytes(limit as any);
                  const pct = usagePct(usedVal, limitVal);

                  const usedStr = used != null ? used.toLocaleString() : fallbackUsed;
                  const limitStr = limit != null ? limit.toLocaleString() : fallbackLimit;
                  return (
                    <div key={label} className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-zinc-500" />
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            {label}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-white">
                          {usedStr} / {limitStr}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full ${color} ${shadow} transition-all duration-700`}
                          style={{ width: `${used == null ? 0 : pct}%` }}
                        />
                      </div>
                      {used != null && (
                        <p className="text-[10px] text-zinc-600">
                          {pct}% used
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          STORAGE TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'storage' && (
          <div className="animate-fade-in">
            <StorageManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          EDGE FUNCTIONS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'edge-functions' && (
          <div className="animate-fade-in">
            <FunctionsManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          REALTIME TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'realtime' && (
          <div className="animate-fade-in">
            <RealtimeConfig projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          MIGRATIONS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'migrations' && (
          <div className="animate-fade-in">
            <MigrationsManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          BACKUPS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'backups' && (
          <div className="animate-fade-in">
            <BackupsManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          BRANCHES TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'branches' && (
          <div className="animate-fade-in">
            <BranchesManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          WEBHOOKS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'webhooks' && (
          <div className="animate-fade-in">
            <WebhooksManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          CONNECTION POOLER TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'pooler' && (
          <div className="animate-fade-in">
            <PoolerConfig projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          CRON JOBS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'cron' && (
          <div className="animate-fade-in">
            <CronManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          LOGS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'logs' && (
          <div className="animate-fade-in">
            <LogsManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          LOG DRAINS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'log-drains' && (
          <div className="animate-fade-in">
            <LogDrainsManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          CUSTOM DOMAINS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'domains' && (
          <div className="animate-fade-in">
            <DomainsManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          NETWORK RESTRICTIONS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'network' && (
          <div className="animate-fade-in">
            <NetworkRestrictions projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          VAULT / SECRETS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'vault' && (
          <div className="animate-fade-in">
            <VaultManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          ADVANCED (AI / GRAPHQL / TYPES) TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'advanced' && (
          <div className="animate-fade-in">
            <AdvancedConfig projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          SETTINGS TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'settings' && (
          <div className="animate-fade-in space-y-10 max-w-4xl">
            {/* Config */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-8">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">
                Project Configuration
              </h3>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    value={settingsDesc}
                    onChange={(e) => setSettingsDesc(e.target.value)}
                    rows={3}
                    className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                    placeholder="Brief description of this project…"
                  />
                </div>

                <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Project Slug
                  </label>
                  <input
                    type="text"
                    defaultValue={project.slug}
                    disabled
                    className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-500"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-500 text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {saveSuccess && (
                  <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Check size={12} /> Saved successfully
                  </span>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-500" />
                <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Danger Zone</h4>
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                Permanently delete this project and all its data. This action is{' '}
                <strong className="text-zinc-300">irreversible</strong>.
              </p>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Type <span className="text-white">{project.name}</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder={project.name}
                  className="bg-zinc-950 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all w-full max-w-sm"
                />
              </div>

              <button
                onClick={handleDeleteProject}
                disabled={deleteConfirm !== project.name || deleting}
                className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black rounded-lg transition-all border border-red-500/20 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? <RefreshCw size={12} className="animate-spin" /> : <Trash2 size={12} />}
                {deleting ? 'Deleting…' : 'Delete Project'}
              </button>
            </div>
          </div>
        )}

      {/* ════════════════════════════════════════════
          FORUM TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'forum' && (
          <div className="animate-fade-in">
            <ForumManager projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          HEALTH TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'health' && (
          <div className="animate-fade-in">
            <HealthMonitor projectId={project.id} />
          </div>
        )
      }

      {/* ════════════════════════════════════════════
          NOCODE TAB
      ════════════════════════════════════════════ */}
      {
        activeTab === 'nocode' && (
          <div className="animate-fade-in">
            <NocodeManager projectId={project.id} projectSlug={project.slug} />
          </div>
        )
      }

      {
        activeTab === 'deeplinks' && (
          <div className="animate-fade-in">
            <DeepLinkManager projectId={project.id} projectSlug={project.slug} />
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        variant="danger"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-zinc-800 text-zinc-400 text-[10px] font-black rounded-lg uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteProject}
              disabled={deleting || deleteConfirm !== project?.name}
              className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-red-400 transition-all disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-zinc-400 text-sm leading-relaxed">
            Are you sure you want to delete <span className="text-white font-bold">{project?.name}</span>? This action cannot be undone. All database data, auth configurations, and keys will be permanently destroyed.
          </p>
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">To confirm, type the project name below</p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={project?.name}
              className="w-full bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all"
            />
          </div>
        </div>
      </Modal>

      {/* Table Delete Confirmation Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title="Delete Table"
        variant="danger"
        footer={
          <>
            <button
              onClick={() => setIsTableModalOpen(false)}
              className="px-4 py-2 bg-zinc-800 text-zinc-400 text-[10px] font-black rounded-lg uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteTable}
              disabled={!!deletingTable}
              className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-red-400 transition-all disabled:opacity-50"
            >
              {deletingTable ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </>
        }
      >
        <p className="text-zinc-400 text-sm leading-relaxed">
          Are you sure you want to delete the table <span className="text-white font-bold">{tableToDelete?.schema}.{tableToDelete?.name}</span>? This action is irreversible and all data within this table will be lost forever.
        </p>
      </Modal>

    </div>
  )
}