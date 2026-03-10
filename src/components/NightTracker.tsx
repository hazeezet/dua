'use client';

import React, { useState, useEffect } from 'react';
import { motivationalHadith } from '@/lib/mockData';
import { getHijriDate, HijriDateInfo } from '@/lib/hijriDate';
import { Loader2 } from 'lucide-react';

export default function NightTracker() {
    const [hijriDate, setHijriDate] = useState<HijriDateInfo | null>(null);
    const [loading, setLoading] = useState(true);
    // Pick a random hadith once on mount
    const [hadithIndex] = useState(
        () => Math.floor(Math.random() * motivationalHadith.length)
    );

    useEffect(() => {
        getHijriDate()
            .then(setHijriDate)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={18} className="text-primary animate-spin" />
            </div>
        );
    }

    if (!hijriDate) return null;

    const { ramadanDay, isRamadan, ramadanTotalDays, monthNameEn, year } = hijriDate;

    // Build the night grid for last 10 nights
    const startNight = 21;
    const nights = Array.from({ length: 10 }, (_, i) => startNight + i);

    // Determine current ramadan night (the night AFTER day N is called Night N+1 in some traditions,
    // but commonly Night 21 corresponds to day 21)
    const currentNight = isRamadan ? ramadanDay : null;

    return (
        <div className="space-y-4">
            {/* Hijri date display */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-text-secondary font-medium">
                        {isRamadan ? `Ramaḍān ${ramadanDay}` : monthNameEn} {year} AH
                    </p>
                </div>
                {isRamadan && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${hijriDate.isLastTenNights
                        ? 'bg-primary/15 text-primary border border-primary/20'
                        : 'bg-accent-gold/10 text-accent-gold border border-accent-gold/15'
                    }`}>
                        {hijriDate.isLastTenNights ? '🌙 Last 10 Nights' : `Day ${ramadanDay}/${ramadanTotalDays}`}
                    </span>
                )}
            </div>

            {/* Night progress grid */}
            {isRamadan && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">
              Last 10 Nights
                        </span>
                        {currentNight && currentNight >= 21 && (
                            <span className="text-[10px] text-primary font-medium">
                Night {currentNight}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                        {nights.map((night) => {
                            const isOdd = night % 2 !== 0;
                            const isCurrent = currentNight === night;
                            const isPast = currentNight ? night < currentNight : false;

                            return (
                                <div
                                    key={night}
                                    className={`relative flex flex-col items-center justify-center py-2 rounded-lg text-center transition-all duration-300 ${isCurrent
                                        ? 'bg-primary/20 border border-primary/40 shadow-[0_0_12px_var(--primary-glow)]'
                                        : isPast
                                            ? 'bg-subtle-bg border border-subtle-border'
                                            : 'bg-background/50 border border-subtle-border/50'
                                    }`}
                                >
                                    <span
                                        className={`text-sm font-semibold ${isCurrent
                                            ? 'text-primary'
                                            : isPast
                                                ? 'text-text-secondary'
                                                : 'text-text-muted'
                                        }`}
                                    >
                                        {night}
                                    </span>

                                    {isOdd && (
                                        <span className="text-[8px] text-accent-gold mt-0.5">✦</span>
                                    )}

                                    {isCurrent && (
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-accent-gold text-[8px]">✦</span>
                        <span className="text-[10px] text-text-muted">Odd nights - seek Laylatul Qadr</span>
                    </div>
                </div>
            )}

            {!isRamadan && (
                <div className="p-3 rounded-xl bg-subtle-bg border border-subtle-border text-center">
                    <p className="text-xs text-text-muted">
            Ramadan has not started yet. The last 10 nights tracker will activate during Ramadan.
                    </p>
                </div>
            )}

            {/* Motivational hadith */}
            <div className="p-3 rounded-xl bg-accent-gold/4 border border-accent-gold/10">
                <p className="text-xs text-accent-gold/80 italic leading-relaxed mb-1.5">
                    {motivationalHadith[hadithIndex].text}
                </p>
                <p className="text-[10px] text-accent-gold/50 font-medium">
                    - {motivationalHadith[hadithIndex].source}
                </p>
            </div>
        </div>
    );
}
