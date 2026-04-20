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

const H_PAD = 8;

const EVENT_TYPE_LABELS: Record<string, string> = {
  conference: 'Conference', upgrade: 'Upgrade',
  milestone: 'Milestone',  ama: 'AMA', halving: 'Halving',
};

// ── Path-view helper ──────────────────────────────────────────────────────────
type StepType = 'concept' | 'lesson' | 'quiz';
interface Step {
  day: number;
  type: StepType;
  conceptId?: string;
  symbol?: string;
  dateKey: string;
}

function getMonthSteps(monthKey: string): Step[] {
  const curriculum = CURRICULUM[monthKey];
  if (!curriculum) return [];
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const lessonByDay: Record<number, string> = {};
  const conceptByDayMap: Record<number, string> = {};
  const quizDaySet = new Set<number>();
  curriculum.lessons.forEach(l => { lessonByDay[l.day] = l.symbol; });
  curriculum.conceptDays.forEach(c => { conceptByDayMap[c.day] = c.conceptId; });
  curriculum.quizDays.forEach(d => quizDaySet.add(d));
  const steps: Step[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = (firstDayOfWeek + day - 1) % 7;
    if (dow === 0) continue; // skip Sundays
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (lessonByDay[day])       steps.push({ day, type: 'lesson',  symbol: lessonByDay[day],       dateKey });
    else if (quizDaySet.has(day)) steps.push({ day, type: 'quiz',                                   dateKey });
    else if (conceptByDayMap[day]) steps.push({ day, type: 'concept', conceptId: conceptByDayMap[day], dateKey });
  }
  return steps;
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CalendarScreen() {
  const router  = useRouter();
  const { colors, categoryColors, isDark } = useTheme();
  const { learnedCoins } = useProgressStore();
  const { width: screenW } = useWindowDimensions();
  const CELL_W = Math.floor((screenW - H_PAD * 2) / 7);
  const CELL_H = Math.floor(CELL_W * 1.2);

  const now        = new Date();
  const todayISO   = now.toISOString().slice(0, 10);
  const todayDay   = now.getDate();
  const todayMonth = now.getMonth() + 1;
  const todayYear  = now.getFullYear();

  const [view,      setView]      = useState<'cal' | 'path'>('cal');
  const [viewMonth, setViewMonth] = useState(todayMonth);
  const [viewYear,  setViewYear]  = useState(todayYear);

  // Path-view: which months are expanded
  const currentMonthKey = `${todayYear}-${String(todayMonth).padStart(2, '0')}`;
  const [expanded, setExpanded] = useState<Set<string>>(new Set([currentMonthKey]));
  const toggleExpand = (mk: string) => setExpanded(prev => {
    const next = new Set(prev);
    next.has(mk) ? next.delete(mk) : next.add(mk);
    return next;
  });

  // Calendar-view state
  const monthKey   = `${viewYear}-${String(viewMonth).padStart(2, '0')}`;
  const curriculum = CURRICULUM[monthKey];
  const themeSymbol = curriculum?.themeSymbol;
  const themeCoin   = COINS.find(c => c.symbol === themeSymbol);
  const catColor    = themeCoin ? (categoryColors[themeCoin.category] ?? colors.cyan) : colors.cyan;

  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth    = new Date(viewYear, viewMonth, 0).getDate();
  const cells: (number | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = cells.length / 7;

  const lessonByDay: Record<number, string> = {};
  const conceptByDay: Record<number, string> = {};
  const quizDaySet = new Set<number>();
  curriculum?.lessons.forEach(l => { lessonByDay[l.day] = l.symbol; });
  curriculum?.conceptDays?.forEach(c => { conceptByDay[c.day] = c.conceptId; });
  curriculum?.quizDays.forEach(d => quizDaySet.add(d));

  const weekCoinMap: Record<number, string> = {};
  curriculum?.lessons.forEach(l => {
    const wIdx = Math.floor((firstDayOfWeek + l.day - 1) / 7);
    if (!weekCoinMap[wIdx]) weekCoinMap[wIdx] = l.symbol;
  });

  const isCurrentMonth  = viewMonth === todayMonth && viewYear === todayYear;
  const todayWeekIdx    = Math.floor((firstDayOfWeek + todayDay - 1) / 7);
  const cotw            = isCurrentMonth ? (weekCoinMap[todayWeekIdx] ?? null) : null;
  const cotwCoin        = cotw ? COINS.find(c => c.symbol === cotw) : null;
  const cotwColor       = cotwCoin ? (categoryColors[cotwCoin.category] ?? colors.cyan) : colors.cyan;

  const totalLessons     = curriculum?.lessons.length ?? 0;
  const completedLessons = curriculum?.lessons.filter(l => learnedCoins.has(l.symbol)).length ?? 0;
  const progressPct      = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const monthEvents: CryptoEvent[] = EVENTS.filter(e => e.date.startsWith(monthKey));

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
    const wIdx = Math.floor((firstDayOfWeek + day - 1) / 7);
    const intro = weekCoinMap[wIdx];
    if (intro) router.push(`/coin/${intro}`);
  }

  // Overall stats (for path view header)
  const totalCoins   = COINS.length;
  const totalLearned = learnedCoins.size;
  const yearPct      = Math.round((totalLearned / totalCoins) * 100);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: colors.bg },
    scroll:     { flex: 1 },
    content:    { paddingBottom: 120 },

    // Nav bar
    navBar:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingBottom: 12 },
    navBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, alignItems: 'center', justifyContent: 'center' },
    navBtnText: { fontSize: 20, color: colors.white, fontWeight: '300', lineHeight: 24 },
    navCenter:  { alignItems: 'center' },
    navMonth:   { fontSize: 20, fontWeight: '900', color: colors.white, letterSpacing: -0.4 },
    navYear:    { fontSize: 11, color: colors.textDim, fontWeight: '600', marginTop: 1 },
    navTitle:   { fontSize: 22, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },

    // Toggle
    toggleRow:      { flexDirection: 'row', marginHorizontal: 20, marginBottom: 14, backgroundColor: colors.bgCard, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.bgCardBorder },
    toggleBtn:      { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
    toggleBtnOn:    { backgroundColor: colors.cyan },
    toggleTxt:      { fontSize: 13, fontWeight: '700', color: colors.textDim },
    toggleTxtOn:    { color: isDark ? '#060e07' : '#ffffff' },

    // ── Calendar view ──
    hero:          { marginHorizontal: H_PAD, marginBottom: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.bgCard, borderWidth: 1, padding: 18 },
    heroTopRow:    { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
    heroLogo:      { width: 56, height: 56, borderRadius: 28, borderWidth: 2 },
    heroInfo:      { flex: 1 },
    heroEye:       { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', textTransform: 'uppercase' as const, marginBottom: 4 },
    heroTagline:   { fontSize: 19, fontWeight: '900', letterSpacing: -0.5, lineHeight: 22, marginBottom: 3 },
    heroSub:       { fontSize: 10, color: colors.textDim, fontWeight: '600' },
    heroProgRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    heroProgLbl:   { fontSize: 10, color: colors.textDim },
    heroProgVal:   { fontSize: 10, fontWeight: '800' },
    heroBar:       { height: 3, backgroundColor: colors.bgCardBorder, borderRadius: 2, overflow: 'hidden', marginBottom: 14 },
    heroBarFill:   { height: '100%' as any, borderRadius: 2 },
    heroDivider:   { height: 1, backgroundColor: colors.bgCardBorder, marginBottom: 14 },
    cotwRow:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
    cotwLogo:      { width: 44, height: 44, borderRadius: 22, borderWidth: 1 },
    cotwInfo:      { flex: 1 },
    cotwEye:       { fontSize: 8, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' as const, marginBottom: 3 },
    cotwName:      { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
    cotwDesc:      { fontSize: 10, color: colors.textDim, marginTop: 1 },
    cotwSymbol:    { fontSize: 13, fontWeight: '900', letterSpacing: -0.3 },

    legendRow:     { flexDirection: 'row', flexWrap: 'wrap' as any, gap: 10, paddingHorizontal: H_PAD + 4, marginBottom: 10 },
    legendItem:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot:     { width: 8, height: 8, borderRadius: 4 },
    legendTxt:     { fontSize: 9, fontWeight: '600', color: colors.textDim },

    dayHeaders:    { flexDirection: 'row', paddingHorizontal: H_PAD, marginBottom: 5 },
    dayHeaderTxt:  { width: CELL_W, textAlign: 'center', fontSize: 10, fontWeight: '700', color: colors.textDim, letterSpacing: 0.5 },

    grid:          { paddingHorizontal: H_PAD },
    gridRow:       { flexDirection: 'row' },
    cell:          { width: CELL_W, height: CELL_H, padding: 2 },
    cellInner:     { flex: 1, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' as any, overflow: 'hidden' },
    cellDayNum:    { position: 'absolute' as any, top: 4, left: 5, fontSize: 10, fontWeight: '600' },
    cellSymbol:    { fontSize: 10, fontWeight: '800', letterSpacing: -0.2, marginTop: 5 },
    cellEmoji:     { fontSize: 14, marginTop: 4 },
    cellQuiz:      { fontSize: 8, fontWeight: '800', letterSpacing: 0.3, textTransform: 'uppercase' as const },
    cellRest:      { fontSize: 10, color: colors.textDim, opacity: 0.4 },
    cellDots:      { position: 'absolute' as any, bottom: 3, flexDirection: 'row', gap: 2 },
    cellDot:       { width: 4, height: 4, borderRadius: 2 },
    cellCheck:     { position: 'absolute' as any, top: 3, right: 3, width: 12, height: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    cellCheckTxt:  { fontSize: 6, fontWeight: '900' },

    eventsSection:    { marginTop: 20, paddingHorizontal: H_PAD },
    eventsSectionEye: { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', textTransform: 'uppercase' as const, marginBottom: 4 },
    eventsSectionTtl: { fontSize: 18, fontWeight: '800', color: colors.white, letterSpacing: -0.3, marginBottom: 14 },
    eventCard:        { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, padding: 14, marginBottom: 10 },
    eventDotBar:      { width: 3, borderRadius: 2, alignSelf: 'stretch', minHeight: 36, marginTop: 2 },
    eventCardBody:    { flex: 1 },
    eventBadgeRow:    { flexDirection: 'row', gap: 6, marginBottom: 6, alignItems: 'center' },
    eventTypeBadge:   { borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1 },
    eventTypeTxt:     { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    eventDateTxt:     { fontSize: 10, color: colors.textDim, fontWeight: '600' },
    eventTitle:       { fontSize: 14, fontWeight: '700', color: colors.white, marginBottom: 3, letterSpacing: -0.2 },
    eventDesc:        { fontSize: 12, color: colors.textMid, lineHeight: 18 },
    eventCoinBadge:   { marginTop: 7, alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1 },
    eventCoinTxt:     { fontSize: 10, fontWeight: '700' },
    noEventsTxt:      { fontSize: 13, color: colors.textDim, textAlign: 'center', paddingVertical: 20 },

    // ── Path view ──
    pathHeader: {
      marginHorizontal: 16, marginBottom: 20,
      backgroundColor: colors.bgCard, borderRadius: 20,
      borderWidth: 1, borderColor: colors.bgCardBorder, padding: 18,
    },
    pathHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
    pathEye:       { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 4 },
    pathTitle:     { fontSize: 24, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },
    pathPct:       { alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: 29, backgroundColor: `${colors.cyan}12`, borderWidth: 1, borderColor: `${colors.cyan}30` },
    pathPctNum:    { fontSize: 18, fontWeight: '900', color: colors.cyan, lineHeight: 20 },
    pathPctSub:    { fontSize: 9, color: colors.textDim, fontWeight: '600' },
    pathBar:       { height: 4, backgroundColor: colors.bgCardBorder, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
    pathBarFill:   { height: '100%' as any, borderRadius: 2, backgroundColor: colors.cyan },
    pathStatRow:   { flexDirection: 'row', gap: 12 },
    pathStat:      { flex: 1, backgroundColor: `${colors.cyan}08`, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: `${colors.cyan}18` },
    pathStatNum:   { fontSize: 18, fontWeight: '900', color: colors.cyan, letterSpacing: -0.5 },
    pathStatLbl:   { fontSize: 10, color: colors.textDim, fontWeight: '600', marginTop: 2 },

    // Month card
    monthCard: { marginHorizontal: 16, marginBottom: 10 },
    monthHeader: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: colors.bgCard, borderRadius: 16, borderWidth: 1,
      borderColor: colors.bgCardBorder, padding: 14,
    },
    monthHeaderActive: { borderColor: `${colors.cyan}35`, backgroundColor: `${colors.cyan}06` },
    monthLogo:    { width: 44, height: 44, borderRadius: 22 },
    monthInfo:    { flex: 1 },
    monthName:    { fontSize: 16, fontWeight: '900', color: colors.white, letterSpacing: -0.3, marginBottom: 2 },
    monthTagline: { fontSize: 12, color: colors.textDim, fontWeight: '600', marginBottom: 6 },
    monthProgRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    monthProgBar: { flex: 1, height: 3, backgroundColor: colors.bgCardBorder, borderRadius: 2, overflow: 'hidden' },
    monthProgFill:{ height: '100%' as any, borderRadius: 2 },
    monthProgTxt: { fontSize: 9, fontWeight: '700', color: colors.textDim, width: 28, textAlign: 'right' as any },
    monthChevron: { fontSize: 16, color: colors.textDim, fontWeight: '300' },
    monthStatus:  { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100, overflow: 'hidden' },

    // Step rows
    stepsContainer: { paddingLeft: 16, paddingRight: 16, paddingTop: 2, paddingBottom: 8 },
    stepRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 0, marginBottom: 0 },
    stepLine:      { width: 20, alignItems: 'center' },
    stepLineBar:   { width: 2, flex: 1, minHeight: 20 },
    stepDot:       { width: 12, height: 12, borderRadius: 6, marginTop: 12, borderWidth: 2, zIndex: 1 },
    stepDotToday:  { width: 14, height: 14, borderRadius: 7, marginTop: 11 },
    stepRight:     { flex: 1, paddingLeft: 10, paddingTop: 6, paddingBottom: 10 },
    stepInner:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.bgCardBorder, padding: 12 },
    stepInnerToday:{ borderColor: `${colors.cyan}40`, backgroundColor: `${colors.cyan}07` },
    stepInnerDone: { borderColor: `${colors.green}25`, backgroundColor: `${colors.green}05` },
    stepIcon:      { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    stepIconEmoji: { fontSize: 17 },
    stepMeta:      { flex: 1 },
    stepDay:       { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
    stepTitle:     { fontSize: 13, fontWeight: '800', color: colors.white, letterSpacing: -0.2, lineHeight: 18 },
    stepSub:       { fontSize: 10, color: colors.textDim, marginTop: 2 },
    stepCheck:     { width: 22, height: 22, borderRadius: 11, backgroundColor: `${colors.green}20`, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    stepCheckTxt:  { fontSize: 10, color: colors.green, fontWeight: '900' },
    stepTodayBadge:{ backgroundColor: colors.cyan, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
    stepTodayTxt:  { fontSize: 9, fontWeight: '900', color: isDark ? '#060e07' : '#ffffff' },
    noSchedule:    { fontSize: 13, color: colors.textDim, textAlign: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  });

  // ── Calendar grid render ────────────────────────────────────────────────────
  const calendarContent = (
    <>
      {curriculum && themeCoin ? (
        <View style={[s.hero, { borderColor: `${catColor}28` }]}>
          <View style={s.heroTopRow}>
            <Image source={{ uri: themeCoin.logoUrl }} style={[s.heroLogo, { borderColor: `${catColor}40` }]} />
            <View style={s.heroInfo}>
              <Text style={s.heroEye}>{MONTH_NAMES[viewMonth - 1]} {viewYear} · {curriculum.tagline}</Text>
              <Text style={[s.heroTagline, { color: catColor }]}>{curriculum.tagline}</Text>
              <Text style={s.heroSub}>{totalLessons} coin lessons · {curriculum.quizDays.length} quiz</Text>
            </View>
          </View>
          <View style={s.heroProgRow}>
            <Text style={s.heroProgLbl}>{completedLessons} of {totalLessons} coins mastered</Text>
            <Text style={[s.heroProgVal, { color: catColor }]}>{Math.round(progressPct)}%</Text>
          </View>
          <View style={s.heroBar}>
            <View style={[s.heroBarFill, { width: `${progressPct}%` as any, backgroundColor: catColor }]} />
          </View>
          {cotwCoin && (
            <>
              <View style={s.heroDivider} />
              <View style={s.cotwRow}>
                <Image source={{ uri: cotwCoin.logoUrl }} style={[s.cotwLogo, { borderColor: `${cotwColor}35` }]} />
                <View style={s.cotwInfo}>
                  <Text style={[s.cotwEye, { color: cotwColor }]}>Coin of the Week</Text>
                  <Text style={[s.cotwName, { color: colors.white }]}>{cotwCoin.name}</Text>
                  <Text style={s.cotwDesc} numberOfLines={1}>{cotwCoin.description}</Text>
                </View>
                <View style={{ backgroundColor: `${cotwColor}15`, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={[s.cotwSymbol, { color: cotwColor }]}>{cotw}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={[s.hero, { borderColor: colors.bgCardBorder }]}>
          <Text style={{ color: colors.textDim, fontSize: 13, textAlign: 'center', paddingVertical: 16 }}>No curriculum scheduled for this month yet</Text>
        </View>
      )}

      <View style={s.legendRow}>
        {[
          { color: colors.cyan, label: 'Main Lesson' },
          { color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)', label: 'Concept' },
          { color: `${colors.cyan}80`, label: 'Quiz' },
          { color: colors.tan, label: 'Event' },
        ].map(({ color, label }) => (
          <View key={label} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: color }]} />
            <Text style={s.legendTxt}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={s.dayHeaders}>
        {DAY_LABELS.map(d => <Text key={d} style={s.dayHeaderTxt}>{d}</Text>)}
      </View>

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
              const isPast      = viewYear < todayYear || (viewYear === todayYear && viewMonth < todayMonth)
                || (isCurrentMonth && day < todayDay);
              const isCompleted = lessonSym ? learnedCoins.has(lessonSym) : false;
              const dayOfWeek   = (firstDayOfWeek + day - 1) % 7;
              const isSunday    = dayOfWeek === 0;

              const lessonCoin  = lessonSym ? COINS.find(c => c.symbol === lessonSym) : undefined;
              const lessonColor = lessonCoin ? (categoryColors[lessonCoin.category] ?? colors.cyan) : colors.cyan;

              let cellBg = 'transparent';
              let cellBorder = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

              if (isToday)        { cellBg = `${colors.cyan}18`; cellBorder = colors.cyan; }
              else if (lessonSym) { cellBg = `${lessonColor}14`; cellBorder = `${lessonColor}30`; }
              else if (isQuiz)    { cellBg = `${colors.cyan}08`; cellBorder = `${colors.cyan}20`; }
              else if (concept)   { cellBg = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)'; cellBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'; }

              const dayNumColor = isToday ? colors.cyan : lessonSym ? lessonColor : isPast ? colors.textDim : colors.textMid;

              return (
                <Pressable key={colIdx} style={s.cell} onPress={() => handleDayPress(day)}>
                  <View style={[s.cellInner, { backgroundColor: cellBg, borderColor: cellBorder }]}>
                    <Text style={[s.cellDayNum, { color: dayNumColor, fontWeight: isToday ? '900' : '600' }]}>{day}</Text>

                    {lessonSym && (
                      <Text style={[s.cellSymbol, { color: isCompleted ? colors.green : lessonColor, opacity: isPast && !isCompleted ? 0.5 : 1 }]}>
                        {lessonSym}
                      </Text>
                    )}

                    {concept && !lessonSym && !isQuiz && (
                      <Text style={[s.cellEmoji, { opacity: isPast ? 0.22 : 0.50 }]}>{concept.emoji}</Text>
                    )}

                    {isQuiz && <Text style={[s.cellQuiz, { color: colors.cyan }]}>Quiz</Text>}
                    {isSunday && !isToday && <Text style={s.cellRest}>·</Text>}

                    {isCompleted && (
                      <View style={[s.cellCheck, { backgroundColor: `${colors.green}22` }]}>
                        <Text style={[s.cellCheckTxt, { color: colors.green }]}>✓</Text>
                      </View>
                    )}
                    {dayEvents.length > 0 && (
                      <View style={s.cellDots}>
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <View key={i} style={[s.cellDot, { backgroundColor: EVENT_TYPE_COLORS[e.type] ?? colors.tan }]} />
                        ))}
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={s.eventsSection}>
        <Text style={s.eventsSectionEye}>This Month</Text>
        <Text style={s.eventsSectionTtl}>Events</Text>
        {monthEvents.length === 0 ? (
          <Text style={s.noEventsTxt}>No events scheduled this month</Text>
        ) : (
          monthEvents.map(event => {
            const typeColor = EVENT_TYPE_COLORS[event.type] ?? colors.tan;
            const eventCoin = event.coinSymbol ? COINS.find(c => c.symbol === event.coinSymbol) : undefined;
            const coinColor = eventCoin ? (categoryColors[eventCoin.category] ?? colors.cyan) : colors.cyan;
            const eventDay  = parseInt(event.date.slice(8), 10);
            return (
              <View key={event.id} style={s.eventCard}>
                <View style={[s.eventDotBar, { backgroundColor: typeColor }]} />
                <View style={s.eventCardBody}>
                  <View style={s.eventBadgeRow}>
                    <View style={[s.eventTypeBadge, { backgroundColor: `${typeColor}15`, borderColor: `${typeColor}35` }]}>
                      <Text style={[s.eventTypeTxt, { color: typeColor }]}>{EVENT_TYPE_LABELS[event.type] ?? event.type}</Text>
                    </View>
                    <Text style={s.eventDateTxt}>{MONTH_NAMES[viewMonth - 1]} {eventDay}</Text>
                  </View>
                  <Text style={s.eventTitle}>{event.title}</Text>
                  <Text style={s.eventDesc}>{event.description}</Text>
                  {event.coinSymbol && (
                    <View style={[s.eventCoinBadge, { backgroundColor: `${coinColor}12`, borderColor: `${coinColor}28` }]}>
                      <Text style={[s.eventCoinTxt, { color: coinColor }]}>{event.coinSymbol}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>
    </>
  );

  // ── Path view render ────────────────────────────────────────────────────────
  const ALL_MONTHS = Object.keys(CURRICULUM).sort();

  const pathContent = (
    <>
      {/* Stats header */}
      <View style={s.pathHeader}>
        <View style={s.pathHeaderTop}>
          <View>
            <Text style={s.pathEye}>YOUR LEARNING JOURNEY</Text>
            <Text style={s.pathTitle}>2026 Path</Text>
          </View>
          <View style={s.pathPct}>
            <Text style={s.pathPctNum}>{yearPct}%</Text>
            <Text style={s.pathPctSub}>done</Text>
          </View>
        </View>
        <View style={s.pathBar}>
          <View style={[s.pathBarFill, { width: `${yearPct}%` as any }]} />
        </View>
        <View style={s.pathStatRow}>
          <View style={s.pathStat}>
            <Text style={s.pathStatNum}>{totalLearned}</Text>
            <Text style={s.pathStatLbl}>Coins Learned</Text>
          </View>
          <View style={s.pathStat}>
            <Text style={s.pathStatNum}>{totalCoins}</Text>
            <Text style={s.pathStatLbl}>Total Coins</Text>
          </View>
          <View style={s.pathStat}>
            <Text style={s.pathStatNum}>{ALL_MONTHS.length}</Text>
            <Text style={s.pathStatLbl}>Chapters</Text>
          </View>
        </View>
      </View>

      {/* Month chapters */}
      {ALL_MONTHS.map(mk => {
        const [y, m] = mk.split('-').map(Number);
        const cur = CURRICULUM[mk];
        const themeCoinPath = COINS.find(c => c.symbol === cur.themeSymbol);
        const color = themeCoinPath ? (categoryColors[themeCoinPath.category] ?? colors.cyan) : colors.cyan;
        const isNow  = y === todayYear && m === todayMonth;
        const isPast = y < todayYear || (y === todayYear && m < todayMonth);
        const isOpen = expanded.has(mk);
        const mLearned = cur.lessons.filter(l => learnedCoins.has(l.symbol)).length;
        const mTotal   = cur.lessons.length;
        const mPct     = mTotal > 0 ? Math.round((mLearned / mTotal) * 100) : 0;
        const steps    = getMonthSteps(mk);
        const daysInMo = new Date(y, m, 0).getDate();

        const statusLabel = isPast ? (mLearned === mTotal && mTotal > 0 ? 'Complete' : 'Missed') : isNow ? 'In Progress' : 'Upcoming';
        const statusBg    = isPast ? (mLearned === mTotal && mTotal > 0 ? `${colors.green}18` : `${colors.tan}18`) : isNow ? `${colors.cyan}18` : `${colors.bgCardBorder}`;
        const statusColor = isPast ? (mLearned === mTotal && mTotal > 0 ? colors.green : colors.tan) : isNow ? colors.cyan : colors.textDim;

        return (
          <View key={mk} style={s.monthCard}>
            <Pressable
              style={[s.monthHeader, isNow && s.monthHeaderActive]}
              onPress={() => toggleExpand(mk)}
            >
              {themeCoinPath
                ? <Image source={{ uri: themeCoinPath.logoUrl }} style={[s.monthLogo, { opacity: isPast && !isNow ? 0.55 : 1 }]} />
                : <View style={[s.monthLogo, { backgroundColor: `${color}20` }]} />
              }
              <View style={s.monthInfo}>
                <Text style={[s.monthName, { opacity: isPast && !isNow ? 0.6 : 1 }]}>
                  {MONTH_NAMES[m - 1]} · {cur.tagline}
                </Text>
                <Text style={s.monthTagline}>{mLearned}/{mTotal} coins · {steps.length} lessons</Text>
                <View style={s.monthProgRow}>
                  <View style={s.monthProgBar}>
                    <View style={[s.monthProgFill, { width: `${mPct}%` as any, backgroundColor: isNow ? colors.cyan : color, opacity: isPast ? 0.5 : 1 }]} />
                  </View>
                  <Text style={[s.monthProgTxt, { color: isNow ? colors.cyan : colors.textDim }]}>{mPct}%</Text>
                </View>
              </View>
              <View>
                <View style={[s.monthStatus, { backgroundColor: statusBg }]}>
                  <Text style={[{ fontSize: 9, fontWeight: '800', letterSpacing: 0.5, color: statusColor }]}>{statusLabel}</Text>
                </View>
              </View>
              <Text style={[s.monthChevron, { transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }]}>›</Text>
            </Pressable>

            {isOpen && (
              <View style={s.stepsContainer}>
                {steps.length === 0 ? (
                  <Text style={s.noSchedule}>No lessons scheduled yet</Text>
                ) : (
                  steps.map((step, idx) => {
                    const isLast    = idx === steps.length - 1;
                    const isToday   = step.dateKey === todayISO;
                    const isBefore  = step.dateKey < todayISO;
                    const isDone    = step.type === 'lesson' && learnedCoins.has(step.symbol!);

                    // Icon
                    let iconBg    = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
                    let iconEmoji = '💡';
                    let titleTxt  = '';
                    let subTxt    = '';
                    let dotColor  = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                    let iconNode: React.ReactNode = null;

                    if (step.type === 'concept' && step.conceptId) {
                      const c   = CONCEPTS[step.conceptId];
                      iconEmoji = c?.emoji ?? '💡';
                      titleTxt  = c?.title ?? step.conceptId;
                      subTxt    = c?.category ?? 'Foundations';
                      iconBg    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
                      dotColor  = isBefore ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)') : colors.cyan;
                      iconNode  = <Text style={s.stepIconEmoji}>{iconEmoji}</Text>;
                    } else if (step.type === 'lesson' && step.symbol) {
                      const coin  = COINS.find(c => c.symbol === step.symbol);
                      const cc    = coin ? (categoryColors[coin.category] ?? colors.cyan) : colors.cyan;
                      titleTxt    = step.symbol + (coin ? ` · ${coin.name}` : '');
                      subTxt      = coin?.category ?? 'Lesson';
                      iconBg      = `${cc}20`;
                      dotColor    = isDone ? colors.green : isBefore ? colors.tan : cc;
                      iconNode    = coin
                        ? <Image source={{ uri: coin.logoUrl }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                        : <Text style={s.stepIconEmoji}>🪙</Text>;
                    } else if (step.type === 'quiz') {
                      iconEmoji = '📝';
                      titleTxt  = 'Weekly Quiz';
                      subTxt    = 'Test your knowledge';
                      iconBg    = `${colors.cyan}18`;
                      dotColor  = colors.cyan;
                      iconNode  = <Text style={s.stepIconEmoji}>{iconEmoji}</Text>;
                    }

                    const dow   = new Date(step.dateKey).getDay();
                    const DOW_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                    const dayLabel  = `${MONTH_NAMES[m - 1].slice(0, 3)} ${step.day} · ${DOW_NAMES[dow]}`;

                    const handlePress = () => {
                      if (step.type === 'lesson')  router.push(`/coin/${step.symbol}`);
                      else if (step.type === 'quiz') router.push('/quiz');
                      else if (step.type === 'concept') router.push(`/lesson/${step.conceptId}`);
                    };

                    return (
                      <View key={step.dateKey} style={s.stepRow}>
                        {/* Vertical timeline line + dot */}
                        <View style={[s.stepLine, { paddingTop: 12 }]}>
                          <View style={[
                            s.stepDot,
                            { backgroundColor: isToday ? colors.cyan : isDone ? colors.green : 'transparent', borderColor: dotColor },
                            isToday && s.stepDotToday,
                          ]} />
                          {!isLast && (
                            <View style={[s.stepLineBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }]} />
                          )}
                        </View>

                        {/* Step card */}
                        <View style={s.stepRight}>
                          <Pressable
                            style={[
                              s.stepInner,
                              isToday && s.stepInnerToday,
                              isDone && s.stepInnerDone,
                              isBefore && !isDone && { opacity: 0.55 },
                            ]}
                            onPress={handlePress}
                          >
                            <View style={[s.stepIcon, { backgroundColor: iconBg }]}>
                              {iconNode}
                            </View>
                            <View style={s.stepMeta}>
                              <Text style={[s.stepDay, { color: isToday ? colors.cyan : colors.textDim }]}>{dayLabel}</Text>
                              <Text style={s.stepTitle} numberOfLines={2}>{titleTxt}</Text>
                              <Text style={s.stepSub}>{subTxt}</Text>
                              {isToday && (
                                <View style={s.stepTodayBadge}>
                                  <Text style={s.stepTodayTxt}>TODAY</Text>
                                </View>
                              )}
                            </View>
                            {isDone && (
                              <View style={s.stepCheck}>
                                <Text style={s.stepCheckTxt}>✓</Text>
                              </View>
                            )}
                          </Pressable>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>
        );
      })}
    </>
  );

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <View style={s.container}>
      {/* Nav bar */}
      <View style={s.navBar}>
        {view === 'cal' ? (
          <>
            <Pressable style={s.navBtn} onPress={prevMonth}><Text style={s.navBtnText}>‹</Text></Pressable>
            <View style={s.navCenter}>
              <Text style={s.navMonth}>{MONTH_NAMES[viewMonth - 1]}</Text>
              <Text style={s.navYear}>{viewYear}</Text>
            </View>
            <Pressable style={s.navBtn} onPress={nextMonth}><Text style={s.navBtnText}>›</Text></Pressable>
          </>
        ) : (
          <>
            <View style={{ width: 38 }} />
            <Text style={s.navTitle}>Learning Path</Text>
            <View style={{ width: 38 }} />
          </>
        )}
      </View>

      {/* Toggle */}
      <View style={s.toggleRow}>
        <Pressable style={[s.toggleBtn, view === 'cal' && s.toggleBtnOn]} onPress={() => setView('cal')}>
          <Text style={[s.toggleTxt, view === 'cal' && s.toggleTxtOn]}>📅  Calendar</Text>
        </Pressable>
        <Pressable style={[s.toggleBtn, view === 'path' && s.toggleBtnOn]} onPress={() => setView('path')}>
          <Text style={[s.toggleTxt, view === 'path' && s.toggleTxtOn]}>🗺️  Path</Text>
        </Pressable>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {view === 'cal' ? calendarContent : pathContent}
      </ScrollView>
    </View>
  );
}
