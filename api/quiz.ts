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

  const body = await req.json();
  const { type } = body;

  let prompt: string;

  if (type === 'coin') {
    const { symbol, name, category, description } = body;
    prompt = `Generate a multiple choice quiz question about ${name} (${symbol}), a ${category} cryptocurrency.

Context: ${description}

Return ONLY valid JSON, no markdown, no extra text:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctIndex":0,"explanation":"..."}

Rules:
- Question should test conceptual understanding, not obscure trivia
- Make it answerable by someone learning crypto for the first time
- Explanation should be 1-2 sentences max
- correctIndex is 0-3 corresponding to the correct option`;
  } else {
    const { title, category, intro, keyPoints } = body;
    prompt = `Generate a multiple choice quiz question about this blockchain concept: "${title}" (${category}).

Summary: ${intro}
Key points: ${keyPoints.join(' | ')}

Return ONLY valid JSON, no markdown, no extra text:
{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctIndex":0,"explanation":"..."}

Rules:
- Test understanding of the concept, not memorization of exact wording
- Make it clear and answerable by a crypto beginner
- Explanation should be 1-2 sentences max
- correctIndex is 0-3`;
  }

  const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!anthropicResp.ok) {
    const err = await anthropicResp.text();
    return new Response(JSON.stringify({ error: err }), {
      status: anthropicResp.status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const data = await anthropicResp.json();
  const raw = data.content[0]?.text?.trim() ?? '{}';
  const cleaned = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  return new Response(cleaned, {
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}
