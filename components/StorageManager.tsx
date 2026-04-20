import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgressStore } from '../store/useProgressStore';
import { useThemeStore } from '../store/useThemeStore';

const PROGRESS_KEY = 'cryptoverse-progress';
const THEME_KEY    = 'cryptoverse-theme';

// Renders nothing — just wires up AsyncStorage load/save for both stores.
export default function StorageManager() {
  // ── Load saved state on mount ─────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY).then((raw) => {
      if (!raw) return;
      try {
        const d = JSON.parse(raw);
        useProgressStore.setState({
          xp:                 d.xp                 ?? 0,
          streak:             d.streak             ?? 0,
          lastQuizDate:       d.lastQuizDate       ?? null,
          learnedCoins:       new Set<string>(d.learnedCoins    ?? []),
          learnedConcepts:    new Set<string>(d.learnedConcepts ?? []),
          completedQuizDates: new Set<string>(d.completedQuizDates ?? []),
          quizHistory:        d.quizHistory        ?? [],
        });
      } catch {}
    });

    AsyncStorage.getItem(THEME_KEY).then((raw) => {
      if (!raw) return;
      try {
        const d = JSON.parse(raw);
        if (typeof d.isDark === 'boolean') {
          useThemeStore.setState({ isDark: d.isDark });
        }
      } catch {}
    });
  }, []);

  // ── Save whenever state changes ───────────────────────────────────────────
  useEffect(() => {
    const unsubProgress = useProgressStore.subscribe((state) => {
      AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify({
        xp:                 state.xp,
        streak:             state.streak,
        lastQuizDate:       state.lastQuizDate,
        learnedCoins:       [...state.learnedCoins],
        learnedConcepts:    [...state.learnedConcepts],
        completedQuizDates: [...state.completedQuizDates],
        quizHistory:        state.quizHistory,
      }));
    });

    const unsubTheme = useThemeStore.subscribe((state) => {
      AsyncStorage.setItem(THEME_KEY, JSON.stringify({ isDark: state.isDark }));
    });

    return () => { unsubProgress(); unsubTheme(); };
  }, []);

  return null;
}
