import { NextRequest } from 'next/server';
import { mockDuas } from '@/lib/mockData';

// Private server-only env var - never exposed to the browser
const DUA_API_URL = process.env.DUA_API_URL ?? '';

// ─── Mock streaming (used when DUA_API_URL is not configured) ────────────────
function buildMockStream(prompt: string): ReadableStream<Uint8Array> {
    const enc = new TextEncoder();
    const keywords = prompt.toLowerCase().split(/\W+/).filter(Boolean);

    // Score each dua against the prompt keywords
    const scored = mockDuas.map((d) => {
        let score = 0;
        for (const kw of keywords) {
            if (d.tags.some((t) => t.includes(kw) || kw.includes(t))) score += 2;
            if (d.category.includes(kw)) score += 2;
            if (d.translation.toLowerCase().includes(kw)) score += 1;
        }
        return { d, score };
    });

    const top = scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.d);

    // Fall back to first 5 if nothing matched
    const results = top.length >= 2 ? top : mockDuas.slice(0, 5);

    const duas = results.map((d) => ({
        arabic: d.arabic,
        transliteration: d.transliteration,
        translation: d.translation,
        reference: d.reference,
        context: `A supplication for ${d.category} — especially useful for ${d.tags.slice(0, 3).join(', ')}.`,
    }));

    const payload = JSON.stringify({
        message: `Here are ${duas.length} duas for "${prompt}". Running in mock mode — set DUA_API_URL in .env.local for AI-powered results.`,
        duas,
        advice:
            '⚙️ Mock mode active. Add DUA_API_URL (and optionally AUDIO_API_URL) to your .env.local to connect the real backend.',
    });

    // Slice payload into ~8 chunks to simulate incremental streaming
    const chunkSize = Math.max(1, Math.ceil(payload.length / 8));

    return new ReadableStream<Uint8Array>({
        start(controller) {
            for (let i = 0; i < payload.length; i += chunkSize) {
                const slice = payload.slice(i, i + chunkSize);
                controller.enqueue(
                    enc.encode(`data: ${JSON.stringify({ type: 'chunk', text: slice })}\n\n`),
                );
            }
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
            controller.close();
        },
    });
}

export async function POST(request: NextRequest): Promise<Response> {
    // ── Mock mode: no backend configured ────────────────────────────────────
    if (!DUA_API_URL) {
        let body: { prompt?: string };
        try {
            body = await request.json();
        } catch {
            return Response.json({ message: 'Invalid JSON body.' }, { status: 400 });
        }

        const prompt = body?.prompt?.trim() ?? 'general';

        return new Response(buildMockStream(prompt), {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive',
                'X-Mock-Mode': 'true',
            },
        });
    }

    let body: { prompt?: string };
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: 'Invalid JSON body.' }, { status: 400 });
    }

    const prompt = body?.prompt?.trim();
    if (!prompt) {
        return Response.json({ message: 'prompt is required.' }, { status: 400 });
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${DUA_API_URL}/dua/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
            },
            body: JSON.stringify({ prompt }),
            // Forward the abort signal so cancelling the client request also
            // cancels the upstream fetch
            signal: request.signal,
            cache: 'no-store',
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to reach upstream API.';
        return Response.json({ message: msg }, { status: 502 });
    }

    if (!upstream.body) {
        const text = await upstream.text().catch(() => '');
        return new Response(text || 'No response body from upstream.', {
            status: upstream.status,
        });
    }

    // Stream the SSE response straight back to the client
    return new Response(upstream.body, {
        status: upstream.status,
        headers: {
            'Content-Type': upstream.headers.get('content-type') ?? 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
