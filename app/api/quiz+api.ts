import Anthropic from '@anthropic-ai/sdk';

// Server-side API route — key is never sent to the browser
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kind, symbol, name, category, description, intro, keyPoints, emoji, conceptId } = body;

    let prompt = '';
    if (kind === 'coin') {
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
      prompt = `Generate a multiple choice quiz question about this blockchain concept: "${name}" (${category}).

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

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}';
    const cleaned = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    const result = kind === 'coin'
      ? { kind: 'coin', symbol, name, category, ...parsed }
      : { kind: 'concept', conceptId, name, category, emoji, ...parsed };

    return Response.json(result);
  } catch (err: any) {
    return Response.json({ error: err?.message ?? 'Failed to generate question' }, { status: 500 });
  }
}
