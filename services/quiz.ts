const API_BASE = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export interface QuizQuestion {
  kind: 'coin' | 'concept';
  symbol?: string;
  conceptId?: string;
  name: string;
  category: string;
  emoji?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export async function generateCoinQuestion(
  symbol: string,
  name: string,
  category: string,
  description: string,
): Promise<QuizQuestion> {
  const response = await fetch(`${API_BASE}/api/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'coin', symbol, name, category, description }),
  });

  if (!response.ok) throw new Error(`Quiz API error: ${response.status}`);
  const parsed = await response.json();
  return { kind: 'coin', symbol, name, category, ...parsed };
}

export async function generateConceptQuestion(
  conceptId: string,
  title: string,
  category: string,
  intro: string,
  keyPoints: string[],
  emoji?: string,
): Promise<QuizQuestion> {
  const response = await fetch(`${API_BASE}/api/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'concept', title, category, intro, keyPoints }),
  });

  if (!response.ok) throw new Error(`Quiz API error: ${response.status}`);
  const parsed = await response.json();
  return { kind: 'concept', conceptId, name: title, category, emoji, ...parsed };
}

export const generateQuizQuestion = generateCoinQuestion;
