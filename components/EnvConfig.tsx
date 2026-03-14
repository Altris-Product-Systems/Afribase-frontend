'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Key, RefreshCw, 
  Search, Eye, EyeOff, Save, X, AlertCircle
} from 'lucide-react';
import { listEnvConfig, setEnvConfig, deleteEnvConfig, EnvConfig as IEnvConfig } from '@/lib/api';
import toast from 'react-hot-toast';

interface EnvConfigProps {
  projectId: string;
}

export default function EnvConfig({ projectId }: EnvConfigProps) {
  const [configs, setConfigs] = useState<IEnvConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadConfigs();
  }, [projectId]);

  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      const data = await listEnvConfig(projectId);
      setConfigs(data);
    } catch (err) {
      // toast.error('Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    setIsSaving(true);
    try {
      await setEnvConfig(projectId, { key: newKey, value: newValue });
      toast.success('Configuration updated');
      setNewKey('');
      setNewValue('');
      setShowAdd(false);
      loadConfigs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete configuration key "${key}"?`)) return;

    try {
      await deleteEnvConfig(projectId, key);
      toast.success('Configuration removed');
      loadConfigs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete configuration');
    }
  };

  const filtered = configs.filter(c => 
    c.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
            <Key className="text-emerald-500" size={32} />
            Environment Config
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
            Manage non-secret environment variables and configuration for your Edge Functions and project nodes.
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={14} />
                <input 
                    type="text"
                    placeholder="Search keys..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 bg-zinc-900 border border-white/5 rounded-xl text-xs text-white outline-none focus:border-emerald-500/50 transition-all w-48"
                />
            </div>
            <button 
                onClick={() => setShowAdd(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black rounded-xl transition-all shadow-lg uppercase tracking-widest flex items-center gap-2"
            >
                <Plus size={16} /> Add Key
            </button>
        </div>
      </div>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 animate-gelatinous-in">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Variable Key</label>
                <input 
                    type="text"
                    required
                    placeholder="e.g. API_TIMEOUT"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                    className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-xs text-white font-mono focus:border-emerald-500 outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Variable Value</label>
                <input 
                    type="text"
                    required
                    placeholder="e.g. 5000"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-xs text-emerald-400 font-mono focus:border-emerald-500 outline-none transition-all"
                />
            </div>
            <div className="flex items-center gap-2">
                <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Variable
                </button>
                <button 
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl transition-all"
                >
                    <X size={16} />
                </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center glass-card rounded-3xl border border-dashed border-white/10">
          <AlertCircle size={48} className="mx-auto text-zinc-800 mb-4" />
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">No configuration found</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Variable Key</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Value</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Updated</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((config) => (
                  <tr key={config.key} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-1 rounded-md">{config.key}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-emerald-400">{config.value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] text-zinc-500 font-medium">{new Date(config.updatedAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(config.key)}
                        className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
