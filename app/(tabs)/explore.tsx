import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Platform, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/useProgressStore';
import { COINS } from '../../constants/coins';

const ALL_CATEGORIES = ['All', 'Layer 1', 'Layer 2', 'DeFi', 'Payments', 'NFT/Gaming', 'Infrastructure', 'Privacy', 'Meme'];

export default function ExploreScreen() {
  const router = useRouter();
  const { colors, categoryColors, isDark } = useTheme();
  const { learnedCoins } = useProgressStore();

  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('All');

  const filtered = COINS.filter(c => {
    const matchesCat   = category === 'All' || c.category === category;
    const q            = query.toLowerCase();
    const matchesQuery = !q || c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const learnedCount = learnedCoins.size;
  const totalCount   = COINS.length;

  const s = StyleSheet.create({
    container:   { flex: 1, backgroundColor: colors.bg },
    content:     { paddingBottom: 120 },
    header:      { paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingHorizontal: 20, paddingBottom: 12 },
    eyebrow:     { fontSize: 10, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 4 },
    title:       { fontSize: 30, fontWeight: '800', color: colors.white, letterSpacing: -0.5, marginBottom: 16 },
    statsRow:    { flexDirection: 'row', gap: 10, marginBottom: 20 },
    statPill:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7 },
    statNum:     { fontSize: 15, fontWeight: '900', letterSpacing: -0.3 },
    statLabel:   { fontSize: 12, color: colors.textDim, fontWeight: '600' },

    searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, paddingHorizontal: 14, marginHorizontal: 20, marginBottom: 12, gap: 8 },
    searchIcon:  { fontSize: 15, color: colors.textDim },
    searchInput: { flex: 1, height: 44, fontSize: 14, color: colors.white, fontWeight: '500' },
    clearBtn:    { padding: 4 },
    clearTxt:    { fontSize: 14, color: colors.textDim },

    catScroll:   { paddingHorizontal: 20, marginBottom: 16 },
    catChip:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1, borderColor: colors.bgCardBorder, backgroundColor: colors.bgCard, marginRight: 8 },
    catChipOn:   { borderColor: colors.cyan, backgroundColor: `${colors.cyan}12` },
    catChipTxt:  { fontSize: 12, fontWeight: '700', color: colors.textDim },
    catChipTxtOn:{ color: colors.cyan },

    resultsInfo: { paddingHorizontal: 20, marginBottom: 10 },
    resultsCount:{ fontSize: 12, color: colors.textDim, fontWeight: '600' },

    coinList:    { paddingHorizontal: 20, gap: 8 },
    coinRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, padding: 14, overflow: 'hidden' },
    coinAccent:  { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    coinLogo:    { width: 42, height: 42, borderRadius: 21 },
    coinMeta:    { flex: 1 },
    coinTopRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
    coinSymbol:  { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
    coinCatBadge:{ borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2 },
    coinCatTxt:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
    coinName:    { fontSize: 13, color: colors.textMid, fontWeight: '500' },
    learnedBadge:{ width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    learnedTxt:  { fontSize: 11, fontWeight: '900' },
    arrowTxt:    { fontSize: 22, color: colors.textDim, fontWeight: '300' },

    empty:       { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
    emptyEmoji:  { fontSize: 40, marginBottom: 12 },
    emptyTitle:  { fontSize: 17, fontWeight: '700', color: colors.white, marginBottom: 6 },
    emptySub:    { fontSize: 13, color: colors.textDim, textAlign: 'center' },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.eyebrow}>DISCOVER</Text>
        <Text style={s.title}>Explore</Text>
        <View style={s.statsRow}>
          <View style={s.statPill}>
            <Text style={[s.statNum, { color: colors.green }]}>{learnedCount}</Text>
            <Text style={s.statLabel}>learned</Text>
          </View>
          <View style={s.statPill}>
            <Text style={[s.statNum, { color: colors.cyan }]}>{totalCount - learnedCount}</Text>
            <Text style={s.statLabel}>to go</Text>
          </View>
          <View style={s.statPill}>
            <Text style={[s.statNum, { color: colors.purple }]}>{totalCount}</Text>
            <Text style={s.statLabel}>total</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search coins…"
          placeholderTextColor={colors.textDim}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable style={s.clearBtn} onPress={() => setQuery('')}>
            <Text style={s.clearTxt}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catScroll} style={{ flexShrink: 0 }}>
        {ALL_CATEGORIES.map(cat => (
          <Pressable key={cat} style={[s.catChip, category === cat && s.catChipOn]} onPress={() => setCategory(cat)}>
            <Text style={[s.catChipTxt, category === cat && s.catChipTxtOn]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.resultsInfo}>
          <Text style={s.resultsCount}>{filtered.length} coin{filtered.length !== 1 ? 's' : ''}{category !== 'All' ? ` in ${category}` : ''}</Text>
        </View>

        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🔭</Text>
            <Text style={s.emptyTitle}>No coins found</Text>
            <Text style={s.emptySub}>Try a different search term or category</Text>
          </View>
        ) : (
          <View style={s.coinList}>
            {filtered.map(coin => {
              const catColor  = categoryColors[coin.category] ?? colors.cyan;
              const isLearned = learnedCoins.has(coin.symbol);
              return (
                <Pressable key={coin.symbol} style={s.coinRow} onPress={() => router.push(`/coin/${coin.symbol}`)}>
                  <View style={[s.coinAccent, { backgroundColor: catColor }]} />
                  <Image source={{ uri: coin.logoUrl }} style={s.coinLogo} />
                  <View style={s.coinMeta}>
                    <View style={s.coinTopRow}>
                      <Text style={[s.coinSymbol, { color: catColor }]}>{coin.symbol}</Text>
                      <View style={[s.coinCatBadge, { backgroundColor: `${catColor}15` }]}>
                        <Text style={[s.coinCatTxt, { color: catColor }]}>{coin.category}</Text>
                      </View>
                    </View>
                    <Text style={s.coinName}>{coin.name}</Text>
                  </View>
                  {isLearned ? (
                    <View style={[s.learnedBadge, { backgroundColor: `${colors.green}20` }]}>
                      <Text style={[s.learnedTxt, { color: colors.green }]}>✓</Text>
                    </View>
                  ) : (
                    <Text style={s.arrowTxt}>›</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
