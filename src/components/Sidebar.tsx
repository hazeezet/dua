'use client';

import React from 'react';
import { useBookmarks } from '@/lib/BookmarkContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NightTracker from './NightTracker';
import { X, Moon, Bookmark, BookOpen, Home, Download } from 'lucide-react';
import { usePwaInstall } from '@/lib/usePwaInstall';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  totalResults?: number;
  searchCount?: number;
}

const navItems = [
    { href: '/', label: 'Generate Duas', icon: Moon, emoji: null },
    { href: '/guides', label: 'Dua Guides', icon: BookOpen, emoji: null },
    { href: '/saved', label: 'Saved Duas', icon: Bookmark, emoji: null },
];

export default function Sidebar({
    isOpen,
    onClose,
}: SidebarProps) {
    const { totalBookmarks } = useBookmarks();
    const pathname = usePathname();
    const { canInstall, install } = usePwaInstall();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 bottom-0 w-72 bg-sidebar-bg border-r border-card-border z-40 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0 slide-in-left' : '-translate-x-full'
                }`}
            >
                {/* Logo / Brand */}
                <div className="p-5 border-b border-card-border">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)] group-hover:shadow-[0_0_30px_var(--primary-glow)] transition-shadow">
                                <Moon size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-foreground tracking-tight">
                  Dua Finder
                                </h1>
                                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  Last 10 Nights
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-hover transition-all lg:hidden cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>


                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="px-2 mb-3 flex items-center gap-2">
                        <Home size={12} className="text-text-muted" />
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">
              Navigation
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-text-secondary hover:bg-surface-hover hover:text-foreground border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {item.label === 'Saved Duas' && totalBookmarks > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold text-xs font-semibold">
                                            {totalBookmarks}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Dua Guides Quick Links */}
                    <div className="mt-6 px-2 mb-3 flex items-center gap-2">
                        <BookOpen size={12} className="text-text-muted" />
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">
              Quick Guides
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        {[
                            { href: '/guides/how-to-make-dua', icon: '🤲', label: 'How to Make Dua' },
                            { href: '/guides/opening-supplications', icon: '🌙', label: 'Opening Duas' },
                            { href: '/guides/best-times-for-dua', icon: '⏰', label: 'Best Times' },
                            { href: '/guides/dua-etiquette', icon: '📜', label: 'Etiquette' },
                            { href: '/guides/things-to-avoid', icon: '⚠️', label: 'Things to Avoid' },
                        ].map((guide) => {
                            const isActive = pathname === guide.href;
                            return (
                                <Link
                                    key={guide.href}
                                    href={guide.href}
                                    onClick={onClose}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-text-secondary hover:bg-surface-hover hover:text-foreground border border-transparent'
                                    }`}
                                >
                                    <span className="text-sm">{guide.icon}</span>
                                    <span className="font-medium text-xs">{guide.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Night Tracker */}
                <div className="p-4 border-t border-card-border">
                    {/* PWA install - only shown when browser is ready to install */}
                    {canInstall && (
                        <button
                            onClick={install}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 mb-4 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-all cursor-pointer"
                        >
                            <Download size={15} className="shrink-0" />
                            <div className="text-left">
                                <p className="text-xs font-semibold leading-none mb-0.5">Install App</p>
                                <p className="text-[10px] text-primary/60 leading-none">Use offline anytime</p>
                            </div>
                        </button>
                    )}
                    <NightTracker />
                </div>
            </aside>
        </>
    );
}
