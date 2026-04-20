import { ScrollView, View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { COINS } from '../../constants/coins';
import { useProgressStore } from '../../store/useProgressStore';
import { fetchPrices, priceForSymbol, formatPrice, formatChange, type PriceMap } from '../../services/prices';

export default function CoinDetail() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const router = useRouter();
  const { colors, categoryColors } = useTheme();
  const { learnedCoins, markLearned } = useProgressStore();

  const coin = COINS.find(c => c.symbol === symbol);
  const [prices, setPrices] = useState<PriceMap>({});

  useEffect(() => {
    fetchPrices().then(setPrices).catch(() => {});
  }, []);

  if (!coin) return null;

  const isLearned = learnedCoins.has(coin.symbol);
  const catColor = categoryColors[coin.category];
  const priceInfo = priceForSymbol(prices, coin.symbol);

  const card = { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 16 };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, overflow: 'hidden', position: 'relative' },
    headerGlow: { position: 'absolute' as any, top: -50, width: 220, height: 220, borderRadius: 110 },
    backBtn: { position: 'absolute' as any, left: 16, top: Platform.OS === 'ios' ? 56 : 40, padding: 8, zIndex: 10 },
    backText: { fontSize: 22, color: colors.white, fontWeight: '300' },
    learnBtn: { position: 'absolute' as any, right: 16, top: Platform.OS === 'ios' ? 56 : 40, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, zIndex: 10 },
    learnBtnText: { fontSize: 11, fontWeight: '700' },
    headerCenter: { alignItems: 'center', paddingTop: 8 },
    headerLogo: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, marginBottom: 12 },
    headerSymbol: { fontSize: 34, fontWeight: '900', letterSpacing: -0.5, lineHeight: 36 },
    headerName: { fontSize: 15, color: colors.textMid, fontWeight: '500', marginBottom: 12, marginTop: 2 },
    headerTags: { flexDirection: 'row', gap: 8 },
    tag: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder },
    tagDot: { width: 5, height: 5, borderRadius: 3 },
    tagText: { fontSize: 11, fontWeight: '600', color: colors.textMid },
    body: { flex: 1 },
    bodyContent: { padding: 20, paddingBottom: 60 },
    descCard: { ...card, marginBottom: 14, padding: 18, overflow: 'hidden' },
    descAccent: { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    descLabel: { fontSize: 9, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 10, paddingLeft: 12, textTransform: 'uppercase' as const },
    descText: { fontSize: 14, color: colors.textMid, lineHeight: 22, paddingLeft: 12 },
    aiBtn: { ...card, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, marginBottom: 20 },
    aiIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    aiIcon: { fontSize: 20 },
    aiBtnTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
    aiBtnSub: { fontSize: 12, color: colors.textDim },
    aiBtnArrow: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    infoItem: { ...card, width: '47.5%', padding: 16 },
    infoLabel: { fontSize: 9, color: colors.textDim, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: '700' },
    infoValue: { fontSize: 14, fontWeight: '700' },
  });

  return (
    <View style={s.container}>
      <View style={[s.header, { borderBottomColor: `${catColor}18` }]}>
        <View style={[s.headerGlow, { backgroundColor: `${catColor}10` }]} />
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <Pressable
          style={[s.learnBtn, isLearned
            ? { backgroundColor: `${colors.green}12`, borderColor: `${colors.green}30` }
            : { backgroundColor: `${catColor}14`, borderColor: `${catColor}35` }
          ]}
          onPress={() => !isLearned && markLearned(coin.symbol)}
        >
          <Text style={[s.learnBtnText, { color: isLearned ? colors.green : catColor }]}>
            {isLearned ? '✓ Learned' : 'Mark Learned'}
          </Text>
        </Pressable>
        <View style={s.headerCenter}>
          <Image source={{ uri: coin.logoUrl }} style={[s.headerLogo, { borderColor: `${catColor}30` }]} />
          <Text style={[s.headerSymbol, { color: catColor }]}>{coin.symbol}</Text>
          <Text style={s.headerName}>{coin.name}</Text>
          <View style={s.headerTags}>
            <View style={[s.tag, { backgroundColor: `${catColor}12`, borderColor: `${catColor}25` }]}>
              <View style={[s.tagDot, { backgroundColor: catColor }]} />
              <Text style={[s.tagText, { color: catColor }]}>{coin.category}</Text>
            </View>
            <View style={s.tag}><Text style={s.tagText}>{coin.stage}</Text></View>
          </View>
        </View>
      </View>
      <ScrollView style={s.body} contentContainerStyle={s.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={[s.descCard, { borderColor: `${catColor}18` }]}>
          <View style={[s.descAccent, { backgroundColor: catColor }]} />
          <Text style={s.descLabel}>WHAT IS {coin.symbol}?</Text>
          <Text style={s.descText}>{coin.description}</Text>
        </View>
        <Pressable style={[s.aiBtn, { borderColor: `${catColor}22` }]} onPress={() => router.push(`/coin/deep-dive?symbol=${coin.symbol}`)}>
          <View style={[s.aiIconBox, { backgroundColor: `${catColor}14` }]}>
            <Text style={s.aiIcon}>✨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.aiBtnTitle, { color: catColor }]}>AI Deep Dive</Text>
            <Text style={s.aiBtnSub}>Claude explains {coin.symbol} in depth</Text>
          </View>
          <View style={[s.aiBtnArrow, { backgroundColor: `${catColor}12` }]}>
            <Text style={{ color: catColor, fontSize: 16, fontWeight: '700' }}>→</Text>
          </View>
        </Pressable>
        <View style={s.infoGrid}>
          {[
            { label: 'Price', value: priceInfo ? formatPrice(priceInfo.usd) : '—', color: colors.white },
            { label: '24h Change', value: priceInfo ? formatChange(priceInfo.usd_24h_change) : '—', color: priceInfo ? (priceInfo.usd_24h_change >= 0 ? colors.green : colors.red) : colors.textDim },
            { label: 'Category', value: coin.category, color: catColor },
            { label: 'Stage', value: coin.stage, color: colors.textMid },
            { label: 'Symbol', value: coin.symbol, color: catColor },
            { label: 'Status', value: isLearned ? 'Learned ✓' : 'Not learned', color: isLearned ? colors.green : colors.textDim },
          ].map(item => (
            <View key={item.label} style={s.infoItem}>
              <Text style={s.infoLabel}>{item.label}</Text>
              <Text style={[s.infoValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
