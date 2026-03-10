import { parse } from 'partial-json';
import { Dua, ApiDuaData } from './types';

// ─── Configuration ───────────────────────────────────────────────────────────

// Points to the local Next.js route handler which proxies the external API.
// The real external URL lives in DUA_API_URL (server-only env var).
const GENERATE_ENDPOINT = '/api/dua/generate';

// ─── Streaming types ─────────────────────────────────────────────────────────

export interface StreamCallbacks {
  onMessage: (text: string) => void;
  onDua: (dua: Dua, index: number) => void;
  onAdvice: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

// ─── SSE event types ─────────────────────────────────────────────────────────

interface SSEChunkEvent {
  type: 'chunk';
  text: string;
}

interface SSEDoneEvent {
  type: 'done';
}

interface SSEErrorEvent {
  type: 'error';
  message: string;
}

type SSEEvent = SSEChunkEvent | SSEDoneEvent | SSEErrorEvent;

// ─── Error helpers ───────────────────────────────────────────────────────────

function classifyError(err: unknown): string {
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
        return 'Network error. Please check your internet connection and try again.';
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
        return 'Request timed out. Please try again.';
    }
    if (err instanceof Error) {
    // CORS errors show as generic TypeError in fetch
        if (err.message === 'Failed to fetch') {
            return 'Unable to reach the server. This could be a network or CORS issue.';
        }
        return err.message;
    }
    return 'Something went wrong. Please try again.';
}

// ─── Streaming API Client ────────────────────────────────────────────────────

/**
 * Stream personalized duas from the backend API.
 * Uses SSE + incremental JSON parsing to progressively render results.
 */
export async function streamGenerateDuas(
    prompt: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
): Promise<void> {
    let response: Response;

    try {
        response = await fetch(GENERATE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
            signal,
        });
    } catch (err) {
        callbacks.onError(classifyError(err));
        return;
    }

    if (!response.body) {
        callbacks.onError('Streaming not supported by your browser.');
        return;
    }

    // Non-200 without streaming - try to read error body
    if (!response.ok) {
        try {
            const text = await response.text();
            const data = JSON.parse(text);
            callbacks.onError(data?.message || `Server error (${response.status})`);
        } catch {
            callbacks.onError(`Server error (${response.status})`);
        }
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';
    let sseBuffer = '';
    let lastMessage = '';
    let lastAdvice = '';
    let lastDuaCount = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });

            // Parse SSE events (split by double newline)
            const events = sseBuffer.split('\n\n');
            sseBuffer = events.pop() || '';

            for (const eventStr of events) {
                const dataLine = eventStr.trim();
                if (!dataLine.startsWith('data: ')) continue;

                const jsonStr = dataLine.slice(6);
                let event: SSEEvent;

                try {
                    event = JSON.parse(jsonStr);
                } catch {
                    continue;
                }

                if (event.type === 'error') {
                    callbacks.onError(event.message);
                    return;
                }

                if (event.type === 'done') {
                    callbacks.onDone();
                    return;
                }

                if (event.type === 'chunk') {
                    accumulated += event.text;

                    // Try incremental JSON parse
                    try {
                        const partial = parse(accumulated) as Partial<ApiDuaData>;

                        // Message field
                        if (partial.message && partial.message !== lastMessage) {
                            lastMessage = partial.message;
                            callbacks.onMessage(partial.message);
                        }

                        // Duas - emit each complete dua individually
                        if (partial.duas && Array.isArray(partial.duas)) {
                            for (let i = lastDuaCount; i < partial.duas.length; i++) {
                                const apiDua = partial.duas[i];
                                if (
                                    apiDua.arabic &&
                  apiDua.transliteration &&
                  apiDua.translation &&
                  apiDua.reference &&
                  apiDua.context
                                ) {
                                    const dua: Dua = {
                                        id: `gen-${Date.now()}-${i}`,
                                        arabic: apiDua.arabic,
                                        transliteration: apiDua.transliteration,
                                        translation: apiDua.translation,
                                        reference: apiDua.reference,
                                        context: apiDua.context,
                                    };
                                    callbacks.onDua(dua, i);
                                    lastDuaCount = i + 1;
                                }
                            }
                        }

                        // Advice field
                        if (partial.advice && partial.advice !== lastAdvice) {
                            lastAdvice = partial.advice;
                            callbacks.onAdvice(partial.advice);
                        }
                    } catch {
                        // Partial JSON not yet parseable, continue accumulating
                    }
                }
            }
        }

        // If stream ended without done event
        callbacks.onDone();
    } catch (err) {
        callbacks.onError(classifyError(err));
    } finally {
        reader.releaseLock();
    }
}
