import { NextRequest } from 'next/server';

const AUDIO_API_URL = process.env.AUDIO_API_URL ?? '';

export async function POST(request: NextRequest): Promise<Response> {
    // ── Mock mode: audio is unavailable without the backend ─────────────────
    if (!AUDIO_API_URL) {
        return Response.json(
            {
                statusCode: 503,
                message: 'Audio is not available in mock mode. Set AUDIO_API_URL in .env.local to enable it.',
                error: 'MOCK_MODE',
                data: null,
            },
            { status: 503 },
        );
    }

    let body: { text?: string; gender?: string };
    try {
        body = await request.json();
    } catch {
        return Response.json(
            { statusCode: 400, message: 'Invalid JSON body.', error: 'BAD_REQUEST', data: null },
            { status: 400 },
        );
    }

    if (!body?.text?.trim()) {
        return Response.json(
            { statusCode: 400, message: 'text is required.', error: 'BAD_REQUEST', data: null },
            { status: 400 },
        );
    }

    let upstream: Response;
    try {
        upstream = await fetch(`${AUDIO_API_URL}/dua/audio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: request.signal,
            cache: 'no-store',
        });
        console.log('Upstream response status:', upstream);
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to reach upstream API.';
        return Response.json(
            { statusCode: 502, message: msg, error: 'BAD_GATEWAY', data: null },
            { status: 502 },
        );
    }

    const data = await upstream.json();
    console.log('Upstream response data:', data);
    return Response.json(data, { status: upstream.status });
}
