'use client';

import React, { useState } from 'react';
import { duaGuides } from '@/lib/mockData';
import Sidebar from '@//components/Sidebar';
import Header from '@//components/Header';
import BookmarkPanel from '@//components/BookmarkPanel';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function GuidesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookmarkPanelOpen, setBookmarkPanelOpen] = useState(false);

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
                        <div className="text-center mb-10 pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
                                <BookOpen size={13} className="text-primary" />
                                <span className="text-xs text-primary font-medium">
                  Learn &amp; Prepare
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                Dua Guides
                            </h1>
                            <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto leading-relaxed">
                Learn how to make dua properly, the best times to supplicate, and the etiquette that makes your dua more likely to be accepted.
                            </p>
                        </div>

                        {/* Guide cards grid */}
                        <div className="grid gap-4 md:grid-cols-2">
                            {duaGuides.map((guide, index) => (
                                <Link
                                    key={guide.slug}
                                    href={`/guides/${guide.slug}`}
                                    className="glass-card p-5 group fade-in-up opacity-0 block"
                                    style={{
                                        animationDelay: `${index * 0.08}s`,
                                        animationFillMode: 'forwards',
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: `${guide.color}15`, border: `1px solid ${guide.color}25` }}
                                        >
                                            {guide.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                {guide.title}
                                            </h3>
                                            <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                                                {guide.description}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-3 text-xs text-primary/70 group-hover:text-primary transition-colors">
                                                <span>{guide.sections.length} sections</span>
                                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

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
