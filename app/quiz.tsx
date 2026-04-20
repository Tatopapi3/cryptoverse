import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useProgressStore } from '../store/useProgressStore';
import { COINS } from '../constants/coins';
import { CONCEPTS } from '../constants/blockchain-concepts';
import { CURRICULUM } from '../constants/curriculum';
import { generateCoinQuestion, generateConceptQuestion, type QuizQuestion } from '../services/quiz';

const QUIZ_SIZE   = 7;
const COIN_COUNT  = 4;   // coin questions per quiz
const CONCEPT_COUNT = 3; // concept questions per quiz

// ── Build a smart question pool from current month's curriculum ──────────────
function buildPool(): { coins: typeof COINS; conceptIds: string[] } {
  const now      = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const curr     = CURRICULUM[monthKey];

  // Coin pool: current-month lesson coins first, then fill from all coins
  const monthCoins = curr
    ? curr.lessons.map(l => COINS.find(c => c.symbol === l.symbol)).filter(Boolean) as typeof COINS
    : [];
  const otherCoins = COINS.filter(c => !monthCoins.find(m => m.symbol === c.symbol));
  const shuffledOther = [...otherCoins].sort(() => Math.random() - 0.5);
  const coinPool = [...monthCoins, ...shuffledOther];

  // Concept pool: current-month concepts first, then all concepts
  const monthConceptIds = curr ? curr.conceptDays.map(cd => cd.conceptId) : [];
  const allConceptIds   = Object.keys(CONCEPTS);
  const otherConceptIds = allConceptIds.filter(id => !monthConceptIds.includes(id));
  const shuffledMonthC  = [...monthConceptIds].sort(() => Math.random() - 0.5);
  const shuffledOtherC  = [...otherConceptIds].sort(() => Math.random() - 0.5);
  const conceptPool     = [...shuffledMonthC, ...shuffledOtherC];

  return {
    coins:      coinPool.slice(0, COIN_COUNT),
    conceptIds: conceptPool.slice(0, CONCEPT_COUNT),
  };
}

// ── Interleave coin + concept items in a random order ────────────────────────
type PoolItem =
  | { type: 'coin';    coin: (typeof COINS)[number] }
  | { type: 'concept'; conceptId: string };

function buildItems(): PoolItem[] {
  const { coins, conceptIds } = buildPool();
  const items: PoolItem[] = [
    ...coins.map(c => ({ type: 'coin' as const, coin: c })),
    ...conceptIds.map(id => ({ type: 'concept' as const, conceptId: id })),
  ];
  return items.sort(() => Math.random() - 0.5);
}

export default function QuizScreen() {
  const router = useRouter();
  const { colors, categoryColors, isDark } = useTheme();
  const { recordQuizResult, quizHistory, streak } = useProgressStore();

  const items = useRef(buildItems()).current;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpBreakdown, setXpBreakdown] = useState({ base: 0, perfect: 0, streakBonus: 0 });
  const xpAwarded = useRef(false);
  const nextRef = useRef<QuizQuestion | null>(null);
  const prefetchingRef = useRef(false);

  async function loadItem(idx: number, prefetched?: QuizQuestion | null) {
    setLoading(!prefetched);
    setSelected(null);
    setError('');
    if (prefetched) { setQuestion(prefetched); nextRef.current = null; setLoading(false); return; }
    try {
      const item = items[idx];
      let q: QuizQuestion;
      if (item.type === 'coin') {
        const c = item.coin;
        q = await generateCoinQuestion(c.symbol, c.name, c.category, c.description);
      } else {
        const concept = CONCEPTS[item.conceptId];
        q = await generateConceptQuestion(concept.id, concept.title, concept.category, concept.intro, concept.keyPoints, concept.emoji);
      }
      setQuestion(q);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to generate question.');
    } finally { setLoading(false); }
  }

  async function prefetchNext(idx: number) {
    if (idx >= QUIZ_SIZE || prefetchingRef.current) return;
    prefetchingRef.current = true;
    try {
      const item = items[idx];
      if (item.type === 'coin') {
        const c = item.coin;
        nextRef.current = await generateCoinQuestion(c.symbol, c.name, c.category, c.description);
      } else {
        const concept = CONCEPTS[item.conceptId];
        nextRef.current = await generateConceptQuestion(concept.id, concept.title, concept.category, concept.intro, concept.keyPoints, concept.emoji);
      }
    } catch { nextRef.current = null; }
    finally { prefetchingRef.current = false; }
  }

  useEffect(() => { loadItem(0); }, []);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (question && i === question.correctIndex) setScore(s => s + 1);
    if (questionIndex + 1 < QUIZ_SIZE) prefetchNext(questionIndex + 1);
  }

  function handleNext() {
    const next = questionIndex + 1;
    if (next >= QUIZ_SIZE) {
      if (!xpAwarded.current) {
        xpAwarded.current = true;
        const finalScore = score + (selected === question?.correctIndex ? 1 : 0);
        const baseXP     = finalScore * 20;
        const perfectBonus = finalScore === QUIZ_SIZE ? 50 : 0;
        const today      = new Date().toISOString().slice(0, 10);
        const yesterday  = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
        const { lastQuizDate } = useProgressStore.getState();
        const streakBonusXP = lastQuizDate === yesterday ? 15 : 0;
        setXpBreakdown({ base: baseXP, perfect: perfectBonus, streakBonus: streakBonusXP });
        recordQuizResult(finalScore, QUIZ_SIZE);
      }
      setDone(true);
      return;
    }
    setQuestionIndex(next);
    loadItem(next, nextRef.current);
  }

  const catColor = question
    ? (question.kind === 'coin'
        ? (categoryColors[question.category] ?? colors.cyan)
        : CONCEPT_CATEGORY_COLORS[question.category] ?? colors.cyan)
    : colors.cyan;
  const progress = ((questionIndex + (selected !== null ? 1 : 0)) / QUIZ_SIZE) * 100;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingHorizontal: 16, paddingBottom: 12 },
    backBtn: { padding: 8 },
    backText: { fontSize: 22, color: colors.white, fontWeight: '300' },
    headerMid: { flex: 1, alignItems: 'center' },
    headerEye: { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', textTransform: 'uppercase' as const },
    headerSub: { fontSize: 13, color: colors.white, fontWeight: '700', marginTop: 1 },
    scorePill: { backgroundColor: `${colors.cyan}12`, borderWidth: 1, borderColor: `${colors.cyan}28`, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5 },
    scorePillText: { fontSize: 12, fontWeight: '700', color: colors.cyan },
    progressTrack: { height: 3, backgroundColor: colors.bgCardBorder, marginHorizontal: 20 },
    progressFill: { height: '100%' as any, borderRadius: 2 },
    body: { padding: 20, paddingBottom: 60 },

    // Kind badge (coin vs concept)
    kindBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14, borderWidth: 1 },
    kindBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },

    coinCtx: { backgroundColor: colors.bgCard, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 20, overflow: 'hidden' },
    coinCtxAccent: { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    coinCtxBadge: { alignSelf: 'flex-start', borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3, marginBottom: 8, marginLeft: 10 },
    coinCtxCat: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
    coinCtxEmoji: { fontSize: 32, paddingLeft: 10, marginBottom: 4 },
    coinCtxSymbol: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, paddingLeft: 10, lineHeight: 28 },
    coinCtxName: { fontSize: 12, color: colors.textDim, paddingLeft: 10, marginTop: 2 },

    questionText: { fontSize: 18, fontWeight: '700', color: colors.white, lineHeight: 26, marginBottom: 24, letterSpacing: -0.2 },
    optionsWrap: { gap: 10, marginBottom: 20 },
    option: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 12, padding: 14 },
    optionIndex: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.bgCardBorder, alignItems: 'center', justifyContent: 'center' },
    optionIndexText: { fontSize: 12, fontWeight: '800', color: colors.textMid },
    optionText: { flex: 1, fontSize: 14, lineHeight: 20 },
    explanation: { backgroundColor: colors.bgCard, borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
    explanationLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3, marginBottom: 6 },
    explanationText: { fontSize: 13, color: colors.textMid, lineHeight: 20 },
    nextBtn: { borderRadius: 12, padding: 16, alignItems: 'center' },
    nextBtnText: { fontSize: 14, fontWeight: '700', color: colors.bg },
    retryBtn: { width: '100%', borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 12, padding: 16, alignItems: 'center' },
    retryBtnText: { fontSize: 14, fontWeight: '600', color: colors.textMid },
    loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 16 },
    loadingText: { fontSize: 14, color: colors.textDim, fontWeight: '500' },
    errorWrap: { paddingTop: 60, alignItems: 'center', gap: 12 },
    errorTitle: { fontSize: 18, fontWeight: '700', color: colors.red },
    errorText: { fontSize: 13, color: colors.textMid, textAlign: 'center' },

    // Results
    doneWrap: { padding: 28, paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingBottom: 60 },
    doneEye: { fontSize: 10, color: colors.textDim, letterSpacing: 1.6, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' as const },
    doneScoreRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 },
    doneScore: { fontSize: 72, fontWeight: '900', color: colors.white, lineHeight: 76, letterSpacing: -2 },
    doneScoreOf: { fontSize: 36, color: colors.textDim, fontWeight: '600', marginBottom: 8 },
    doneLabel: { fontSize: 22, fontWeight: '700', marginBottom: 20, letterSpacing: -0.3 },
    doneBar: { width: '100%', height: 5, backgroundColor: colors.bgCardBorder, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
    doneBarFill: { height: '100%', borderRadius: 3 },
    donePct: { fontSize: 13, color: colors.textDim, marginBottom: 24 },

    // XP breakdown card
    xpCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderRadius: 16, padding: 18, marginBottom: 24 },
    xpCardTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: colors.textDim, marginBottom: 14 },
    xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    xpRowLabel: { fontSize: 14, color: colors.textMid, fontWeight: '500' },
    xpRowVal: { fontSize: 14, fontWeight: '800' },
    xpDivider: { height: 1, backgroundColor: colors.bgCardBorder, marginVertical: 10 },
    xpTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    xpTotalLabel: { fontSize: 15, fontWeight: '700', color: colors.white },
    xpTotalVal: { fontSize: 20, fontWeight: '900' },

    // History strip
    historyCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderRadius: 16, padding: 18, marginBottom: 24 },
    historyTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: colors.textDim, marginBottom: 14 },
    historyBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 48 },
    historyBar: { flex: 1, borderRadius: 4, minHeight: 4 },
    historyBarLabel: { fontSize: 9, color: colors.textDim, textAlign: 'center', marginTop: 4 },

    doneBtn: { width: '100%', backgroundColor: colors.cyan, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
    doneBtnText: { fontSize: 14, fontWeight: '700', color: colors.bg },
  });

  // ── Results screen ──────────────────────────────────────────────────────────
  if (done) {
    const pct       = Math.round((score / QUIZ_SIZE) * 100);
    const label     = pct === 100 ? 'Perfect!' : pct >= 80 ? 'Great work' : pct >= 60 ? 'Not bad' : 'Keep learning';
    const barColor  = pct >= 80 ? colors.green : pct >= 60 ? colors.tan : colors.red;
    const totalXP   = xpBreakdown.base + xpBreakdown.perfect + xpBreakdown.streakBonus;

    return (
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.doneWrap} showsVerticalScrollIndicator={false}>
          <Text style={s.doneEye}>QUIZ COMPLETE</Text>

          <View style={s.doneScoreRow}>
            <Text style={s.doneScore}>{score}</Text>
            <Text style={s.doneScoreOf}>/{QUIZ_SIZE}</Text>
          </View>
          <Text style={[s.doneLabel, { color: barColor }]}>{label}</Text>

          <View style={s.doneBar}>
            <View style={[s.doneBarFill, { width: `${pct}%` as any, backgroundColor: barColor }]} />
          </View>
          <Text style={s.donePct}>{pct}% correct</Text>

          {/* XP Breakdown */}
          <View style={[s.xpCard, { borderColor: `${colors.cyan}22` }]}>
            <Text style={s.xpCardTitle}>XP EARNED</Text>
            <View style={s.xpRow}>
              <Text style={s.xpRowLabel}>Correct answers ({score}×20)</Text>
              <Text style={[s.xpRowVal, { color: colors.cyan }]}>+{xpBreakdown.base}</Text>
            </View>
            {xpBreakdown.perfect > 0 && (
              <View style={s.xpRow}>
                <Text style={s.xpRowLabel}>Perfect score bonus ✦</Text>
                <Text style={[s.xpRowVal, { color: colors.green }]}>+{xpBreakdown.perfect}</Text>
              </View>
            )}
            {xpBreakdown.streakBonus > 0 && (
              <View style={s.xpRow}>
                <Text style={s.xpRowLabel}>Streak bonus 🔥</Text>
                <Text style={[s.xpRowVal, { color: colors.tan }]}>+{xpBreakdown.streakBonus}</Text>
              </View>
            )}
            <View style={s.xpDivider} />
            <View style={s.xpTotal}>
              <Text style={s.xpTotalLabel}>Total</Text>
              <Text style={[s.xpTotalVal, { color: colors.cyan }]}>+{totalXP} XP</Text>
            </View>
          </View>

          {/* Score History */}
          {quizHistory.length > 1 && (
            <View style={s.historyCard}>
              <Text style={s.historyTitle}>RECENT QUIZZES</Text>
              <View style={s.historyBars}>
                {quizHistory.slice(0, 8).reverse().map((h, i) => {
                  const hPct  = h.score / h.total;
                  const hCol  = hPct >= 0.8 ? colors.green : hPct >= 0.6 ? colors.tan : colors.red;
                  const isLast = i === quizHistory.slice(0, 8).length - 1;
                  return (
                    <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                      <View style={[s.historyBar, { height: Math.max(4, hPct * 44), backgroundColor: isLast ? hCol : `${hCol}55` }]} />
                      <Text style={s.historyBarLabel}>{h.score}/{h.total}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <Pressable style={s.doneBtn} onPress={() => router.back()}>
            <Text style={s.doneBtnText}>Back to Home</Text>
          </Pressable>
          <Pressable
            style={s.retryBtn}
            onPress={() => {
              xpAwarded.current = false;
              setQuestionIndex(0); setScore(0); setDone(false);
              setSelected(null); setQuestion(null); nextRef.current = null;
              loadItem(0);
            }}
          >
            <Text style={s.retryBtnText}>Try Again</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── Question screen ─────────────────────────────────────────────────────────
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={s.headerMid}>
          <Text style={s.headerEye}>DAILY CHALLENGE</Text>
          <Text style={s.headerSub}>Question {questionIndex + 1} of {QUIZ_SIZE}</Text>
        </View>
        <View style={s.scorePill}>
          <Text style={s.scorePillText}>{score} pts</Text>
        </View>
      </View>

      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress}%` as any, backgroundColor: catColor }]} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={colors.cyan} />
            <Text style={s.loadingText}>Generating question…</Text>
          </View>
        ) : error ? (
          <View style={s.errorWrap}>
            <Text style={s.errorTitle}>⚠ Error</Text>
            <Text style={s.errorText}>{error}</Text>
            <Pressable style={s.retryBtn} onPress={() => loadItem(questionIndex)}>
              <Text style={s.retryBtnText}>Retry</Text>
            </Pressable>
          </View>
        ) : question ? (
          <>
            {/* Context card */}
            <View style={[s.coinCtx, { borderColor: `${catColor}25` }]}>
              <View style={[s.coinCtxAccent, { backgroundColor: catColor }]} />
              <View style={[s.kindBadge, { backgroundColor: `${catColor}12`, borderColor: `${catColor}28` }]}>
                <Text style={[s.kindBadgeText, { color: catColor }]}>
                  {question.kind === 'coin' ? '🪙 COIN' : '📖 CONCEPT'}
                </Text>
              </View>
              {question.kind === 'concept' && question.emoji && (
                <Text style={s.coinCtxEmoji}>{question.emoji}</Text>
              )}
              <View style={[s.coinCtxBadge, { backgroundColor: `${catColor}14` }]}>
                <Text style={[s.coinCtxCat, { color: catColor }]}>{question.category}</Text>
              </View>
              <Text style={[s.coinCtxSymbol, { color: catColor }]}>
                {question.kind === 'coin' ? question.symbol : question.name}
              </Text>
              {question.kind === 'coin' && (
                <Text style={s.coinCtxName}>{question.name}</Text>
              )}
            </View>

            <Text style={s.questionText}>{question.question}</Text>

            <View style={s.optionsWrap}>
              {question.options.map((opt, i) => {
                const isCorrect  = i === question.correctIndex;
                const isSelected = i === selected;
                const revealed   = selected !== null;
                let bg        = colors.bgCard;
                let border    = colors.bgCardBorder;
                let textColor = colors.white;
                if (revealed) {
                  if (isCorrect)         { bg = `${colors.green}14`; border = `${colors.green}45`; textColor = colors.green; }
                  else if (isSelected)   { bg = `${colors.red}14`;   border = `${colors.red}45`;   textColor = colors.red; }
                  else                   { textColor = colors.textDim; }
                }
                return (
                  <Pressable
                    key={i}
                    style={[s.option, { backgroundColor: bg, borderColor: border }]}
                    onPress={() => handleSelect(i)}
                    disabled={revealed}
                  >
                    <View style={[
                      s.optionIndex,
                      revealed && isCorrect  && { backgroundColor: `${colors.green}22` },
                      revealed && isSelected && !isCorrect && { backgroundColor: `${colors.red}18` },
                    ]}>
                      <Text style={[
                        s.optionIndexText,
                        revealed && isCorrect  && { color: colors.green },
                        revealed && isSelected && !isCorrect && { color: colors.red },
                      ]}>
                        {String.fromCharCode(65 + i)}
                      </Text>
                    </View>
                    <Text style={[s.optionText, { color: textColor }]}>
                      {opt.replace(/^[A-D]\)\s*/, '')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {selected !== null && (
              <View style={[s.explanation, { borderColor: selected === question.correctIndex ? `${colors.green}30` : `${colors.red}30` }]}>
                <Text style={[s.explanationLabel, { color: selected === question.correctIndex ? colors.green : colors.red }]}>
                  {selected === question.correctIndex ? '✓ Correct' : '✗ Incorrect'}
                </Text>
                <Text style={s.explanationText}>{question.explanation}</Text>
              </View>
            )}

            {selected !== null && (
              <Pressable style={[s.nextBtn, { backgroundColor: catColor }]} onPress={handleNext}>
                <Text style={s.nextBtnText}>
                  {questionIndex + 1 < QUIZ_SIZE ? 'Next Question →' : 'See Results →'}
                </Text>
              </Pressable>
            )}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const CONCEPT_CATEGORY_COLORS: Record<string, string> = {
  Foundations:    '#5a9cf5',
  Cryptography:   '#b07fe0',
  Consensus:      '#f5a55a',
  DeFi:           '#5ab87a',
  Scaling:        '#f5d45a',
  Infrastructure: '#5acff5',
  Web3:           '#f55a9c',
  Privacy:        '#8ab87a',
  Advanced:       '#c05af5',
};
