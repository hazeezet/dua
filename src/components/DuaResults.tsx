'use client';

import React from 'react';
import { Dua } from '@/lib/types';
import DuaCard from './DuaCard';
import LoadingSkeleton from './LoadingSkeleton';
import { Moon, MessageCircle, AlertTriangle, BookOpen, RefreshCw } from 'lucide-react';

interface DuaResultsProps {
  results: Dua[];
  isLoading: boolean;
  isStreaming: boolean;
  hasSearched: boolean;
  query: string;
  message: string;
  advice: string;
  error: string | null;
}

export default function DuaResults({
    results,
    isLoading,
    isStreaming,
    hasSearched,
    message,
    advice,
    error,
}: DuaResultsProps) {
    // Initial loading - show skeleton until first content arrives
    if (isLoading && results.length === 0 && !message) {
        return (
            <div>
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Moon size={11} className="text-primary animate-pulse" />
                    </div>
                    <p className="text-sm text-text-secondary">
            Generating personalized duas for your needs...
                    </p>
                </div>
                <LoadingSkeleton />
            </div>
        );
    }

    if (!hasSearched) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-accent-gold/10 border border-card-border flex items-center justify-center">
                        <span className="text-5xl">🤲</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center" style={{ animation: 'star-twinkle 2s ease-in-out infinite' }}>
                        <span className="text-xs">✦</span>
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
          What are you making dua for?
                </h3>
                <p className="text-sm text-text-muted max-w-sm leading-relaxed">
          Describe what&apos;s on your mind - a job, healing, forgiveness, family - and we&apos;ll generate a personalized collection of authentic duas from the Quran and Sunnah, just for you.
                </p>

                <div className="mt-8 space-y-2 max-w-md w-full">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Example Duas</p>
                    {[
                        "I'm struggling to find a job and I need help with my finances...",
                        "My mother is ill and I want her to recover fully...",
                        "I want to be forgiven and guided to the straight path...",
                    ].map((example, i) => (
                        <div
                            key={i}
                            className="px-4 py-3 rounded-xl bg-subtle-bg border border-subtle-border text-left text-xs text-text-secondary italic leading-relaxed"
                        >
              &ldquo;{example}&rdquo;
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state - show actual error message
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
                    <AlertTriangle size={28} className="text-danger" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
                </h3>
                <p className="text-sm text-text-muted max-w-sm mb-4">
                    {error}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card-bg border border-card-border text-sm text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                >
                    <RefreshCw size={14} />
          Try again
                </button>
            </div>
        );
    }

    // No results and not streaming
    if (results.length === 0 && !isStreaming && !message) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center mb-4">
                    <span className="text-4xl">🕌</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
          We couldn&apos;t find specific duas for that
                </h3>
                <p className="text-sm text-text-muted max-w-sm">
          Try describing your need differently. For example: &ldquo;I need help with health&rdquo;, &ldquo;seeking forgiveness&rdquo;, or &ldquo;looking for a job&rdquo;.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* AI Message */}
            {message && (
                <div className="mb-4 p-4 rounded-xl bg-primary/[0.04] border border-primary/10 fade-in-up">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MessageCircle size={14} className="text-primary" />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{message}</p>
                    </div>
                </div>
            )}

            {/* Dua cards - appear one-by-one via streaming */}
            <div className="space-y-4 stagger-children">
                {results.map((dua, index) => (
                    <DuaCard key={dua.id} dua={dua} index={index} />
                ))}
            </div>

            {/* Streaming indicator */}
            {isStreaming && (
                <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Generating more duas...</span>
                </div>
            )}

            {/* Islamic advice */}
            {advice && (
                <div className="mt-6 p-4 rounded-xl bg-accent-gold/[0.04] border border-accent-gold/15 fade-in-up">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <BookOpen size={14} className="text-accent-gold" />
                        </div>
                        <div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{advice}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
