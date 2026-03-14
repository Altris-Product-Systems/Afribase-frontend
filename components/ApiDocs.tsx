'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, RefreshCw, 
  Terminal, Code, BookOpen, Search,
  ChevronRight, Database, Globe
} from 'lucide-react';
import { getProjectAPIDocs } from '@/lib/api';

interface APIDocsProps {
  projectId: string;
}

export default function APIDocs({ projectId }: APIDocsProps) {
  const [docs, setDocs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocs();
  }, [projectId]);

  const loadDocs = async () => {
    setIsLoading(true);
    try {
      const data = await getProjectAPIDocs(projectId);
      setDocs(data);
    } catch (err) {
      // console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
            <BookOpen className="text-emerald-500" size={32} />
            Automated API Docs
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
            Project-specific REST documentation automatically generated from your database schema and Edge Functions.
          </p>
        </div>

        <button 
           onClick={loadDocs}
           className="px-6 py-3 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Regenerate Docs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity">
                    <Code size={200} className="text-emerald-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-4">
                    <Database size={24} className="text-emerald-500" />
                    Interactive Swagger UI
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-md">
                    Explore your PostgREST endpoints, test queries, and view detailed request/response schemas in our full-featured Swagger playground.
                </p>
                
                <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-emerald-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/20">
                        Open Swagger UI <ExternalLink size={16} />
                    </button>
                    <button className="px-8 py-4 bg-zinc-900 text-white text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center gap-3">
                        Download OpenAPI JSON
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Endpoint Summaries</h4>
                <div className="space-y-4">
                    {['GET /rest/v1/auth', 'POST /rest/v1/query', 'GET /rest/v1/tables', 'PATCH /rest/v1/metadata'].map(endpoint => (
                        <div key={endpoint} className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-emerald-500 font-mono text-[10px] font-black">
                                    {endpoint.split(' ')[0]}
                                </div>
                                <span className="text-white text-sm font-mono tracking-tight">{endpoint.split(' ')[1]}</span>
                            </div>
                            <ChevronRight size={18} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="p-8 bg-zinc-900 border border-white/5 rounded-3xl space-y-6 h-fit">
                <div className="flex items-center gap-3">
                    <Globe className="text-emerald-500" size={20} />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest text-center">SDK Integration</h3>
                </div>
                
                <p className="text-zinc-500 text-xs leading-relaxed text-center">
                    Install the Afribase SDK to get typed access to your specific project's schema.
                </p>

                <div className="space-y-3">
                    <div className="p-4 bg-zinc-950 border border-white/10 rounded-xl relative group">
                        <code className="text-[10px] text-emerald-400 font-mono">npm install @afribase/js</code>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 bg-emerald-500/10 border-l border-white/5 rounded-r-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Terminal size={14} className="text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Status</span>
                        <span className="text-emerald-500">Online</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Schema Version</span>
                        <span className="text-white">v2.4.1 (Latest)</span>
                    </div>
                </div>
            </div>
            
            <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-4">
                 <div className="flex items-center gap-2 text-emerald-500">
                    <FileText size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dev Docs</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    Looking for general platform documentation instead of project-specific APIs?
                </p>
                <a href="#" className="block text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-emerald-500/20 w-fit pb-1 hover:border-emerald-500 transition-colors">
                    Visit Docs Center
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
