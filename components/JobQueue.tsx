'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, XCircle, Clock, 
  CheckCircle2, AlertCircle, RefreshCw, 
  ChevronDown, ChevronUp, Terminal, Search, Filter
} from 'lucide-react';
import { listJobs, retryJob, cancelJob, Job, JobStatus } from '@/lib/api';
import toast from 'react-hot-toast';

interface JobQueueProps {
  projectId: string;
}

export default function JobQueue({ projectId }: JobQueueProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [projectId, filter]);

  const loadJobs = async () => {
    try {
      const data = await listJobs(projectId, filter === 'all' ? undefined : filter);
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (err: any) {
      // toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (jobId: string) => {
    try {
      await retryJob(projectId, jobId);
      toast.success('Job marked for retry');
      loadJobs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to retry job');
    }
  };

  const handleCancel = async (jobId: string) => {
    try {
      await cancelJob(projectId, jobId);
      toast.success('Job cancelled');
      loadJobs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel job');
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-zinc-500" />;
      case 'running': return <RefreshCw size={16} className="text-emerald-500 animate-spin" />;
      case 'succeeded': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'failed': return <AlertCircle size={16} className="text-red-500" />;
      case 'retrying': return <RotateCcw size={16} className="text-amber-500 animate-spin" />;
      case 'dead': return <XCircle size={16} className="text-zinc-700" />;
    }
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'pending': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
      case 'running': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'succeeded': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'retrying': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'dead': return 'bg-zinc-800 text-zinc-500 border-white/5';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3">
            <Terminal className="text-emerald-500" size={32} />
            Background Job Queue
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed font-medium">
            Monitor and manage ad-hoc background tasks. Jobs support automatic retries and dead-letter handling.
          </p>
        </div>

        <div className="flex items-center gap-2">
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-zinc-900 border border-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl outline-none focus:border-emerald-500/50 transition-all"
            >
                <option value="all">All Jobs</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
                <option value="dead">Dead Letter</option>
            </select>
            <button 
                onClick={loadJobs}
                className="p-2.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white rounded-xl transition-all"
            >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      {isLoading && jobs.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-24 text-center glass-card rounded-3xl border border-dashed border-white/10">
          <Terminal size={48} className="mx-auto text-zinc-800 mb-4" />
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">No jobs found in the queue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className={`glass-card rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10 ${expandedJobId === job.id ? 'border-emerald-500/30' : ''}`}
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-2 rounded-lg ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{job.name}</h4>
                    <p className="text-zinc-500 text-[10px] font-mono mt-0.5 uppercase tracking-widest">ID: {job.id.slice(0, 8)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:block text-right">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Attempts</p>
                    <p className="text-white text-[10px] font-bold">{job.attempts} / {job.maxAttempts}</p>
                  </div>
                  <div className="hidden lg:block text-right">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Created At</p>
                    <p className="text-white text-[10px] font-bold">{new Date(job.createdAt).toLocaleString()}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </div>
                  {expandedJobId === job.id ? <ChevronUp size={16} className="text-zinc-600" /> : <ChevronDown size={16} className="text-zinc-600" />}
                </div>
              </div>

              {expandedJobId === job.id && (
                <div className="px-5 pb-5 pt-0 animate-fade-in space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Payload</p>
                      <pre className="bg-black/50 p-4 rounded-xl border border-white/5 text-[10px] text-emerald-400 font-mono overflow-auto max-h-40">
                        {JSON.stringify(job.payload, null, 2)}
                      </pre>
                    </div>
                    {job.error && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black text-red-500/50 uppercase tracking-widest">Last Error</p>
                        <pre className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 text-[10px] text-red-400 font-mono overflow-auto max-h-40 whitespace-pre-wrap">
                          {job.error}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                    {(job.status === 'failed' || job.status === 'dead') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRetry(job.id); }}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                      >
                        <RotateCcw size={14} /> Retry Job
                      </button>
                    )}
                    {(job.status === 'pending' || job.status === 'retrying') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCancel(job.id); }}
                        className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2"
                      >
                        <XCircle size={14} /> Cancel Job
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
