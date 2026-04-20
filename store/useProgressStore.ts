import { create } from 'zustand';

export interface QuizHistoryEntry {
  date: string;
  score: number;
  total: number;
  xp: number;
}

interface ProgressState {
  learnedCoins: Set<string>;
  learnedConcepts: Set<string>;
  completedQuizDates: Set<string>;
  xp: number;
  streak: number;
  lastQuizDate: string | null;
  quizHistory: QuizHistoryEntry[];
  markLearned: (symbol: string) => void;
  markConceptLearned: (conceptId: string) => void;
  recordQuizResult: (score: number, total: number) => void;
  addXP: (amount: number) => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayISO() {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>((set) => ({
  learnedCoins:       new Set<string>(),
  learnedConcepts:    new Set<string>(),
  completedQuizDates: new Set<string>(),
  xp: 0,
  streak: 0,
  lastQuizDate: null,
  quizHistory: [],

  markLearned: (symbol) =>
    set((state) => {
      if (state.learnedCoins.has(symbol)) return state;
      const next = new Set(state.learnedCoins);
      next.add(symbol);
      return { learnedCoins: next, xp: state.xp + 50 };
    }),

  markConceptLearned: (conceptId) =>
    set((state) => {
      if (state.learnedConcepts.has(conceptId)) return state;
      const next = new Set(state.learnedConcepts);
      next.add(conceptId);
      return { learnedConcepts: next, xp: state.xp + 20 };
    }),

  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

  recordQuizResult: (score, total) =>
    set((state) => {
      const today     = todayISO();
      const yesterday = yesterdayISO();
      const baseXP    = score * 20;
      const perfectBonus  = score === total ? 50 : 0;
      const isNewDay      = state.lastQuizDate !== today;
      const streakBonus   = isNewDay && state.lastQuizDate === yesterday ? 15 : 0;
      const xpEarned      = baseXP + perfectBonus + streakBonus;
      const newStreak     = isNewDay ? (state.lastQuizDate === yesterday ? state.streak + 1 : 1) : state.streak;
      const entry: QuizHistoryEntry = { date: today, score, total, xp: xpEarned };
      const newHistory = [entry, ...state.quizHistory].slice(0, 10);
      const nextQuizDates = new Set(state.completedQuizDates);
      nextQuizDates.add(today);
      return {
        xp: state.xp + xpEarned,
        streak: newStreak,
        lastQuizDate: today,
        quizHistory: newHistory,
        completedQuizDates: nextQuizDates,
      };
    }),
}));
