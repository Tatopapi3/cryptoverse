const API_BASE = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export async function getDeepDive(
  symbol: string,
  name: string,
  category: string,
  description: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
) {
  try {
    const response = await fetch(`${API_BASE}/api/deep-dive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, name, category, description }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (
            parsed.type === 'content_block_delta' &&
            parsed.delta?.type === 'text_delta'
          ) {
            onChunk(parsed.delta.text);
          }
        } catch {}
      }
    }
    onDone();
  } catch (err: any) {
    onError(err?.message ?? 'Something went wrong');
  }
}
