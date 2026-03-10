import { parse } from 'partial-json';
import { Dua, ApiDuaData } from './types';

export interface DuaChunk {
  message?: string;
  newDuas?: Dua[];
  advice?: string;
}

function classifyError(err: unknown): Error {
    if (err instanceof DOMException && err.name === 'AbortError') {
        return new Error('Request cancelled.');
    }
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
        return new Error('Unable to reach the server. Check your connection.');
    }
    if (err instanceof Error) return err;
    return new Error('Something went wrong. Please try again.');
}

/**
 * Fetches /api/dua/generate and yields incremental DuaChunks as the
 * SSE stream arrives. Consume with `for await`.
 */
export async function* streamDuas(
    prompt: string,
    signal?: AbortSignal,
): AsyncGenerator<DuaChunk> {
    let response: Response;

    try {
        response = await fetch('/api/dua/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
            signal,
        });
    } catch (err) {
        throw classifyError(err);
    }

    if (!response.ok) {
        let msg = `Server error (${response.status})`;
        try {
            const data = await response.json();
            if (data?.message) msg = data.message;
        } catch { /* ignore */ }
        throw new Error(msg);
    }

    if (!response.body) {
        throw new Error('Streaming is not supported by your browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';
    let sseBuffer = '';
    let lastMessage = '';
    let lastAdvice = '';
    let lastDuaCount = 0;

    try {
        outer: while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            const events = sseBuffer.split('\n\n');
            sseBuffer = events.pop() ?? '';

            for (const eventStr of events) {
                const line = eventStr.trim();
                if (!line.startsWith('data: ')) continue;

                let event: { type: string; text?: string; message?: string };
                try { event = JSON.parse(line.slice(6)); } catch { continue; }

                if (event.type === 'error') throw new Error(event.message ?? 'Stream error');
                if (event.type === 'done') break outer;

                if (event.type === 'chunk') {
                    accumulated += event.text ?? '';

                    try {
                        const partial = parse(accumulated) as Partial<ApiDuaData>;
                        const chunk: DuaChunk = {};

                        if (partial.message && partial.message !== lastMessage) {
                            lastMessage = partial.message;
                            chunk.message = partial.message;
                        }

                        if (Array.isArray(partial.duas)) {
                            const newDuas: Dua[] = [];
                            for (let i = lastDuaCount; i < partial.duas.length; i++) {
                                const d = partial.duas[i];
                                if (d.arabic && d.transliteration && d.translation && d.reference && d.context) {
                                    newDuas.push({
                                        id: `gen-${i}-${Date.now()}`,
                                        arabic: d.arabic,
                                        transliteration: d.transliteration,
                                        translation: d.translation,
                                        reference: d.reference,
                                        context: d.context,
                                    });
                                    lastDuaCount = i + 1;
                                }
                            }
                            if (newDuas.length) chunk.newDuas = newDuas;
                        }

                        if (partial.advice && partial.advice !== lastAdvice) {
                            lastAdvice = partial.advice;
                            chunk.advice = partial.advice;
                        }

                        if (Object.keys(chunk).length) yield chunk;
                    } catch { /* partial JSON - keep accumulating */ }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
