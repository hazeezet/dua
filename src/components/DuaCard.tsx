'use client';

import React, { useState } from 'react';
import { Dua } from '@/lib/types';
import { useBookmarks } from '@/lib/BookmarkContext';
import { Bookmark, BookmarkCheck, Copy, Share2, Check } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { deleteCachedAudio } from '@/lib/audioCache';

interface DuaCardProps {
  dua: Dua;
  index: number;
}

export default function DuaCard({ dua, index }: DuaCardProps) {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
    const [copied, setCopied] = useState(false);
    const bookmarked = isBookmarked(dua.id);

    const handleBookmark = () => {
        if (bookmarked) {
            removeBookmark(dua.id);
            // Clean up persisted audio - no longer needed without bookmark
            deleteCachedAudio(dua.id);
        } else {
            addBookmark(dua);
            // AudioPlayer detects persist=true and saves its in-memory blob automatically
        }
    };

    const handleCopy = async () => {
        const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n- ${dua.reference}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error('Failed to copy');
        }
    };

    const handleShare = async () => {
        const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n- ${dua.reference}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Dua',
                    text,
                });
            } catch {
                // User cancelled share
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div
            className="glass-card p-5 md:p-6 fade-in-up opacity-0"
            style={{
                animationDelay: `${index * 0.08}s`,
                animationFillMode: 'forwards',
            }}
        >
            {/* Top row: actions */}
            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-hover transition-all cursor-pointer"
                        title="Copy"
                    >
                        {copied ? <Check size={15} className="text-primary" /> : <Copy size={15} />}
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-hover transition-all cursor-pointer"
                        title="Share"
                    >
                        <Share2 size={15} />
                    </button>
                    <button
                        onClick={handleBookmark}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${bookmarked
                            ? 'text-accent-gold bg-accent-gold/10'
                            : 'text-text-muted hover:text-accent-gold hover:bg-surface-hover'
                        }`}
                        title={bookmarked ? 'Remove bookmark' : 'Save dua'}
                    >
                        {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    </button>
                </div>
            </div>

            {/* Arabic text */}
            <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--arabic-bg)', border: '1px solid var(--arabic-border)' }}>
                <p className="arabic-text text-xl md:text-2xl text-accent-gold leading-[2.4]">
                    {dua.arabic}
                </p>
            </div>

            {/* Transliteration */}
            <p className="text-sm text-primary/80 italic mb-3 leading-relaxed font-light">
                {dua.transliteration}
            </p>

            {/* Translation */}
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                {dua.translation}
            </p>

            {/* Reference */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-text-muted">📖</span>
                <span className="text-xs text-text-muted font-medium">{dua.reference}</span>
            </div>

            {/* Context - why this dua is relevant */}
            {dua.context && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-primary/[0.03] border border-primary/8">
                    <p className="text-xs text-text-secondary leading-relaxed">
                        <span className="font-medium text-primary/70">Why this dua: </span>
                        {dua.context}
                    </p>
                </div>
            )}

            {/* Audio player */}
            <div className="pt-3 border-t border-subtle-border">
                <AudioPlayer duaId={dua.id} arabic={dua.arabic} persist={bookmarked} />
            </div>
        </div>
    );
}
