'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Database,
  Users,
  HardDrive,
  Zap,
  Activity,
  Menu,
  X,
  ChevronRight,
  Search,
  Github
} from 'lucide-react';

const docsNavigation = [
  {
    title: 'Getting Started',
    links: [
      { name: 'Introduction', href: '/docs', icon: BookOpen },
      { name: 'Architecture', href: '/docs/architecture', icon: Activity },
    ],
  },
  {
    title: 'Core Features',
    links: [
      { name: 'Database', href: '/docs/database', icon: Database },
      { name: 'Authentication', href: '/docs/auth', icon: Users },
      { name: 'Storage', href: '/docs/storage', icon: HardDrive },
      { name: 'Edge Functions', href: '/docs/edge-functions', icon: Zap },
      { name: 'Realtime', href: '/docs/realtime', icon: Activity },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/AFR.png"
                alt="Afribase Logo"
                className="h-8 object-contain transition-transform group-hover:scale-110"
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-white transition-colors">Dashboard</Link>
              <a href="https://github.com/Altris-Product-Systems/Afribase-frontend" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
                <Github size={16} />
                GitHub
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 group hover:border-emerald-500/30 transition-all cursor-text">
              <Search size={14} className="text-zinc-500 group-hover:text-emerald-400" />
              <span className="text-xs text-zinc-500 group-hover:text-white font-medium">Search documentation...</span>
              <kbd className="text-[10px] bg-white/5 border border-white/10 px-1 rounded text-zinc-600">⌘K</kbd>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto flex pt-16">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-0 top-16 z-40 lg:sticky lg:h-[calc(100vh-64px)] lg:w-72 lg:block
            ${isSidebarOpen ? 'bg-[#050505] translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out border-r border-white/5 overflow-y-auto px-6 py-10
          `}
        >
          <nav className="space-y-10">
            {docsNavigation.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-3">{section.title}</h3>
                <div className="space-y-1">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                          }
                        `}
                      >
                        <Icon size={16} className={`${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                        {link.name}
                        {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0 p-8 lg:p-12 xl:p-16 max-w-4xl animate-fade-in scroll-smooth">
          {children}

          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-xs text-zinc-600 font-medium">© 2026 Afribase Cloud Infrastructure. Produced by Altris Product Systems.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-zinc-600 hover:text-emerald-500 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-zinc-600 hover:text-emerald-500 transition-colors">Terms</Link>
              <a href="https://discord.gg/afribase" className="text-xs text-zinc-600 hover:text-emerald-500 transition-colors">Support</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
