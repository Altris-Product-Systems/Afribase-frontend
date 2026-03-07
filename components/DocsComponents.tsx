'use client';

import React from 'react';
import { Check, Copy, Info, AlertTriangle, Lightbulb } from 'lucide-react';

export const FeatureCard = ({ title, description, icon: Icon, href }: { title: string, description: string, icon: any, href: string }) => (
    <a
        href={href}
        className="group glass-card p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-4 active:scale-[0.98]"
    >
        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Icon size={20} />
        </div>
        <div>
            <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors">{title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">{description}</p>
        </div>
    </a>
);

export const CodeBlock = ({ code, language = 'bash' }: { code: string, language?: string }) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-8">
            <div className="absolute top-0 right-0 p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={copyToClipboard}
                    className="p-1.5 bg-zinc-800 border border-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"
                >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border-t border-x border-white/5 rounded-t-xl overflow-x-auto">
                <div className="flex gap-1.5 px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/20 border border-emerald-400/30" />
                </div>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">{language}</span>
            </div>
            <pre className="p-5 bg-black border border-white/5 rounded-b-xl overflow-x-auto text-sm text-zinc-300 font-mono leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export const Callout = ({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip', children: React.ReactNode }) => {
    const styles = {
        info: {
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            icon: <Info size={16} className="text-blue-400" />,
            text: 'text-blue-200'
        },
        warning: {
            bg: 'bg-amber-500/5',
            border: 'border-amber-500/20',
            icon: <AlertTriangle size={16} className="text-amber-400" />,
            text: 'text-amber-200'
        },
        tip: {
            bg: 'bg-emerald-500/5',
            border: 'border-emerald-500/20',
            icon: <Lightbulb size={16} className="text-emerald-400" />,
            text: 'text-emerald-200'
        }
    }[type];

    return (
        <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border} flex gap-3 my-6`}>
            <div className="mt-0.5">{styles.icon}</div>
            <div className={`text-sm font-medium leading-relaxed ${styles.text}`}>{children}</div>
        </div>
    );
};

export const Step = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => (
    <div className="flex gap-6 my-10 relative">
        <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-emerald-500/50 flex items-center justify-center text-emerald-500 text-xs font-black shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {number}
            </div>
            <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent mt-2" />
        </div>
        <div className="pb-4">
            <h3 className="text-lg font-bold text-white mb-4 tracking-tight">{title}</h3>
            <div className="text-sm text-zinc-400 leading-relaxed font-medium">{children}</div>
        </div>
    </div>
);
