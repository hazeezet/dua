'use client';

import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="glass-card p-5 md:p-6"
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    {/* Category pill */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-6 w-24 rounded-full skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-base)' }} />
                        <div className="flex gap-1">
                            <div className="w-8 h-8 rounded-lg skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                            <div className="w-8 h-8 rounded-lg skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                            <div className="w-8 h-8 rounded-lg skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                        </div>
                    </div>

                    {/* Arabic text block */}
                    <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--arabic-bg)', border: '1px solid var(--arabic-border)' }}>
                        <div className="flex flex-col items-end gap-2">
                            <div className="h-7 w-full rounded bg-accent-gold/[0.06] skeleton-pulse" />
                            <div className="h-7 w-3/4 rounded bg-accent-gold/[0.06] skeleton-pulse" />
                        </div>
                    </div>

                    {/* Transliteration */}
                    <div className="mb-3 space-y-1.5">
                        <div className="h-4 w-full rounded bg-primary/[0.06] skeleton-pulse" />
                        <div className="h-4 w-2/3 rounded bg-primary/[0.06] skeleton-pulse" />
                    </div>

                    {/* Translation */}
                    <div className="mb-4 space-y-1.5">
                        <div className="h-4 w-full rounded skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                        <div className="h-4 w-5/6 rounded skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                    </div>

                    {/* Reference */}
                    <div className="h-3 w-40 rounded skeleton-pulse mb-4" style={{ backgroundColor: 'var(--skeleton-dim)' }} />

                    {/* Audio bar */}
                    <div className="pt-3 border-t border-subtle-border flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/[0.08] skeleton-pulse" />
                        <div className="flex-1 h-1.5 rounded-full skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                        <div className="w-14 h-3 rounded skeleton-pulse" style={{ backgroundColor: 'var(--skeleton-dim)' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
