'use client';

import React from 'react';
import { useBookmarks } from '@/lib/BookmarkContext';
import { Menu, Bookmark, Moon } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
    const { totalBookmarks } = useBookmarks();

    return (
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-card-border">
            <div className="flex items-center justify-between px-4 md:px-6 h-14">
                {/* Left: hamburger (mobile) */}
                <button
                    onClick={onToggleSidebar}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-hover transition-all lg:hidden cursor-pointer"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                {/* Center: title (mobile only) */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Moon size={16} className="text-primary" />
                    <span className="text-sm font-semibold text-foreground">Dua Finder</span>
                </div>

                {/* Right: bookmark toggle */}
                <div className="flex items-center gap-2">
                    <a
                        href="/saved"
                        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-gold hover:bg-surface-hover transition-all cursor-pointer"
                        aria-label="Open bookmarks"
                    >
                        <Bookmark size={18} />
                        {totalBookmarks > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-accent-gold text-[9px] font-bold text-background flex items-center justify-center min-w-[18px] h-[18px]">
                                {totalBookmarks}
                            </span>
                        )}
                    </a>
                </div>
            </div>
        </header>
    );
}
