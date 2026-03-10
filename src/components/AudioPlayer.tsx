'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Play, Pause, Loader2, Volume2, HardDrive } from 'lucide-react';
import { getCachedAudio, cacheAudio, base64ToBlob, persistAudioBlob } from '@/lib/audioCache';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AudioPlayerProps {
  duaId: string;
  arabic: string;
  gender?: 'male' | 'female';
  /** Only persist audio to IndexedDB when true (i.e. dua is bookmarked) */
  persist?: boolean;
}

interface AudioApiResponse {
  statusCode: number;
  message: string;
  error: string | null;
  data: { audio: string; format: string } | null;
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function fetchAudio(
    arabic: string,
    gender: 'male' | 'female',
): Promise<AudioApiResponse> {
    const res = await fetch('/api/dua/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: arabic, gender }),
    });
    return res.json();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AudioPlayer({
    duaId,
    arabic,
    gender = 'male',
    persist = false,
}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isCached, setIsCached] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const blobUrlRef = useRef<string | null>(null);
    const blobRef = useRef<Blob | null>(null);

    // Revoke stale blob URL when replaced or on unmount
    const setAudio = useCallback((url: string, cached: boolean) => {
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = url;
        setAudioUrl(url);
        setIsCached(cached);
    }, []);

    useEffect(() => {
        return () => {
            if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        };
    }, []);

    // Check IndexedDB cache on mount - only if this dua is bookmarked (persist=true)
    useEffect(() => {
        if (!persist) return;
        getCachedAudio(duaId).then((url) => {
            if (url) setAudio(url, true);
        });
    }, [duaId, persist, setAudio]);

    // Wire HTML5 Audio events whenever src changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;
        audio.src = audioUrl;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        };
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            audio.currentTime = 0;
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioUrl]);

    // TanStack Query mutation - fetch from API, optionally cache in IndexedDB, then play
    const mutation = useMutation({
        mutationFn: () => fetchAudio(arabic, gender),
        onSuccess: async (response) => {
            if (!response.data) throw new Error(response.message || 'No audio returned.');
            let url: string;
            if (persist) {
                // Bookmarked: save to IndexedDB so it survives page reloads
                url = await cacheAudio(duaId, response.data.audio, response.data.format);
                setAudio(url, true);
            } else {
                // Not bookmarked: keep in memory only - gone when component unmounts
                const blob = base64ToBlob(response.data.audio, `audio/${response.data.format}`);
                blobRef.current = blob; // hold onto it in case user bookmarks later
                url = URL.createObjectURL(blob);
                setAudio(url, false);
            }
        },
    });

    // When the dua gets bookmarked while audio is already in memory,
    // persist the in-memory blob to IndexedDB instead of re-fetching.
    useEffect(() => {
        if (!persist || isCached || !blobRef.current) return;
        persistAudioBlob(duaId, blobRef.current).then(() => setIsCached(true)).catch(() => {});
    }, [persist, duaId, isCached]);

    // Auto-play once a fresh fetch completes
    useEffect(() => {
        if (mutation.isSuccess && audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [mutation.isSuccess]);

    const togglePlay = useCallback(async () => {
    // No audio yet - fetch first; auto-play fires in the effect above
        if (!audioUrl) {
            mutation.mutate();
            return;
        }
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            await audio.play();
            setIsPlaying(true);
        }
    }, [audioUrl, isPlaying, mutation]);

    const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * audio.duration;
    };

    const formatTime = (s: number) => {
        if (!s || isNaN(s)) return '0:00';
        return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <audio ref={audioRef} preload="metadata" />

            <div className="flex items-center gap-3 w-full">
                <button
                    onClick={togglePlay}
                    disabled={mutation.isPending}
                    title={audioUrl ? (isPlaying ? 'Pause' : 'Play') : 'Load & play audio'}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer disabled:cursor-wait ${
                        isPlaying
                            ? 'bg-primary text-white shadow-[0_0_15px_var(--primary-glow)]'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                >
                    {mutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : isPlaying ? (
                        <Pause size={14} />
                    ) : (
                        <Play size={14} className="ml-0.5" />
                    )}
                </button>

                {/* Seekable progress bar */}
                <div
                    className="flex-1 flex items-center gap-2 cursor-pointer"
                    onClick={seekTo}
                >
                    <div className="flex-1 h-1.5 bg-subtle-bg rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-primary to-accent-gold rounded-full transition-[width] duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-text-muted font-mono whitespace-nowrap shrink-0 tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {isCached && (
                        <span title="Audio cached locally">
                            <HardDrive size={12} className="text-primary/40" />
                        </span>
                    )}
                    <Volume2 size={14} className="text-text-muted" />
                </div>
            </div>

            {mutation.isError && (
                <p className="text-[10px] text-red-400 pl-11">
                    {(mutation.error as Error).message}
                </p>
            )}
        </div>
    );
}



