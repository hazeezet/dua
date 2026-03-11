'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { duaGuides } from '@/lib/mockData';
import Sidebar from '@//components/Sidebar';
import Header from '@//components/Header';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function GuideDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

    const guide = duaGuides.find((g) => g.slug === slug);

    const toggleSection = (index: number) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const expandAll = () => {
        setExpandedSections(new Set(guide?.sections.map((_, i) => i) || []));
    };

    const collapseAll = () => {
        setExpandedSections(new Set());
    };

    if (!guide) {
        return (
            <div className="flex h-screen overflow-hidden islamic-pattern-bg bg-background">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header
                        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    />
                    <main className="flex-1 overflow-y-auto">
                        <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 text-center relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center mb-5 mx-auto">
                                <span className="text-4xl">📖</span>
                            </div>
                            <h1 className="text-xl font-semibold text-foreground mb-2">Guide not found</h1>
                            <p className="text-sm text-text-muted mb-6">The guide you&apos;re looking for doesn&apos;t exist.</p>
                            <Link href="/guides" className="text-sm text-primary hover:underline">
                ← View all guides
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden islamic-pattern-bg bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 relative z-10">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
                            <Link href="/guides" className="hover:text-primary transition-colors flex items-center gap-1.5">
                                <ArrowLeft size={14} />
                Guides
                            </Link>
                            <ChevronRight size={12} />
                            <span className="text-text-secondary">{guide.title}</span>
                        </div>

                        {/* Guide header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                                    style={{ backgroundColor: `${guide.color}15`, border: `1px solid ${guide.color}25` }}
                                >
                                    {guide.icon}
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                        {guide.title}
                                    </h1>
                                    <p className="text-sm text-text-muted mt-1">{guide.description}</p>
                                </div>
                            </div>

                            {/* Expand/Collapse controls */}
                            <div className="flex items-center gap-3 mt-4">
                                <span className="text-xs text-text-muted">{guide.sections.length} sections</span>
                                <span className="text-text-muted/30">·</span>
                                <button onClick={expandAll} className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer">
                  Expand all
                                </button>
                                <button onClick={collapseAll} className="text-xs text-primary/70 hover:text-primary transition-colors cursor-pointer">
                  Collapse all
                                </button>
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="space-y-3">
                            {guide.sections.map((section, index) => {
                                const isExpanded = expandedSections.has(index);
                                return (
                                    <div
                                        key={index}
                                        className="glass-card overflow-hidden fade-in-up opacity-0"
                                        style={{
                                            animationDelay: `${index * 0.06}s`,
                                            animationFillMode: 'forwards',
                                            borderRadius: '14px',
                                        }}
                                    >
                                        {/* Section header (clickable) */}
                                        <button
                                            onClick={() => toggleSection(index)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors hover:bg-surface-hover cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                    style={{
                                                        backgroundColor: `${guide.color}15`,
                                                        color: guide.color,
                                                    }}
                                                >
                                                    {index + 1}
                                                </div>
                                                <h3 className="text-sm md:text-base font-semibold text-foreground">
                                                    {section.heading}
                                                </h3>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className={`text-text-muted transition-transform duration-200 flex-shrink-0 ${
                                                    isExpanded ? 'rotate-90' : ''
                                                }`}
                                            />
                                        </button>

                                        {/* Section content */}
                                        {isExpanded && (
                                            <div className="px-4 md:px-5 pb-5 pt-0 space-y-4">
                                                <p className="text-sm text-foreground/80 leading-relaxed pl-10">
                                                    {section.content}
                                                </p>

                                                {section.arabic && (
                                                    <div className="ml-10 p-4 rounded-xl" style={{ backgroundColor: 'var(--arabic-bg)', border: '1px solid var(--arabic-border)' }}>
                                                        <p className="arabic-text text-lg md:text-xl text-accent-gold leading-[2.2] mb-2">
                                                            {section.arabic}
                                                        </p>
                                                        {section.transliteration && (
                                                            <p className="text-sm text-primary/70 italic font-light">
                                                                {section.transliteration}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {section.reference && (
                                                    <p className="text-xs text-text-muted pl-10">
                            📖 {section.reference}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation between guides */}
                        <div className="mt-10 flex items-center justify-between">
                            {(() => {
                                const currentIndex = duaGuides.findIndex((g) => g.slug === slug);
                                const prevGuide = currentIndex > 0 ? duaGuides[currentIndex - 1] : null;
                                const nextGuide = currentIndex < duaGuides.length - 1 ? duaGuides[currentIndex + 1] : null;

                                return (
                                    <>
                                        {prevGuide ? (
                                            <Link
                                                href={`/guides/${prevGuide.slug}`}
                                                className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
                                            >
                                                <ArrowLeft size={14} />
                                                {prevGuide.title}
                                            </Link>
                                        ) : (
                                            <div />
                                        )}
                                        {nextGuide && (
                                            <Link
                                                href={`/guides/${nextGuide.slug}`}
                                                className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
                                            >
                                                {nextGuide.title}
                                                <ChevronRight size={14} />
                                            </Link>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        <div className="h-8" />
                    </div>
                </main>
            </div>
        </div>
    );
}
