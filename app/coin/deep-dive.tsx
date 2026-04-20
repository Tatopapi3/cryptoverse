import { ScrollView, View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { COINS } from '../../constants/coins';
import { getDeepDive } from '../../services/claude';

export default function DeepDiveScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
  const { colors, categoryColors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const coin = COINS.find(c => c.symbol === symbol);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const catColor = coin ? categoryColors[coin.category] : colors.cyan;

  useEffect(() => {
    if (!coin) return;
    getDeepDive(coin.symbol, coin.name, coin.category, coin.description,
      (chunk) => { setLoading(false); setText(prev => prev + chunk); scrollRef.current?.scrollToEnd({ animated: true }); },
      () => setDone(true),
      (err) => { setLoading(false); setError(err); },
    );
  }, []);

  if (!coin) return null;

  const glass = { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 20 };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: Platform.OS === 'ios' ? 60 : 44, borderBottomWidth: 1, overflow: 'hidden' },
    headerGlow: { position: 'absolute' as any, top: -60, right: -60, width: 180, height: 180, borderRadius: 90 },
    backBtn: { padding: 8, marginRight: 8 },
    backText: { fontSize: 22, color: colors.white, fontWeight: '300' },
    headerCenter: { flex: 1 },
    eyebrowRow: { marginBottom: 4 },
    aiBadge: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
    aiBadgeText: { fontSize: 9, fontWeight: '800', color: colors.textMid, letterSpacing: 1.2 },
    headerTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
    body: { flex: 1 },
    bodyContent: { padding: 20, paddingBottom: 60 },
    introCard: { ...glass, marginBottom: 16, padding: 20, overflow: 'hidden' },
    introAccent: { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    introLabel: { fontSize: 10, color: colors.textDim, letterSpacing: 1, fontWeight: '700', marginBottom: 4, paddingLeft: 12, textTransform: 'uppercase' as const },
    introSymbol: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, paddingLeft: 12 },
    introDesc: { fontSize: 13, color: colors.textMid, paddingLeft: 12, marginTop: 4 },
    responseCard: { ...glass, padding: 20, minHeight: 200 },
    responseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    claudeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    claudeBadgeText: { fontSize: 12, fontWeight: '700' },
    loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    loadingText: { fontSize: 12, fontWeight: '600' },
    doneText: { fontSize: 12, color: colors.green, fontWeight: '700' },
    responseText: { fontSize: 14, color: colors.textMid, lineHeight: 24 },
    skeletonWrap: { gap: 10, marginTop: 8 },
    skeletonLine: { height: 12, backgroundColor: colors.bgCardBorder, borderRadius: 6 },
    errorTitle: { fontSize: 16, fontWeight: '700', color: colors.red },
    errorText: { fontSize: 13, color: colors.textMid, lineHeight: 20 },
    errorHint: { fontSize: 12, color: colors.textDim, fontStyle: 'italic' },
    backCoinBtn: { marginTop: 20, borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
    backCoinText: { fontSize: 14, fontWeight: '700' },
  });

  return (
    <View style={s.container}>
      <View style={[s.header, { borderBottomColor: `${catColor}20` }]}>
        <View style={[s.headerGlow, { backgroundColor: `${catColor}10` }]} />
        <Pressable onPress={() => router.dismiss()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={s.headerCenter}>
          <View style={s.eyebrowRow}>
            <View style={[s.aiBadge, { backgroundColor: `${catColor}18`, borderColor: `${catColor}35` }]}>
              <Text style={s.aiBadgeText}>✨ AI DEEP DIVE</Text>
            </View>
          </View>
          <Text style={[s.headerTitle, { color: catColor }]}>{coin.name}</Text>
        </View>
      </View>
      <ScrollView ref={scrollRef} style={s.body} contentContainerStyle={s.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={[s.introCard, { borderColor: `${catColor}20` }]}>
          <View style={[s.introAccent, { backgroundColor: catColor }]} />
          <Text style={s.introLabel}>Analyzing</Text>
          <Text style={[s.introSymbol, { color: catColor }]}>{coin.symbol}</Text>
          <Text style={s.introDesc}>{coin.description}</Text>
        </View>
        <View style={s.responseCard}>
          <View style={s.responseHeader}>
            <View style={[s.claudeBadge, { backgroundColor: `${catColor}15` }]}>
              <Text style={[s.claudeBadgeText, { color: catColor }]}>Claude</Text>
            </View>
            {loading && <View style={s.loadingRow}><ActivityIndicator size="small" color={catColor} /><Text style={[s.loadingText, { color: catColor }]}>Generating deep dive...</Text></View>}
            {done && <Text style={s.doneText}>✓ Complete</Text>}
          </View>
          {error ? (
            <View style={{ gap: 8 }}>
              <Text style={s.errorTitle}>⚠ Error</Text>
              <Text style={s.errorText}>{error}</Text>
              <Text style={s.errorHint}>Make sure your API key is set in the .env file.</Text>
            </View>
          ) : (
            <Text style={s.responseText}>
              {text}
              {!done && !error && text.length > 0 && <Text style={{ color: catColor }}>▋</Text>}
            </Text>
          )}
          {loading && text.length === 0 && !error && (
            <View style={s.skeletonWrap}>
              {[100, 80, 90, 60, 85].map((w, i) => (
                <View key={i} style={[s.skeletonLine, { width: `${w}%` as any, opacity: 0.15 - i * 0.02 }]} />
              ))}
            </View>
          )}
        </View>
        {done && (
          <Pressable style={[s.backCoinBtn, { borderColor: `${catColor}30`, backgroundColor: `${catColor}10` }]} onPress={() => router.dismiss()}>
            <Text style={[s.backCoinText, { color: catColor }]}>← Back to {coin.symbol}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
