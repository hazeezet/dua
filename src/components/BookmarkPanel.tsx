'use client';

import React from 'react';
import { useBookmarks } from '@/lib/BookmarkContext';
import { X, Trash2, BookmarkMinus } from 'lucide-react';

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookmarkPanel({ isOpen, onClose }: BookmarkPanelProps) {
    const { removeBookmark, clearAll, totalBookmarks, getBookmarkedDuas } = useBookmarks();

    const bookmarkedDuas = getBookmarkedDuas();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-sidebar-bg border-l border-card-border z-50 slide-in-right flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-card-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                            <span className="text-accent-gold text-lg">📌</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Saved Duas</h2>
                            <p className="text-xs text-text-muted">
                                {totalBookmarks} {totalBookmarks === 1 ? 'dua' : 'duas'} saved
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-hover transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {bookmarkedDuas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center mb-4">
                                <span className="text-3xl">🔖</span>
                            </div>
                            <p className="text-text-secondary font-medium mb-1">No saved duas yet</p>
                            <p className="text-text-muted text-sm max-w-[200px]">
                Tap the bookmark icon on any dua to save it here
                            </p>
                        </div>
                    ) : (
                        bookmarkedDuas.map((dua) => (
                            <div
                                key={dua.id}
                                className="glass-card p-4 group"
                                style={{ borderRadius: '12px' }}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="text-xs text-text-muted">📖 {dua.reference}</span>
                                    <button
                                        onClick={() => removeBookmark(dua.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                        title="Remove bookmark"
                                    >
                                        <BookmarkMinus size={14} />
                                    </button>
                                </div>

                                <p className="arabic-text text-lg text-accent-gold leading-relaxed mb-2">
                                    {dua.arabic}
                                </p>

                                <p className="text-sm text-foreground/80 leading-relaxed mb-1">
                                    {dua.translation}
                                </p>

                                <p className="text-xs text-text-muted">
                  📖 {dua.reference}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {totalBookmarks > 0 && (
                    <div className="p-4 border-t border-card-border">
                        <button
                            onClick={clearAll}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-danger/80 hover:text-danger hover:bg-danger/5 transition-all border border-danger/10 cursor-pointer"
                        >
                            <Trash2 size={14} />
              Clear All Saved Duas
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
