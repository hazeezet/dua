'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { suggestedQueries } from '@/lib/mockData';
import { Dua } from '@/lib/types';
import { streamDuas } from '@/lib/sseParser';
import { RotateCcw, WifiOff } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import SuggestedChips from '@/components/SuggestedChips';
import DuaResults from '@/components/DuaResults';
import BookmarkPanel from '@/components/BookmarkPanel';
import { useOnlineStatus } from '@/lib/useOnlineStatus';

export default function Home() {
    const [query, setQuery] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const [results, setResults] = useState<Dua[]>([]);
    const [message, setMessage] = useState('');
    const [advice, setAdvice] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bookmarkPanelOpen, setBookmarkPanelOpen] = useState(false);
    const [searchCount, setSearchCount] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const abortRef = useRef<AbortController | null>(null);
    const isOnline = useOnlineStatus();

    // Reset to landing state
    const handleReset = useCallback(() => {
        abortRef.current?.abort();
        setQuery('');
        setActiveQuery('');
        setResults([]);
        setMessage('');
        setAdvice('');
        setError(null);
        setHasSearched(false);
        setIsStreaming(false);
    }, []);

    // Streaming mutation via TanStack Query
    const mutation = useMutation({
        mutationFn: async (userPrompt: string) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            for await (const chunk of streamDuas(userPrompt, controller.signal)) {
                if (chunk.message) setMessage(chunk.message);
                if (chunk.newDuas) {
                    setResults((prev) => [...prev, ...chunk.newDuas!]);
                    setTotalResults((prev) => prev + chunk.newDuas!.length);
                }
                if (chunk.advice) setAdvice(chunk.advice);
            }

            setIsStreaming(false);
        },
        onError: (err: Error) => {
            setError(err.message);
            setIsStreaming(false);
        },
    });

    // Call the backend API to generate duas
    const handleGenerate = useCallback(
        async (userPrompt: string) => {
            if (!isOnline) return;
            setQuery(userPrompt);
            setIsStreaming(true);
            setHasSearched(true);
            setActiveQuery(userPrompt);
            setError(null);
            setMessage('');
            setAdvice('');
            setResults([]);
            setSearchCount((prev) => prev + 1);

            mutation.mutate(userPrompt);
        },
        [mutation, isOnline]
    );

    // Handle chip selection
    const handleChipSelect = useCallback(
        (suggestion: string) => {
            setQuery(suggestion);
            handleGenerate(suggestion);
        },
        [handleGenerate]
    );

    // Keyboard shortcut: Cmd/Ctrl + K to focus prompt
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Cleanup abort controller on unmount
    useEffect(() => {
        return () => abortRef.current?.abort();
    }, []);

    const isLoading = mutation.isPending && !message && results.length === 0;

    return (
        <div className="flex h-screen overflow-hidden islamic-pattern-bg bg-background">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                totalResults={totalResults}
                searchCount={searchCount}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    onOpenBookmarks={() => setBookmarkPanelOpen(true)}
                />

                <main className="flex-1 overflow-y-auto">
                    {/* Offline banner */}
                    {!isOnline && (
                        <div className="sticky top-0 z-20 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-sm">
                            <WifiOff size={13} className="text-amber-400 shrink-0" />
                            <span className="text-xs text-amber-400">
                                You&apos;re offline - saved duas &amp; cached audio are still available
                            </span>
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 relative z-10">
                        {/* Hero section */}
                        <div className={`text-center mb-8 transition-all duration-500 ${hasSearched ? '' : 'pt-8 md:pt-16'}`}>
                            {!hasSearched && (
                                <div className="mb-8 fade-in-up">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs text-primary font-medium">
                                            Beta 1.0
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
                                        Your Personalized{' '}
                                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-accent-gold bg-clip-text text-transparent">
                                            Dua Generator
                                        </span>
                                    </h1>
                                    <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                                        What you&apos;re going through - your hopes, struggles, and needs - and I&apos;ll
                                        generate a personalized collection of authentic duas from the Quran &amp; Sunnah.
                                    </p>
                                </div>
                            )}

                            <div className="mb-5">
                                <SearchBar
                                    query={query}
                                    setQuery={setQuery}
                                    onSearch={handleGenerate}
                                    isLoading={isLoading || isStreaming}
                                    isOffline={!isOnline}
                                />
                            </div>

                            {hasSearched && !isLoading && !isStreaming && (
                                <div className="flex justify-center mb-5">
                                    <button
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card-bg border border-card-border text-sm text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer shadow-sm"
                                    >
                                        <RotateCcw size={14} />
                                        Clear
                                    </button>
                                </div>
                            )}

                            {!hasSearched && isOnline && (
                                <div className="mt-2">
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">
                                        Quick Dua
                                    </p>
                                    <SuggestedChips
                                        suggestions={suggestedQueries}
                                        onSelect={handleChipSelect}
                                        activeQuery={activeQuery}
                                    />
                                </div>
                            )}
                        </div>

                        <DuaResults
                            results={results}
                            isLoading={isLoading}
                            isStreaming={isStreaming}
                            hasSearched={hasSearched}
                            query={activeQuery}
                            message={message}
                            advice={advice}
                            error={error}
                        />

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
