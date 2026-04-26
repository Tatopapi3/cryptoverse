import {
  View, Text, StyleSheet, Pressable, Platform,
  ScrollView, Image, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/useProgressStore';
import { COINS } from '../../constants/coins';
import { CURRICULUM, MONTH_NAMES, DAY_LABELS } from '../../constants/curriculum';
import { EVENTS_BY_DATE, EVENT_TYPE_COLORS, EVENTS, type CryptoEvent } from '../../constants/events';
import { CONCEPTS } from '../../constants/blockchain-concepts';

const FOUNDATION_IDS = [
  'blockchain-basics',
  'distributed-ledger',
  'cryptographic-hash',
  'public-key-crypto',
  'proof-of-work',
  'proof-of-stake',
  'smart-contracts',
  'consensus-overview',
  'digital-signatures',
];

const H_PAD = 8;
const EVENT_TYPE_LABELS: Record<string, string> = {
  conference: 'Conference', upgrade: 'Upgrade',
  milestone: 'Milestone', ama: 'AMA', halving: 'Halving',
};
const CONCEPT_CAT_COLORS: Record<string, string> = {
  Foundations: '#5a9cf5', Cryptography: '#b07fe0', Consensus: '#f5a55a',
  DeFi: '#5ab87a', Scaling: '#f5d45a', Infrastructure: '#5acff5',
  Web3: '#f55a9c', Privacy: '#8ab87a', Advanced: '#c05af5',
};

type ViewMode = 'calendar' | 'path';
type StepType = 'concept' | 'lesson' | 'quiz';
interface Step { day: number; type: StepType; conceptId?: string; symbol?: string; dateKey: string; }

function getMonthSteps(monthKey: string): Step[] {
  const curriculum = CURRICULUM[monthKey];
  if (!curriculum) return [];
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth   = new Date(year, month, 0).getDate();
  const firstDay      = new Date(year, month - 1, 1).getDay();
  const lessonByDay: Record<number, string>  = {};
  const conceptByDayMap: Record<number, string> = {};
  const quizDaySet = new Set<number>();
  curriculum.lessons.forEach(l    => { lessonByDay[l.day]       = l.symbol; });
  curriculum.conceptDays.forEach(c => { conceptByDayMap[c.day]  = c.conceptId; });
  curriculum.quizDays.forEach(d   => quizDaySet.add(d));
  const steps: Step[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = (firstDay + day - 1) % 7;
    if (dow === 0) continue;
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (lessonByDay[day])        steps.push({ day, type: 'lesson',  symbol: lessonByDay[day], dateKey });
    else if (quizDaySet.has(day))  steps.push({ day, type: 'quiz',   dateKey });
    else if (conceptByDayMap[day]) steps.push({ day, type: 'concept', conceptId: conceptByDayMap[day], dateKey });
  }
  return steps;
}

export default function LearnScreen() {
  const router = useRouter();
  const { colors, categoryColors, isDark, toggle } = useTheme();
  const { xp, streak, learnedCoins, learnedConcepts, completedQuizDates } = useProgressStore();
  const { width: screenW } = useWindowDimensions();
  const CELL_W = Math.floor((screenW - H_PAD * 2) / 7);
  const CELL_H = Math.floor(CELL_W * 1.35);

  const now        = new Date();
  const todayISO   = now.toISOString().slice(0, 10);
  const todayDay   = now.getDate();
  const todayMonth = now.getMonth() + 1;
  const todayYear  = now.getFullYear();
  const hour       = now.getHours();
  const greeting   = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [view, setView]           = useState<ViewMode>('calendar');
  const [viewMonth, setViewMonth] = useState(todayMonth);
  const [viewYear, setViewYear]   = useState(todayYear);

  const currentMonthKey = `${todayYear}-${String(todayMonth).padStart(2, '0')}`;
  const [expanded, setExpanded]   = useState<Set<string>>(new Set([currentMonthKey]));
  const toggleExpand = (mk: string) => setExpanded(prev => {
    const next = new Set(prev); next.has(mk) ? next.delete(mk) : next.add(mk); return next;
  });

  // Calendar data
  const monthKey        = `${viewYear}-${String(viewMonth).padStart(2, '0')}`;
  const curriculum      = CURRICULUM[monthKey];
  const themeSymbol     = curriculum?.themeSymbol;
  const themeCoin       = COINS.find(c => c.symbol === themeSymbol);
  const catColor        = themeCoin ? (categoryColors[themeCoin.category] ?? colors.cyan) : colors.cyan;
  const firstDayOfWeek  = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth     = new Date(viewYear, viewMonth, 0).getDate();
  const cells: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = cells.length / 7;

  const lessonByDay: Record<number, string>  = {};
  const conceptByDay: Record<number, string> = {};
  const quizDaySet = new Set<number>();
  curriculum?.lessons.forEach(l     => { lessonByDay[l.day]  = l.symbol; });
  curriculum?.conceptDays?.forEach(c => { conceptByDay[c.day] = c.conceptId; });
  curriculum?.quizDays.forEach(d    => quizDaySet.add(d));

  const weekCoinMap: Record<number, string> = {};
  curriculum?.lessons.forEach(l => {
    const wIdx = Math.floor((firstDayOfWeek + l.day - 1) / 7);
    if (!weekCoinMap[wIdx]) weekCoinMap[wIdx] = l.symbol;
  });

  const isCurrentMonth   = viewMonth === todayMonth && viewYear === todayYear;
  const todayWeekIdx     = Math.floor((firstDayOfWeek + todayDay - 1) / 7);
  const cotwSym          = isCurrentMonth ? (weekCoinMap[todayWeekIdx] ?? null) : null;
  const cotwCoin         = cotwSym ? COINS.find(c => c.symbol === cotwSym) : null;
  const cotwColor        = cotwCoin ? (categoryColors[cotwCoin.category] ?? colors.cyan) : colors.cyan;
  const totalLessons     = curriculum?.lessons.length ?? 0;
  const completedLessons = curriculum?.lessons.filter(l => learnedCoins.has(l.symbol)).length ?? 0;
  const progressPct      = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const monthEvents: CryptoEvent[] = EVENTS.filter(e => e.date.startsWith(monthKey));

  // Today's item
  const todayLessonSym = lessonByDay[todayDay];
  const todayConceptId = conceptByDay[todayDay];
  const todayIsQuiz    = quizDaySet.has(todayDay);
  const todayCoin      = todayLessonSym ? COINS.find(c => c.symbol === todayLessonSym) : null;
  const todayConcept   = todayConceptId ? CONCEPTS[todayConceptId] : null;

  // Progress stats
  const totalCoins   = COINS.length;
  const totalLearned = learnedCoins.size;
  const roadmapPct   = Math.round((totalLearned / totalCoins) * 100);
  const xpPct        = ((xp % 500) / 500) * 100;
  const level        = Math.floor(xp / 500) + 1;
  const levelNames   = ['', 'Novice', 'Apprentice', 'Analyst', 'Strategist', 'Whale'];
  const levelName    = levelNames[Math.min(level, levelNames.length - 1)];

  // Path data
  const yearPct    = Math.round((totalLearned / totalCoins) * 100);
  const ALL_MONTHS = Object.keys(CURRICULUM).sort();

  function prevMonth() {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayPress(day: number) {
    const sym = lessonByDay[day];
    if (sym) { router.push(`/coin/${sym}`); return; }
    if (quizDaySet.has(day)) { router.push('/quiz'); return; }
    const cId = conceptByDay[day];
    if (cId) { router.push(`/lesson/${cId}`); return; }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    scroll: { flex: 1 },
    content: { paddingBottom: 120 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 10 },
    headerLeft: { flex: 1 },
    headerGreeting: { fontSize: 13, color: colors.textDim, fontWeight: '600', marginBottom: 2 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    themeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, alignItems: 'center', justifyContent: 'center' },
    themeBtnText: { fontSize: 16 },
    levelPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${colors.cyan}12`, borderWidth: 1, borderColor: `${colors.cyan}28`, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 },
    levelDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.cyan },
    levelLabel: { fontSize: 11, fontWeight: '700', color: colors.cyan },

    // Month nav
    monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
    navBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, alignItems: 'center', justifyContent: 'center' },
    navBtnText: { fontSize: 19, color: colors.white, fontWeight: '300', lineHeight: 23 },
    navCenter: { alignItems: 'center' },
    navMonth: { fontSize: 19, fontWeight: '900', color: colors.white, letterSpacing: -0.4 },
    navYear: { fontSize: 11, color: colors.textDim, fontWeight: '600', marginTop: 1 },

    // Toggle
    toggleRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, backgroundColor: colors.bgCard, borderRadius: 12, padding: 3, borderWidth: 1, borderColor: colors.bgCardBorder },
    toggleBtn: { flex: 1, paddingVertical: 7, borderRadius: 9, alignItems: 'center' },
    toggleBtnOn: { backgroundColor: colors.cyan },
    toggleTxt: { fontSize: 12, fontWeight: '700', color: colors.textDim },
    toggleTxtOn: { color: isDark ? '#060e07' : '#ffffff' },

    // Stats strip
    statsStrip: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
    statChip: { flex: 1, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 12, padding: 12 },
    statVal: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, lineHeight: 26 },
    statLabel: { fontSize: 10, color: colors.textDim, fontWeight: '600', marginTop: 1, marginBottom: 6 },
    statBar: { height: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', borderRadius: 1, overflow: 'hidden' },
    statBarFill: { height: '100%', borderRadius: 1 },

    // Today card
    todayCard: { marginHorizontal: 20, marginBottom: 14, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    todayAccent: { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    todayInner: { padding: 16 },
    todayEyeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    todayEye: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
    todayBadge: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
    todayBadgeTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    todayBody: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    todayLogo: { width: 44, height: 44, borderRadius: 22 },
    todayEmoji: { fontSize: 36, width: 44, textAlign: 'center' },
    todaySymbol: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5, lineHeight: 28 },
    todayName: { fontSize: 13, fontWeight: '600', marginBottom: 3 },
    todayDesc: { fontSize: 12, lineHeight: 17 },
    todayCTA: { borderTopWidth: 1, paddingTop: 12 },
    todayCTATxt: { fontSize: 13, fontWeight: '700' },
    todayDone: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1 },
    todayDoneTxt: { fontSize: 13, fontWeight: '700' },

    // Month hero
    hero: { marginHorizontal: H_PAD, marginBottom: 12, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.bgCard, borderWidth: 1, padding: 16 },
    heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    heroLogo: { width: 48, height: 48, borderRadius: 24, borderWidth: 2 },
    heroInfo: { flex: 1 },
    heroEye: { fontSize: 9, color: colors.textDim, letterSpacing: 1.2, fontWeight: '700', textTransform: 'uppercase' as const, marginBottom: 3 },
    heroTagline: { fontSize: 17, fontWeight: '900', letterSpacing: -0.4, lineHeight: 20, marginBottom: 2 },
    heroSub: { fontSize: 9, color: colors.textDim, fontWeight: '600' },
    heroProgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    heroProgLbl: { fontSize: 9, color: colors.textDim },
    heroProgVal: { fontSize: 9, fontWeight: '800' },
    heroBar: { height: 3, backgroundColor: colors.bgCardBorder, borderRadius: 2, overflow: 'hidden', marginBottom: 12 },
    heroBarFill: { height: '100%' as any, borderRadius: 2 },
    heroDivider: { height: 1, backgroundColor: colors.bgCardBorder, marginBottom: 12 },
    cotwRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cotwLogo: { width: 38, height: 38, borderRadius: 19, borderWidth: 1 },
    cotwInfo: { flex: 1 },
    cotwEye: { fontSize: 8, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 2 },
    cotwName: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
    cotwSymbol: { fontSize: 12, fontWeight: '900' },

    // Calendar grid
    legendRow: { flexDirection: 'row', flexWrap: 'wrap' as any, gap: 8, paddingHorizontal: H_PAD + 4, marginBottom: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 7, height: 7, borderRadius: 4 },
    legendTxt: { fontSize: 9, fontWeight: '600', color: colors.textDim },
    dayHeaders: { flexDirection: 'row', paddingHorizontal: H_PAD, marginBottom: 4 },
    dayHeaderTxt: { width: CELL_W, textAlign: 'center', fontSize: 9, fontWeight: '700', color: colors.textDim, letterSpacing: 0.5 },
    grid: { paddingHorizontal: H_PAD },
    gridRow: { flexDirection: 'row' },
    cell: { width: CELL_W, height: CELL_H, padding: 2 },
    cellInner:   { flex: 1, borderRadius: 10, borderWidth: 1, overflow: 'hidden', padding: 6, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' },
    cellDayNum:  { fontSize: 12, fontWeight: '800', marginBottom: 4 },
    cellItems:   { gap: 4 },
    cellItem:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
    cellItemDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
    cellItemTxt: { fontSize: 10, fontWeight: '700', flexShrink: 1 },

    // Events
    eventsSection: { marginTop: 18, paddingHorizontal: H_PAD },
    eventsSectionEye: { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', textTransform: 'uppercase' as const, marginBottom: 4 },
    eventsSectionTtl: { fontSize: 17, fontWeight: '800', color: colors.white, letterSpacing: -0.3, marginBottom: 12 },
    eventCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 13, padding: 12, marginBottom: 8 },
    eventDotBar: { width: 3, borderRadius: 2, alignSelf: 'stretch', minHeight: 32, marginTop: 2 },
    eventCardBody: { flex: 1 },
    eventBadgeRow: { flexDirection: 'row', gap: 6, marginBottom: 5, alignItems: 'center' },
    eventTypeBadge: { borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
    eventTypeTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    eventDateTxt: { fontSize: 9, color: colors.textDim, fontWeight: '600' },
    eventTitle: { fontSize: 13, fontWeight: '700', color: colors.white, marginBottom: 2, letterSpacing: -0.2 },
    eventDesc: { fontSize: 11, color: colors.textMid, lineHeight: 17 },
    eventCoinBadge: { marginTop: 6, alignSelf: 'flex-start', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
    eventCoinTxt: { fontSize: 9, fontWeight: '700' },
    noEventsTxt: { fontSize: 12, color: colors.textDim, textAlign: 'center', paddingVertical: 16 },

    // Foundations
    foundationSection: { marginBottom: 20 },
    foundationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
    foundationEye: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
    foundationPct: { fontSize: 10, fontWeight: '700' },
    foundationScroll: { paddingLeft: 20 },
    foundationCard: { width: 130, borderRadius: 14, borderWidth: 1, padding: 12, marginRight: 10 },
    foundationEmoji: { fontSize: 22, marginBottom: 6 },
    foundationTitle: { fontSize: 11, fontWeight: '800', letterSpacing: -0.2, lineHeight: 15, marginBottom: 6 },
    foundationCat: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' as const },
    foundationCheck: { position: 'absolute' as any, top: 8, right: 8, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    foundationCheckTxt: { fontSize: 8, fontWeight: '900' },
    foundationBar: { marginHorizontal: 20, marginTop: 8, height: 2, borderRadius: 1, overflow: 'hidden', backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' },
    foundationBarFill: { height: '100%' as any, borderRadius: 1 },

    // Path view
    pathHeader: { marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.bgCard, borderRadius: 18, borderWidth: 1, borderColor: colors.bgCardBorder, padding: 16 },
    pathHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    pathEye: { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 4 },
    pathTitleLarge: { fontSize: 22, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },
    pathPct: { alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 26, backgroundColor: `${colors.cyan}12`, borderWidth: 1, borderColor: `${colors.cyan}30` },
    pathPctNum: { fontSize: 16, fontWeight: '900', color: colors.cyan, lineHeight: 18 },
    pathPctSub: { fontSize: 8, color: colors.textDim, fontWeight: '600' },
    pathBar: { height: 3, backgroundColor: colors.bgCardBorder, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
    pathBarFill: { height: '100%' as any, borderRadius: 2, backgroundColor: colors.cyan },
    pathStatRow: { flexDirection: 'row', gap: 10 },
    pathStat: { flex: 1, backgroundColor: `${colors.cyan}08`, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: `${colors.cyan}18` },
    pathStatNum: { fontSize: 16, fontWeight: '900', color: colors.cyan, letterSpacing: -0.5 },
    pathStatLbl: { fontSize: 9, color: colors.textDim, fontWeight: '600', marginTop: 2 },
    monthCard: { marginHorizontal: 16, marginBottom: 8 },
    monthHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bgCard, borderRadius: 14, borderWidth: 1, borderColor: colors.bgCardBorder, padding: 12 },
    monthHeaderActive: { borderColor: `${colors.cyan}35`, backgroundColor: `${colors.cyan}06` },
    monthLogo: { width: 40, height: 40, borderRadius: 20 },
    monthInfo: { flex: 1 },
    monthName: { fontSize: 14, fontWeight: '900', color: colors.white, letterSpacing: -0.2, marginBottom: 2 },
    monthTagline: { fontSize: 11, color: colors.textDim, fontWeight: '600', marginBottom: 5 },
    monthProgRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    monthProgBar: { flex: 1, height: 2, backgroundColor: colors.bgCardBorder, borderRadius: 2, overflow: 'hidden' },
    monthProgFill: { height: '100%' as any, borderRadius: 2 },
    monthProgTxt: { fontSize: 9, fontWeight: '700', color: colors.textDim, width: 26, textAlign: 'right' as any },
    monthChevron: { fontSize: 15, color: colors.textDim },
    monthStatus: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, overflow: 'hidden' },
    stepsContainer: { paddingLeft: 16, paddingRight: 16, paddingTop: 2, paddingBottom: 6 },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
    stepLine: { width: 18, alignItems: 'center' },
    stepLineBar: { width: 2, flex: 1, minHeight: 16 },
    stepDot: { width: 11, height: 11, borderRadius: 6, marginTop: 11, borderWidth: 2, zIndex: 1 },
    stepDotToday: { width: 13, height: 13, borderRadius: 7, marginTop: 10 },
    stepRight: { flex: 1, paddingLeft: 8, paddingTop: 5, paddingBottom: 8 },
    stepInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.bgCard, borderRadius: 11, borderWidth: 1, borderColor: colors.bgCardBorder, padding: 10 },
    stepInnerToday: { borderColor: `${colors.cyan}40`, backgroundColor: `${colors.cyan}07` },
    stepInnerDone: { borderColor: `${colors.green}25`, backgroundColor: `${colors.green}05` },
    stepIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    stepIconEmoji: { fontSize: 15 },
    stepMeta: { flex: 1 },
    stepDay: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
    stepTitle: { fontSize: 12, fontWeight: '800', color: colors.white, letterSpacing: -0.2, lineHeight: 16 },
    stepSub: { fontSize: 9, color: colors.textDim, marginTop: 2 },
    stepCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: `${colors.green}20`, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    stepCheckTxt: { fontSize: 9, color: colors.green, fontWeight: '900' },
    stepTodayBadge: { backgroundColor: colors.cyan, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1, alignSelf: 'flex-start', marginTop: 3 },
    stepTodayTxt: { fontSize: 8, fontWeight: '900', color: isDark ? '#060e07' : '#ffffff' },
    noSchedule: { fontSize: 12, color: colors.textDim, textAlign: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  });

  // ── Today card ───────────────────────────────────────────────────────────────
  const renderTodayCard = () => {
    if (!isCurrentMonth) return null;

    if (todayCoin) {
      const cc = categoryColors[todayCoin.category] ?? colors.cyan;
      const done = learnedCoins.has(todayCoin.symbol);
      return (
        <Pressable style={[s.todayCard, { borderColor: `${cc}30`, backgroundColor: `${cc}06` }]} onPress={() => router.push(`/coin/${todayCoin.symbol}`)}>
          <View style={[s.todayAccent, { backgroundColor: cc }]} />
          <View style={s.todayInner}>
            <View style={s.todayEyeRow}>
              <Text style={[s.todayEye, { color: cc }]}>📅 TODAY · {MONTH_NAMES[todayMonth - 1].toUpperCase()} {todayDay}</Text>
              <View style={[s.todayBadge, { backgroundColor: `${cc}12`, borderColor: `${cc}28` }]}><Text style={[s.todayBadgeTxt, { color: cc }]}>LESSON</Text></View>
            </View>
            <View style={s.todayBody}>
              <Image source={{ uri: todayCoin.logoUrl }} style={s.todayLogo} />
              <View style={{ flex: 1 }}>
                <Text style={[s.todaySymbol, { color: cc }]}>{todayCoin.symbol}</Text>
                <Text style={[s.todayName, { color: colors.white }]}>{todayCoin.name}</Text>
                <Text style={[s.todayDesc, { color: colors.textDim }]} numberOfLines={2}>{todayCoin.description}</Text>
              </View>
            </View>
            <View style={[s.todayCTA, { borderTopColor: `${cc}15` }]}>
              {done
                ? <View style={s.todayDone}><Text style={[s.todayDoneTxt, { color: colors.green }]}>✓ Completed</Text></View>
                : <Text style={[s.todayCTATxt, { color: cc }]}>Open lesson →</Text>}
            </View>
          </View>
        </Pressable>
      );
    }

    if (todayConcept) {
      const cc = CONCEPT_CAT_COLORS[todayConcept.category] ?? colors.cyan;
      const done = learnedConcepts.has(todayConcept.id);
      return (
        <Pressable style={[s.todayCard, { borderColor: `${cc}30`, backgroundColor: `${cc}06` }]} onPress={() => router.push(`/lesson/${todayConcept.id}`)}>
          <View style={[s.todayAccent, { backgroundColor: cc }]} />
          <View style={s.todayInner}>
            <View style={s.todayEyeRow}>
              <Text style={[s.todayEye, { color: cc }]}>📖 TODAY · {MONTH_NAMES[todayMonth - 1].toUpperCase()} {todayDay}</Text>
              <View style={[s.todayBadge, { backgroundColor: `${cc}12`, borderColor: `${cc}28` }]}><Text style={[s.todayBadgeTxt, { color: cc }]}>CONCEPT</Text></View>
            </View>
            <View style={s.todayBody}>
              <Text style={s.todayEmoji}>{todayConcept.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.todaySymbol, { color: cc, fontSize: 16, lineHeight: 20 }]}>{todayConcept.title}</Text>
                <Text style={[s.todayDesc, { color: colors.textDim, marginTop: 4 }]} numberOfLines={2}>{todayConcept.intro}</Text>
              </View>
            </View>
            <View style={[s.todayCTA, { borderTopColor: `${cc}15` }]}>
              {done
                ? <View style={s.todayDone}><Text style={[s.todayDoneTxt, { color: colors.green }]}>✓ Completed</Text></View>
                : <Text style={[s.todayCTATxt, { color: cc }]}>Read lesson →</Text>}
            </View>
          </View>
        </Pressable>
      );
    }

    if (todayIsQuiz) {
      const done = completedQuizDates.has(todayISO);
      return (
        <Pressable style={[s.todayCard, { borderColor: `${colors.cyan}30`, backgroundColor: `${colors.cyan}06` }]} onPress={() => router.push('/quiz')}>
          <View style={[s.todayAccent, { backgroundColor: colors.cyan }]} />
          <View style={s.todayInner}>
            <View style={s.todayEyeRow}>
              <Text style={[s.todayEye, { color: colors.cyan }]}>📝 TODAY · {MONTH_NAMES[todayMonth - 1].toUpperCase()} {todayDay}</Text>
              <View style={[s.todayBadge, { backgroundColor: `${colors.cyan}12`, borderColor: `${colors.cyan}28` }]}><Text style={[s.todayBadgeTxt, { color: colors.cyan }]}>QUIZ</Text></View>
            </View>
            <View style={s.todayBody}>
              <Text style={s.todayEmoji}>📝</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.todaySymbol, { color: colors.cyan, fontSize: 18, lineHeight: 22 }]}>Weekly Quiz</Text>
                <Text style={[s.todayDesc, { color: colors.textDim, marginTop: 4 }]}>Test what you've learned this week</Text>
              </View>
            </View>
            <View style={[s.todayCTA, { borderTopColor: `${colors.cyan}15` }]}>
              {done
                ? <View style={s.todayDone}><Text style={[s.todayDoneTxt, { color: colors.green }]}>✓ Completed</Text></View>
                : <Text style={[s.todayCTATxt, { color: colors.cyan }]}>Take quiz →</Text>}
            </View>
          </View>
        </Pressable>
      );
    }

    return null; // rest day — don't show a card
  };

  // ── Foundations strip ────────────────────────────────────────────────────────
  const foundationConcepts = FOUNDATION_IDS.map(id => CONCEPTS[id]).filter(Boolean);
  const foundationDone     = foundationConcepts.filter(c => learnedConcepts.has(c.id)).length;
  const foundationPct      = Math.round((foundationDone / foundationConcepts.length) * 100);
  const allFoundationDone  = foundationDone === foundationConcepts.length;

  const foundationsSection = (
    <View style={s.foundationSection}>
      <View style={s.foundationHeader}>
        <Text style={[s.foundationEye, { color: colors.cyan }]}>
          {allFoundationDone ? '✓  FOUNDATIONS COMPLETE' : '🎓  START HERE — BLOCKCHAIN BASICS'}
        </Text>
        <Text style={[s.foundationPct, { color: allFoundationDone ? colors.green : colors.textDim }]}>
          {foundationDone}/{foundationConcepts.length}
        </Text>
      </View>
      <View style={s.foundationBar}>
        <View style={[s.foundationBarFill, { width: `${foundationPct}%` as any, backgroundColor: allFoundationDone ? colors.green : colors.cyan }]} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.foundationScroll, { paddingTop: 10, paddingRight: 20, paddingBottom: 4 }]}>
        {foundationConcepts.map(c => {
          const cc   = CONCEPT_CAT_COLORS[c.category] ?? colors.cyan;
          const done = learnedConcepts.has(c.id);
          return (
            <Pressable
              key={c.id}
              style={[s.foundationCard, {
                backgroundColor: done ? `${colors.green}0a` : `${cc}08`,
                borderColor:     done ? `${colors.green}30` : `${cc}25`,
              }]}
              onPress={() => router.push(`/lesson/${c.id}`)}
            >
              {done && (
                <View style={[s.foundationCheck, { backgroundColor: `${colors.green}25` }]}>
                  <Text style={[s.foundationCheckTxt, { color: colors.green }]}>✓</Text>
                </View>
              )}
              <Text style={s.foundationEmoji}>{c.emoji}</Text>
              <Text style={[s.foundationTitle, { color: done ? colors.green : colors.white }]} numberOfLines={2}>{c.title}</Text>
              <Text style={[s.foundationCat, { color: done ? colors.green : cc }]}>{c.category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  // ── Calendar grid ────────────────────────────────────────────────────────────
  const calendarContent = (
    <>
      {foundationsSection}
      {renderTodayCard()}

      {/* Stats */}
      <View style={s.statsStrip}>
        <View style={[s.statChip, { borderColor: `${colors.cyan}28` }]}>
          <Text style={[s.statVal, { color: colors.cyan }]}>{xp.toLocaleString()}</Text>
          <Text style={s.statLabel}>XP</Text>
          <View style={s.statBar}><View style={[s.statBarFill, { width: `${xpPct}%` as any, backgroundColor: colors.cyan }]} /></View>
        </View>
        <View style={[s.statChip, { borderColor: `${colors.tan}28` }]}>
          <Text style={[s.statVal, { color: colors.tan }]}>{streak}</Text>
          <Text style={s.statLabel}>🔥 Streak</Text>
        </View>
        <View style={[s.statChip, { borderColor: `${colors.purple}28` }]}>
          <Text style={[s.statVal, { color: colors.purple }]}>{roadmapPct}%</Text>
          <Text style={s.statLabel}>Progress</Text>
          <View style={s.statBar}><View style={[s.statBarFill, { width: `${roadmapPct}%` as any, backgroundColor: colors.purple }]} /></View>
        </View>
      </View>

      {/* Month hero */}
      {curriculum && themeCoin ? (
        <View style={[s.hero, { borderColor: `${catColor}28` }]}>
          <View style={s.heroTopRow}>
            <Image source={{ uri: themeCoin.logoUrl }} style={[s.heroLogo, { borderColor: `${catColor}40` }]} />
            <View style={s.heroInfo}>
              <Text style={s.heroEye}>{MONTH_NAMES[viewMonth - 1]} {viewYear}</Text>
              <Text style={[s.heroTagline, { color: catColor }]}>{curriculum.tagline}</Text>
              <Text style={s.heroSub}>{totalLessons} coin lessons · {curriculum.quizDays.length} quiz · {curriculum.conceptDays.length} concepts</Text>
            </View>
          </View>
          <View style={s.heroProgRow}>
            <Text style={s.heroProgLbl}>{completedLessons}/{totalLessons} coins mastered</Text>
            <Text style={[s.heroProgVal, { color: catColor }]}>{Math.round(progressPct)}%</Text>
          </View>
          <View style={s.heroBar}><View style={[s.heroBarFill, { width: `${progressPct}%` as any, backgroundColor: catColor }]} /></View>
          {cotwCoin && (
            <>
              <View style={s.heroDivider} />
              <View style={s.cotwRow}>
                <Image source={{ uri: cotwCoin.logoUrl }} style={[s.cotwLogo, { borderColor: `${cotwColor}35` }]} />
                <View style={s.cotwInfo}>
                  <Text style={[s.cotwEye, { color: cotwColor }]}>Coin of the Week</Text>
                  <Text style={[s.cotwName, { color: colors.white }]}>{cotwCoin.name}</Text>
                </View>
                <View style={{ backgroundColor: `${cotwColor}15`, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 5 }}>
                  <Text style={[s.cotwSymbol, { color: cotwColor }]}>{cotwSym}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={[s.hero, { borderColor: colors.bgCardBorder }]}>
          <Text style={{ color: colors.textDim, fontSize: 12, textAlign: 'center', paddingVertical: 12 }}>No curriculum scheduled for this month</Text>
        </View>
      )}

      {/* Legend */}
      <View style={s.legendRow}>
        {[
          { color: colors.cyan, label: 'Lesson' },
          { color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.25)', label: 'Concept' },
          { color: `${colors.cyan}80`, label: 'Quiz' },
          { color: colors.green, label: 'Done ✓' },
          { color: colors.tan, label: 'Event' },
        ].map(({ color, label }) => (
          <View key={label} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: color }]} />
            <Text style={s.legendTxt}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Day headers */}
      <View style={s.dayHeaders}>
        {DAY_LABELS.map(d => <Text key={d} style={s.dayHeaderTxt}>{d}</Text>)}
      </View>

      {/* Grid */}
      <View style={s.grid}>
        {Array.from({ length: rows }, (_, rowIdx) => (
          <View key={rowIdx} style={s.gridRow}>
            {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
              if (day === null) return <View key={colIdx} style={s.cell} />;

              const dateKey     = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents   = EVENTS_BY_DATE[dateKey] ?? [];
              const lessonSym   = lessonByDay[day];
              const isQuiz      = quizDaySet.has(day);
              const cId         = conceptByDay[day];
              const concept     = cId ? CONCEPTS[cId] : null;
              const isToday     = isCurrentMonth && day === todayDay;
              const isPast      = viewYear < todayYear || (viewYear === todayYear && viewMonth < todayMonth) || (isCurrentMonth && day < todayDay);
              const dayOfWeek   = (firstDayOfWeek + day - 1) % 7;
              const isSunday    = dayOfWeek === 0;

              // Completion state
              const coinDone    = lessonSym ? learnedCoins.has(lessonSym) : false;
              const conceptDone = cId ? learnedConcepts.has(cId) : false;
              const quizDone    = isQuiz ? completedQuizDates.has(dateKey) : false;
              const isDone      = coinDone || conceptDone || quizDone;

              const lessonCoin  = lessonSym ? COINS.find(c => c.symbol === lessonSym) : undefined;
              const lessonColor = lessonCoin ? (categoryColors[lessonCoin.category] ?? colors.cyan) : colors.cyan;
              const conceptColor = concept ? (CONCEPT_CAT_COLORS[concept.category] ?? colors.textDim) : colors.textDim;

              let cellBg     = 'transparent';
              let cellBorder = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

              if (isDone)         { cellBg = `${colors.green}10`; cellBorder = `${colors.green}30`; }
              else if (isToday)   { cellBg = `${colors.cyan}18`; cellBorder = colors.cyan; }
              else if (lessonSym) { cellBg = `${lessonColor}12`; cellBorder = `${lessonColor}28`; }
              else if (isQuiz)    { cellBg = `${colors.cyan}08`; cellBorder = `${colors.cyan}18`; }
              else if (concept)   { cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.025)'; cellBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'; }

              const dayNumColor = isDone ? colors.green : isToday ? colors.cyan : lessonSym ? lessonColor : isPast ? colors.textDim : colors.textMid;

              return (
                <Pressable key={colIdx} style={s.cell} onPress={() => handleDayPress(day)}>
                  <View style={[s.cellInner, { backgroundColor: cellBg, borderColor: cellBorder }]}>
                    <Text style={[s.cellDayNum, { color: dayNumColor }]}>{day}</Text>
                    <View style={s.cellItems}>
                      {lessonSym && (
                        <View style={s.cellItem}>
                          <View style={[s.cellItemDot, { backgroundColor: isDone ? colors.green : lessonColor, opacity: isPast && !isDone ? 0.4 : 1 }]} />
                          <Text style={[s.cellItemTxt, { color: isDone ? colors.green : lessonColor, opacity: isPast && !isDone ? 0.5 : 1 }]} numberOfLines={1}>
                            {lessonSym}{isDone ? ' ✓' : ''}
                          </Text>
                        </View>
                      )}
                      {isQuiz && (
                        <View style={s.cellItem}>
                          <View style={[s.cellItemDot, { backgroundColor: isDone ? colors.green : colors.cyan }]} />
                          <Text style={[s.cellItemTxt, { color: isDone ? colors.green : colors.cyan }]} numberOfLines={1}>Quiz{isDone ? ' ✓' : ''}</Text>
                        </View>
                      )}
                      {concept && !lessonSym && !isQuiz && (
                        <View style={s.cellItem}>
                          <View style={[s.cellItemDot, { backgroundColor: conceptColor, opacity: isPast && !isDone ? 0.35 : 1 }]} />
                          <Text style={[s.cellItemTxt, { color: conceptColor, opacity: isPast && !isDone ? 0.5 : 1 }]} numberOfLines={1}>{concept.emoji} {concept.title}</Text>
                        </View>
                      )}
                      {dayEvents.map((e, i) => {
                        const ec = EVENT_TYPE_COLORS[e.type] ?? colors.tan;
                        return (
                          <View key={i} style={s.cellItem}>
                            <View style={[s.cellItemDot, { backgroundColor: ec }]} />
                            <Text style={[s.cellItemTxt, { color: ec }]} numberOfLines={1}>{e.title}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Events */}
      <View style={s.eventsSection}>
        <Text style={s.eventsSectionEye}>This Month</Text>
        <Text style={s.eventsSectionTtl}>Events</Text>
        {monthEvents.length === 0 ? (
          <Text style={s.noEventsTxt}>No events this month</Text>
        ) : monthEvents.map(event => {
          const typeColor = EVENT_TYPE_COLORS[event.type] ?? colors.tan;
          const eventCoin = event.coinSymbol ? COINS.find(c => c.symbol === event.coinSymbol) : undefined;
          const coinColor = eventCoin ? (categoryColors[eventCoin.category] ?? colors.cyan) : colors.cyan;
          const eventDay  = parseInt(event.date.slice(8), 10);
          return (
            <View key={event.id} style={s.eventCard}>
              <View style={[s.eventDotBar, { backgroundColor: typeColor }]} />
              <View style={s.eventCardBody}>
                <View style={s.eventBadgeRow}>
                  <View style={[s.eventTypeBadge, { backgroundColor: `${typeColor}15`, borderColor: `${typeColor}35` }]}><Text style={[s.eventTypeTxt, { color: typeColor }]}>{EVENT_TYPE_LABELS[event.type] ?? event.type}</Text></View>
                  <Text style={s.eventDateTxt}>{MONTH_NAMES[viewMonth - 1]} {eventDay}</Text>
                </View>
                <Text style={s.eventTitle}>{event.title}</Text>
                <Text style={s.eventDesc}>{event.description}</Text>
                {event.coinSymbol && <View style={[s.eventCoinBadge, { backgroundColor: `${coinColor}12`, borderColor: `${coinColor}28` }]}><Text style={[s.eventCoinTxt, { color: coinColor }]}>{event.coinSymbol}</Text></View>}
              </View>
            </View>
          );
        })}
      </View>
    </>
  );

  // ── Path content ─────────────────────────────────────────────────────────────
  const pathContent = (
    <>
      <View style={s.pathHeader}>
        <View style={s.pathHeaderTop}>
          <View>
            <Text style={s.pathEye}>YOUR LEARNING JOURNEY</Text>
            <Text style={s.pathTitleLarge}>2026 Path</Text>
          </View>
          <View style={s.pathPct}><Text style={s.pathPctNum}>{yearPct}%</Text><Text style={s.pathPctSub}>done</Text></View>
        </View>
        <View style={s.pathBar}><View style={[s.pathBarFill, { width: `${yearPct}%` as any }]} /></View>
        <View style={s.pathStatRow}>
          <View style={s.pathStat}><Text style={s.pathStatNum}>{totalLearned}</Text><Text style={s.pathStatLbl}>Coins Learned</Text></View>
          <View style={s.pathStat}><Text style={s.pathStatNum}>{totalCoins}</Text><Text style={s.pathStatLbl}>Total Coins</Text></View>
          <View style={s.pathStat}><Text style={s.pathStatNum}>{ALL_MONTHS.length}</Text><Text style={s.pathStatLbl}>Chapters</Text></View>
        </View>
      </View>

      {ALL_MONTHS.map(mk => {
        const [y, m]     = mk.split('-').map(Number);
        const cur        = CURRICULUM[mk];
        const tCoin      = COINS.find(c => c.symbol === cur.themeSymbol);
        const color      = tCoin ? (categoryColors[tCoin.category] ?? colors.cyan) : colors.cyan;
        const isNow      = y === todayYear && m === todayMonth;
        const isPast     = y < todayYear || (y === todayYear && m < todayMonth);
        const isOpen     = expanded.has(mk);
        const mLearned   = cur.lessons.filter(l => learnedCoins.has(l.symbol)).length;
        const mTotal     = cur.lessons.length;
        const mPct       = mTotal > 0 ? Math.round((mLearned / mTotal) * 100) : 0;
        const steps      = getMonthSteps(mk);
        const statusLabel = isPast ? (mLearned === mTotal && mTotal > 0 ? 'Complete' : 'Missed') : isNow ? 'In Progress' : 'Upcoming';
        const statusBg    = isPast ? (mLearned === mTotal && mTotal > 0 ? `${colors.green}18` : `${colors.tan}18`) : isNow ? `${colors.cyan}18` : colors.bgCardBorder;
        const statusColor = isPast ? (mLearned === mTotal && mTotal > 0 ? colors.green : colors.tan) : isNow ? colors.cyan : colors.textDim;

        return (
          <View key={mk} style={s.monthCard}>
            <Pressable style={[s.monthHeader, isNow && s.monthHeaderActive]} onPress={() => toggleExpand(mk)}>
              {tCoin ? <Image source={{ uri: tCoin.logoUrl }} style={[s.monthLogo, { opacity: isPast && !isNow ? 0.55 : 1 }]} /> : <View style={[s.monthLogo, { backgroundColor: `${color}20` }]} />}
              <View style={s.monthInfo}>
                <Text style={[s.monthName, { opacity: isPast && !isNow ? 0.6 : 1 }]}>{MONTH_NAMES[m - 1]} · {cur.tagline}</Text>
                <Text style={s.monthTagline}>{mLearned}/{mTotal} coins · {steps.length} steps</Text>
                <View style={s.monthProgRow}>
                  <View style={s.monthProgBar}><View style={[s.monthProgFill, { width: `${mPct}%` as any, backgroundColor: isNow ? colors.cyan : color, opacity: isPast ? 0.5 : 1 }]} /></View>
                  <Text style={[s.monthProgTxt, { color: isNow ? colors.cyan : colors.textDim }]}>{mPct}%</Text>
                </View>
              </View>
              <View style={[s.monthStatus, { backgroundColor: statusBg }]}><Text style={{ fontSize: 8, fontWeight: '800', letterSpacing: 0.5, color: statusColor }}>{statusLabel}</Text></View>
              <Text style={[s.monthChevron, { transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }]}>›</Text>
            </Pressable>

            {isOpen && (
              <View style={s.stepsContainer}>
                {steps.length === 0 ? <Text style={s.noSchedule}>No lessons scheduled yet</Text> : steps.map((step, idx) => {
                  const isLast   = idx === steps.length - 1;
                  const isToday  = step.dateKey === todayISO;
                  const isBefore = step.dateKey < todayISO;
                  const coinDone    = step.type === 'lesson' && learnedCoins.has(step.symbol!);
                  const conceptDone = step.type === 'concept' && learnedConcepts.has(step.conceptId!);
                  const quizD       = step.type === 'quiz' && completedQuizDates.has(step.dateKey);
                  const isDone      = coinDone || conceptDone || quizD;

                  let iconBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
                  let titleTxt = '', subTxt = '', dotColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                  let iconNode: React.ReactNode = null;

                  if (step.type === 'concept' && step.conceptId) {
                    const c = CONCEPTS[step.conceptId];
                    titleTxt = c?.title ?? step.conceptId; subTxt = c?.category ?? '';
                    dotColor = isDone ? colors.green : isBefore ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)') : colors.cyan;
                    iconNode = <Text style={s.stepIconEmoji}>{c?.emoji ?? '💡'}</Text>;
                  } else if (step.type === 'lesson' && step.symbol) {
                    const coin = COINS.find(c => c.symbol === step.symbol);
                    const cc   = coin ? (categoryColors[coin.category] ?? colors.cyan) : colors.cyan;
                    titleTxt = step.symbol + (coin ? ` · ${coin.name}` : ''); subTxt = coin?.category ?? '';
                    iconBg = `${cc}20`; dotColor = isDone ? colors.green : isBefore ? colors.tan : cc;
                    iconNode = coin ? <Image source={{ uri: coin.logoUrl }} style={{ width: 26, height: 26, borderRadius: 13 }} /> : <Text style={s.stepIconEmoji}>🪙</Text>;
                  } else if (step.type === 'quiz') {
                    titleTxt = 'Weekly Quiz'; subTxt = 'Test your knowledge';
                    iconBg = `${colors.cyan}18`; dotColor = isDone ? colors.green : colors.cyan;
                    iconNode = <Text style={s.stepIconEmoji}>📝</Text>;
                  }

                  const dow = new Date(step.dateKey).getDay();
                  const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                  const dayLabel = `${MONTH_NAMES[m - 1].slice(0,3)} ${step.day} · ${DOW[dow]}`;
                  const handlePress = () => {
                    if (step.type === 'lesson') router.push(`/coin/${step.symbol}`);
                    else if (step.type === 'quiz') router.push('/quiz');
                    else if (step.type === 'concept') router.push(`/lesson/${step.conceptId}`);
                  };

                  return (
                    <View key={step.dateKey} style={s.stepRow}>
                      <View style={[s.stepLine, { paddingTop: 11 }]}>
                        <View style={[s.stepDot, { backgroundColor: isToday ? colors.cyan : isDone ? colors.green : 'transparent', borderColor: dotColor }, isToday && s.stepDotToday]} />
                        {!isLast && <View style={[s.stepLineBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }]} />}
                      </View>
                      <View style={s.stepRight}>
                        <Pressable style={[s.stepInner, isToday && s.stepInnerToday, isDone && s.stepInnerDone, isBefore && !isDone && { opacity: 0.55 }]} onPress={handlePress}>
                          <View style={[s.stepIcon, { backgroundColor: iconBg }]}>{iconNode}</View>
                          <View style={s.stepMeta}>
                            <Text style={[s.stepDay, { color: isToday ? colors.cyan : colors.textDim }]}>{dayLabel}</Text>
                            <Text style={s.stepTitle} numberOfLines={2}>{titleTxt}</Text>
                            <Text style={s.stepSub}>{subTxt}</Text>
                            {isToday && <View style={s.stepTodayBadge}><Text style={s.stepTodayTxt}>TODAY</Text></View>}
                          </View>
                          {isDone && <View style={s.stepCheck}><Text style={s.stepCheckTxt}>✓</Text></View>}
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </>
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.headerGreeting}>{greeting}</Text>
          <Text style={s.headerTitle}>{view === 'path' ? 'Learning Path' : `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`}</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable style={s.themeBtn} onPress={toggle}><Text style={s.themeBtnText}>{isDark ? '☀️' : '🌙'}</Text></Pressable>
          <View style={s.levelPill}><View style={s.levelDot} /><Text style={s.levelLabel}>{levelName}</Text></View>
        </View>
      </View>

      {/* Month nav (calendar only) */}
      {view === 'calendar' && (
        <View style={s.monthNav}>
          <Pressable style={s.navBtn} onPress={prevMonth}><Text style={s.navBtnText}>‹</Text></Pressable>
          <View style={s.navCenter}>
            <Text style={s.navMonth}>{MONTH_NAMES[viewMonth - 1]}</Text>
            <Text style={s.navYear}>{viewYear}</Text>
          </View>
          <Pressable style={s.navBtn} onPress={nextMonth}><Text style={s.navBtnText}>›</Text></Pressable>
        </View>
      )}

      {/* Calendar | Path toggle */}
      <View style={s.toggleRow}>
        <Pressable style={[s.toggleBtn, view === 'calendar' && s.toggleBtnOn]} onPress={() => setView('calendar')}>
          <Text style={[s.toggleTxt, view === 'calendar' && s.toggleTxtOn]}>📅  Calendar</Text>
        </Pressable>
        <Pressable style={[s.toggleBtn, view === 'path' && s.toggleBtnOn]} onPress={() => setView('path')}>
          <Text style={[s.toggleTxt, view === 'path' && s.toggleTxtOn]}>🗺  Path</Text>
        </Pressable>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {view === 'calendar' ? calendarContent : pathContent}
      </ScrollView>
    </View>
  );
}
