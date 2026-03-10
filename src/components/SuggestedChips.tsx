'use client';

import React from 'react';

interface SuggestedChipsProps {
  suggestions: string[];
  onSelect: (query: string) => void;
  activeQuery?: string;
}

export default function SuggestedChips({ suggestions, onSelect, activeQuery }: SuggestedChipsProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, idx) => {
                const isActive = activeQuery?.toLowerCase() === suggestion.toLowerCase();
                return (
                    <button
                        key={suggestion}
                        onClick={() => onSelect(suggestion)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border fade-in-up opacity-0 cursor-pointer ${
                            isActive
                                ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_var(--primary-glow)]'
                                : 'bg-subtle-bg text-text-secondary border-subtle-border hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                        }`}
                        style={{
                            animationDelay: `${idx * 0.04}s`,
                            animationFillMode: 'forwards',
                        }}
                    >
                        {suggestion}
                    </button>
                );
            })}
        </div>
    );
}
