'use client';

import React, { useRef, useEffect } from 'react';
import { Moon, WifiOff, Send, Loader2 } from 'lucide-react';

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    onSearch: (query: string) => void;
    isLoading: boolean;
    isOffline?: boolean;
}

export default function SearchBar({ query, setQuery, onSearch, isLoading, isOffline = false }: SearchBarProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading && !isOffline) {
            onSearch(query.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (query.trim() && !isLoading && !isOffline) {
                onSearch(query.trim());
            }
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    }, [query]);

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative group">
                <div className="relative bg-input-bg border border-input-border rounded-2xl transition-all duration-300 group-focus-within:border-primary group-focus-within:shadow-[0_0_0_3px_var(--primary-glow)]">
                    {/* Top label */}
                    <div className="flex items-center gap-2 px-5 pt-4 pb-1">
                        {isOffline
                            ? <WifiOff size={14} className="text-amber-400" />
                            : <Moon size={14} className="text-primary" />
                        }
                        <span className={`text-[11px] font-medium uppercase tracking-wider ${isOffline ? 'text-amber-400' : 'text-primary'}`}>
                            {isOffline ? 'You\'re offline' : 'What\'s on your heart'}
                        </span>
                    </div>

                    <textarea
                        ref={textareaRef}
                        id="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isOffline}
                        placeholder={
                            isOffline
                                ? 'Connect to the internet to generate duas...'
                                : "I'm looking for success... I also want to ask for good health for my parents and forgiveness for my sins..."
                        }
                        className={`w-full bg-transparent px-5 py-2 text-foreground placeholder:text-text-muted text-sm md:text-base outline-none font-light resize-none leading-relaxed min-h-12 ${isOffline ? 'opacity-50 cursor-not-allowed' : ''}`}
                        rows={2}
                    />

                    {/* Bottom actions bar */}
                    <div className="flex items-center justify-between px-4 pb-3 pt-1">
                        <span className="text-[10px] text-text-muted hidden sm:block">
                            Describe everything you need, I&apos;ll find all relevant duas
                        </span>
                        <span className="text-[10px] text-text-muted block sm:hidden">
                            Press Enter to generate
                        </span>

                        <button
                            type="submit"
                            disabled={!query.trim() || isLoading || isOffline}
                            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                                query.trim() && !isLoading && !isOffline
                                    ? 'bg-primary text-white hover:opacity-90 hover:scale-[1.02]'
                                    : 'bg-subtle-bg text-text-muted cursor-not-allowed border border-subtle-border'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    <span>Generate Duas</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="flex items-center justify-center mt-3">
                <span className="text-[11px] text-text-muted flex items-center gap-1.5">
                    Press
                    <kbd className="px-1.5 py-0.5 rounded bg-subtle-bg border border-subtle-border text-[10px] font-mono text-text-secondary">
                        ⌘ K
                    </kbd>
                    to focus &nbsp;·&nbsp;
                    <kbd className="px-1.5 py-0.5 rounded bg-subtle-bg border border-subtle-border text-[10px] font-mono text-text-secondary">
                        Enter
                    </kbd>
                    to generate
                </span>
            </div>
        </form>
    );
}
