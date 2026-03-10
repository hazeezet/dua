// ─── IndexedDB audio cache ────────────────────────────────────────────────────
// Stores audio blobs keyed by duaId. Blob URLs are created on demand and
// revoked when no longer needed.

const DB_NAME = 'dua-audio-cache';
const STORE = 'audio';
const DB_VERSION = 1;

interface CachedAudio {
  duaId: string;
  blob: Blob;
  savedAt: number;
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(STORE, { keyPath: 'duaId' });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mimeType });
}

/** Returns a fresh object URL for the cached audio, or null if not cached. */
export async function getCachedAudio(duaId: string): Promise<string | null> {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const req = db
                .transaction(STORE, 'readonly')
                .objectStore(STORE)
                .get(duaId);
            req.onsuccess = () => {
                const row = req.result as CachedAudio | undefined;
                resolve(row ? URL.createObjectURL(row.blob) : null);
            };
            req.onerror = () => resolve(null);
        });
    } catch {
        return null;
    }
}

/** Persists an already-decoded Blob into IndexedDB (no URL returned). */
export async function persistAudioBlob(duaId: string, blob: Blob): Promise<void> {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
        const req = db
            .transaction(STORE, 'readwrite')
            .objectStore(STORE)
            .put({ duaId, blob, savedAt: Date.now() } satisfies CachedAudio);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

/** Converts base64 audio to a Blob, stores it, and returns a blob URL. */
export async function cacheAudio(
    duaId: string,
    base64: string,
    format: string,
): Promise<string> {
    const blob = base64ToBlob(base64, `audio/${format}`);
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
        const req = db
            .transaction(STORE, 'readwrite')
            .objectStore(STORE)
            .put({ duaId, blob, savedAt: Date.now() } satisfies CachedAudio);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
    return URL.createObjectURL(blob);
}

export async function hasCachedAudio(duaId: string): Promise<boolean> {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const req = db
                .transaction(STORE, 'readonly')
                .objectStore(STORE)
                .count(duaId);
            req.onsuccess = () => resolve(req.result > 0);
            req.onerror = () => resolve(false);
        });
    } catch {
        return false;
    }
}

export async function deleteCachedAudio(duaId: string): Promise<void> {
    try {
        const db = await openDB();
        await new Promise<void>((resolve) => {
            const tx = db.transaction(STORE, 'readwrite');
            tx.objectStore(STORE).delete(duaId);
            tx.oncomplete = () => resolve();
        });
    } catch { /* ignore */ }
}

/**
 * Removes all IndexedDB audio entries whose duaId is NOT in `bookmarkedIds`.
 * Call this on app startup to evict stale entries from unbookmarked duas.
 */
export async function pruneToBookmarks(bookmarkedIds: string[]): Promise<void> {
    try {
        const db = await openDB();
        const ids: string[] = await new Promise((resolve, reject) => {
            const req = db
                .transaction(STORE, 'readonly')
                .objectStore(STORE)
                .getAllKeys();
            req.onsuccess = () => resolve(req.result as string[]);
            req.onerror = () => reject(req.error);
        });
        const set = new Set(bookmarkedIds);
        const stale = ids.filter((id) => !set.has(id));
        if (stale.length === 0) return;
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite');
            const store = tx.objectStore(STORE);
            stale.forEach((id) => store.delete(id));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch { /* ignore */ }
}
