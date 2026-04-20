export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { symbol, name, category, description } = await req.json();

  const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 600,
      stream: true,
      messages: [{
        role: 'user',
        content: `Give a concise deep dive on ${name} (${symbol}), a ${category} cryptocurrency.

Context: ${description}

Cover in 4 short paragraphs (3-4 sentences each):
1. What problem it solves
2. How it works technically
3. Key strengths and real-world use
4. Main risks or criticisms

No headers. Plain prose. Be sharp and educational — assume a crypto beginner.`,
      }],
    }),
  });

  if (!anthropicResp.ok) {
    const err = await anthropicResp.text();
    return new Response(JSON.stringify({ error: err }), {
      status: anthropicResp.status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  return new Response(anthropicResp.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...CORS,
    },
  });
}
