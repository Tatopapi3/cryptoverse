import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

export async function POST(request: Request) {
  const { symbol, name, category, description } = await request.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claude = client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 420,
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
        });

        for await (const event of claude) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err: any) {
        controller.enqueue(encoder.encode(`\n\nError: ${err?.message ?? 'Something went wrong'}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
