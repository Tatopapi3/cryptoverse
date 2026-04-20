import {
  View, Text, StyleSheet, ScrollView, Pressable, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/useProgressStore';
import { CONCEPTS } from '../../constants/blockchain-concepts';
import { COINS } from '../../constants/coins';

const CATEGORY_COLORS: Record<string, string> = {
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

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { colors, categoryColors, isDark } = useTheme();
  const { learnedConcepts, markConceptLearned } = useProgressStore();

  const concept  = id ? CONCEPTS[id] : undefined;
  const catColor = concept ? (CATEGORY_COLORS[concept.category] ?? colors.cyan) : colors.cyan;
  const relatedCoin = concept?.coinSymbol ? COINS.find(c => c.symbol === concept.coinSymbol) : undefined;
  const coinColor   = relatedCoin ? (categoryColors[relatedCoin.category] ?? colors.cyan) : colors.cyan;
  const isDone      = concept ? learnedConcepts.has(concept.id) : false;

  const s = StyleSheet.create({
    container:   { flex: 1, backgroundColor: colors.bg },
    scroll:      { flex: 1 },
    content:     { paddingBottom: 40 },
    header: { paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingHorizontal: 20, paddingBottom: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 24 },
    backArrow: { fontSize: 20, color: colors.textDim, fontWeight: '300' },
    backTxt:   { fontSize: 14, color: colors.textDim, fontWeight: '600' },
    catBadge: { alignSelf: 'flex-start', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 14, borderWidth: 1 },
    catTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
    emoji:   { fontSize: 42, marginBottom: 12 },
    title:   { fontSize: 30, fontWeight: '900', letterSpacing: -0.8, lineHeight: 35, marginBottom: 10 },
    intro:   { fontSize: 16, lineHeight: 24, fontWeight: '500', marginBottom: 28 },
    body:      { paddingHorizontal: 20 },
    paragraph: { fontSize: 15, lineHeight: 24, marginBottom: 18 },
    keyCard: { marginHorizontal: 20, marginTop: 8, marginBottom: 24, borderRadius: 16, borderWidth: 1, padding: 18 },
    keyTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.3, marginBottom: 14 },
    keyItem:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
    keyBullet:{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
    keyBulletTxt: { fontSize: 9, fontWeight: '900' },
    keyText:  { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '500' },
    coinSection: { marginHorizontal: 20, marginBottom: 24 },
    coinEye:     { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginBottom: 8 },
    coinCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, borderWidth: 1, padding: 16 },
    coinEmoji:   { fontSize: 28 },
    coinInfo:    { flex: 1 },
    coinSymbol:  { fontSize: 18, fontWeight: '900', letterSpacing: -0.4, marginBottom: 2 },
    coinName:    { fontSize: 13, fontWeight: '600', marginBottom: 2 },
    coinDesc:    { fontSize: 12, lineHeight: 17 },
    coinBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
    coinBtnTxt:  { fontSize: 12, fontWeight: '800' },

    // Mark complete section
    completeSection: { marginHorizontal: 20, marginBottom: 32 },
    completeBtn: { borderRadius: 14, padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
    completeBtnTxt: { fontSize: 15, fontWeight: '800' },
    doneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1 },
    doneTxt: { fontSize: 15, fontWeight: '700' },

    notFound:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    notFoundTxt: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  });

  if (!concept) {
    return (
      <View style={[s.container, s.notFound]}>
        <Text style={[s.notFoundTxt, { color: colors.textDim }]}>Lesson not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.cyan, fontWeight: '700' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <Pressable style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>‹</Text>
            <Text style={s.backTxt}>Back</Text>
          </Pressable>
          <View style={[s.catBadge, { backgroundColor: `${catColor}18`, borderColor: `${catColor}40` }]}>
            <Text style={[s.catTxt, { color: catColor }]}>{concept.category.toUpperCase()}</Text>
          </View>
          <Text style={s.emoji}>{concept.emoji}</Text>
          <Text style={[s.title, { color: colors.white }]}>{concept.title}</Text>
          <Text style={[s.intro, { color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)' }]}>
            {concept.intro}
          </Text>
        </View>

        <View style={{ height: 1, backgroundColor: colors.bgCardBorder, marginHorizontal: 20, marginBottom: 24 }} />

        <View style={s.body}>
          {concept.body.map((para, i) => (
            <Text key={i} style={[s.paragraph, { color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.70)' }]}>
              {para}
            </Text>
          ))}
        </View>

        <View style={[s.keyCard, { backgroundColor: `${catColor}08`, borderColor: `${catColor}22` }]}>
          <Text style={[s.keyTitle, { color: catColor }]}>KEY TAKEAWAYS</Text>
          {concept.keyPoints.map((pt, i) => (
            <View key={i} style={[s.keyItem, i === concept.keyPoints.length - 1 && { marginBottom: 0 }]}>
              <View style={[s.keyBullet, { backgroundColor: `${catColor}25` }]}>
                <Text style={[s.keyBulletTxt, { color: catColor }]}>{i + 1}</Text>
              </View>
              <Text style={[s.keyText, { color: isDark ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.80)' }]}>{pt}</Text>
            </View>
          ))}
        </View>

        {relatedCoin && (
          <View style={s.coinSection}>
            <Text style={[s.coinEye, { color: colors.textDim }]}>FEATURED IN THIS LESSON</Text>
            <View style={[s.coinCard, { backgroundColor: `${coinColor}08`, borderColor: `${coinColor}22` }]}>
              <Text style={s.coinEmoji}>🪙</Text>
              <View style={s.coinInfo}>
                <Text style={[s.coinSymbol, { color: coinColor }]}>{relatedCoin.symbol}</Text>
                <Text style={[s.coinName, { color: colors.white }]}>{relatedCoin.name}</Text>
                <Text style={[s.coinDesc, { color: colors.textDim }]} numberOfLines={2}>{relatedCoin.description}</Text>
              </View>
              <Pressable style={[s.coinBtn, { backgroundColor: `${coinColor}20` }]} onPress={() => router.push(`/coin/${relatedCoin.symbol}`)}>
                <Text style={[s.coinBtnTxt, { color: coinColor }]}>Explore →</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Mark complete */}
        <View style={s.completeSection}>
          {isDone ? (
            <View style={[s.doneRow, { borderColor: `${colors.green}30`, backgroundColor: `${colors.green}08` }]}>
              <Text style={{ fontSize: 18 }}>✓</Text>
              <Text style={[s.doneTxt, { color: colors.green }]}>Lesson complete · +20 XP earned</Text>
            </View>
          ) : (
            <Pressable
              style={[s.completeBtn, { backgroundColor: catColor }]}
              onPress={() => { markConceptLearned(concept.id); }}
            >
              <Text style={[s.completeBtnTxt, { color: isDark ? '#060e07' : '#ffffff' }]}>Mark as Complete</Text>
            </Pressable>
          )}
        </View>

      </ScrollView>
    </View>
  );
}
