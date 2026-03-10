'use client';

import React, { useState } from 'react';
import { useBookmarks } from '@/lib/BookmarkContext';
import Sidebar from '@//components/Sidebar';
import Header from '@//components/Header';
import DuaCard from '@//components/DuaCard';
import BookmarkPanel from '@//components/BookmarkPanel';
import { Bookmark, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
    const { clearAll, totalBookmarks, getBookmarkedDuas } = useBookmarks();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookmarkPanelOpen, setBookmarkPanelOpen] = useState(false);

    const bookmarkedDuas = getBookmarkedDuas();

    return (
        <div className="flex h-screen overflow-hidden islamic-pattern-bg bg-background">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    onOpenBookmarks={() => setBookmarkPanelOpen(true)}
                />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 relative z-10">
                        {/* Page header */}
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-4"
                            >
                                <ArrowLeft size={14} />
                Back to Generator
                            </Link>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
                                        <Bookmark size={20} className="text-accent-gold" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-foreground">Saved Duas</h1>
                                        <p className="text-sm text-text-muted">
                                            {totalBookmarks} {totalBookmarks === 1 ? 'dua' : 'duas'} saved
                                        </p>
                                    </div>
                                </div>

                                {totalBookmarks > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-danger/70 hover:text-danger hover:bg-danger/5 transition-all border border-danger/10 cursor-pointer"
                                    >
                                        <Trash2 size={13} />
                                        <span className="hidden sm:inline">Clear All</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Saved duas list */}
                        {bookmarkedDuas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center mb-5">
                                    <span className="text-4xl">🔖</span>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No saved duas yet
                                </h3>
                                <p className="text-sm text-text-muted max-w-sm mb-6">
                  Generate duas and tap the bookmark icon to save them here for quick access.
                                </p>
                                <Link
                                    href="/"
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-white text-sm font-medium shadow-[0_0_20px_var(--primary-glow)] hover:shadow-[0_0_30px_var(--primary-glow)] transition-all"
                                >
                  Generate Duas
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4 stagger-children">
                                {bookmarkedDuas.map((dua, index) => (
                                    <DuaCard key={dua.id} dua={dua} index={index} />
                                ))}
                            </div>
                        )}

                        <div className="h-8" />
                    </div>
                </main>
            </div>

            <BookmarkPanel
                isOpen={bookmarkPanelOpen}
                onClose={() => setBookmarkPanelOpen(false)}
            />
        </div>
    );
}
