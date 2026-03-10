'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Dua, BookmarkItem } from './types';
import { pruneToBookmarks } from './audioCache';

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (dua: Dua, note?: string) => void;
  removeBookmark: (duaId: string) => void;
  isBookmarked: (duaId: string) => boolean;
  getBookmarkedDuas: () => Dua[];
  clearAll: () => void;
  totalBookmarks: number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEY = 'dua-bookmarks';

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored) as BookmarkItem[];
            }
        } catch (e) {
            console.error('Failed to load bookmarks:', e);
        }
        return [];
    });
    const [isHydrated, setIsHydrated] = useState(false);

    // Prune stale audio cache and mark hydrated on mount
    useEffect(() => {
        pruneToBookmarks(bookmarks.map((b) => b.dua.id));
        setIsHydrated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Save to localStorage whenever bookmarks change
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
            } catch (e) {
                console.error('Failed to save bookmarks:', e);
            }
        }
    }, [bookmarks, isHydrated]);

    const addBookmark = useCallback((dua: Dua, note?: string) => {
        setBookmarks((prev) => {
            if (prev.some((b) => b.dua.id === dua.id)) return prev;
            return [...prev, { dua, addedAt: Date.now(), note }];
        });
    }, []);

    const removeBookmark = useCallback((duaId: string) => {
        setBookmarks((prev) => prev.filter((b) => b.dua.id !== duaId));
    }, []);

    const isBookmarked = useCallback(
        (duaId: string) => bookmarks.some((b) => b.dua.id === duaId),
        [bookmarks]
    );

    const getBookmarkedDuas = useCallback(
        () => bookmarks.map((b) => b.dua),
        [bookmarks]
    );

    const clearAll = useCallback(() => {
        setBookmarks([]);
    }, []);

    return (
        <BookmarkContext.Provider
            value={{
                bookmarks,
                addBookmark,
                removeBookmark,
                isBookmarked,
                getBookmarkedDuas,
                clearAll,
                totalBookmarks: bookmarks.length,
            }}
        >
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarks must be used within a BookmarkProvider');
    }
    return context;
}
