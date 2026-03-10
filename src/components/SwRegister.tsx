'use client';

import { useEffect } from 'react';

/** Registers /sw.js and keeps it updated. Safe to call multiple times. */
export default function SwRegister() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((reg) => {
                // Check for updates every time the page gains focus
                const checkUpdate = () => reg.update().catch(() => {});
                window.addEventListener('focus', checkUpdate);
                return () => window.removeEventListener('focus', checkUpdate);
            })
            .catch(() => {
                // SW registration failed silently - app still works online
            });
    }, []);

    return null;
}
