import { ScrollView, View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { COINS, STAGES, type Category } from '../../constants/coins';
import { useProgressStore } from '../../store/useProgressStore';
import { useState } from 'react';

const ALL_CATEGORIES: Category[] = ['Layer 1', 'Layer 2', 'DeFi', 'Payments', 'NFT/Gaming', 'Infrastructure', 'Privacy'];
const CONCEPTS = ['Blockchain', 'Consensus', 'Wallets', 'Gas Fees', 'Smart Contracts', 'Bridges', 'ZK Proofs'];

export default function RoadmapScreen() {
  const router = useRouter();
  const { colors, categoryColors, isDark } = useTheme();
  const { learnedCoins } = useProgressStore();
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');

  const filteredCoins = activeFilter === 'All' ? COINS : COINS.filter(c => c.category === activeFilter);
  const totalLearned = learnedCoins.size;
  const totalCoins = COINS.length;
  const pct = Math.round((totalLearned / totalCoins) * 100);

  const card = { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 16 };
  const dividerBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { paddingBottom: 100 },
    header: { padding: 20, paddingTop: Platform.OS === 'ios' ? 64 : 44, marginBottom: 8 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
    eyebrow: { fontSize: 10, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 5 },
    title: { fontSize: 28, fontWeight: '900', color: colors.white, letterSpacing: -0.5 },
    pctBubble: { alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: `${colors.cyan}10`, borderWidth: 1, borderColor: `${colors.cyan}28` },
    pctBubbleNum: { fontSize: 18, fontWeight: '900', color: colors.cyan, lineHeight: 20 },
    pctBubbleSub: { fontSize: 9, color: colors.textDim, fontWeight: '600', letterSpacing: 0.5 },
    progressTrack: { height: 5, backgroundColor: dividerBg, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
    progressFill: { height: '100%', backgroundColor: colors.cyan, borderRadius: 3 },
    progressNote: { fontSize: 11, color: colors.textDim },
    basicsCard: { ...card, marginHorizontal: 20, marginBottom: 20, padding: 18, flexDirection: 'row', alignItems: 'center', borderColor: `${colors.tan}28`, overflow: 'hidden' },
    basicsBadge: { alignSelf: 'flex-start', backgroundColor: `${colors.tan}14`, borderWidth: 1, borderColor: `${colors.tan}30`, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8 },
    basicsBadgeText: { fontSize: 9, fontWeight: '700', color: colors.tan, letterSpacing: 1 },
    basicsTitle: { fontSize: 18, fontWeight: '800', color: colors.white, letterSpacing: -0.3, marginBottom: 3 },
    basicsSub: { fontSize: 12, color: colors.textDim },
    basicsArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: `${colors.tan}14`, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
    conceptPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 100, paddingHorizontal: 9, paddingVertical: 4 },
    conceptNum: { fontSize: 9, fontWeight: '800', color: colors.tan },
    conceptText: { fontSize: 10, color: colors.textMid, fontWeight: '500' },
    filterRow: { marginBottom: 24 },
    filterChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1, borderColor: colors.bgCardBorder, backgroundColor: colors.bgCard },
    filterChipActive: { borderColor: `${colors.cyan}40`, backgroundColor: `${colors.cyan}10` },
    filterDot: { width: 6, height: 6, borderRadius: 3 },
    filterLabel: { fontSize: 11, color: colors.textMid, fontWeight: '600' },
    stageSection: { paddingHorizontal: 20, marginBottom: 36 },
    stageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    stageLine: { width: 3, height: 32, backgroundColor: colors.cyan, borderRadius: 2, opacity: 0.5 },
    stageHeaderInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stageTitle: { fontSize: 18, fontWeight: '900', color: colors.white, letterSpacing: -0.3 },
    stagePill: { backgroundColor: dividerBg, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
    stagePillText: { fontSize: 11, fontWeight: '700', color: colors.textDim },
    coinList: { gap: 8, marginBottom: 12 },
    coinRow: { ...card, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', gap: 12 },
    coinAccent: { width: 3, alignSelf: 'stretch' },
    coinLogo: { width: 36, height: 36, borderRadius: 18 },
    coinInfo: { flex: 1, paddingVertical: 13 },
    coinTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
    coinSymbol: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
    coinCatTag: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
    coinCatText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
    coinName: { fontSize: 12, fontWeight: '600', color: colors.white, marginBottom: 2 },
    coinDesc: { fontSize: 11, color: colors.textDim, lineHeight: 15 },
    learnedCheck: { width: 26, height: 26, borderRadius: 13, backgroundColor: `${colors.green}18`, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    learnedCheckText: { fontSize: 12, color: colors.green, fontWeight: '700' },
    coinArrow: { fontSize: 22, color: colors.textDim, fontWeight: '300', marginRight: 14 },
    stageProgress: { height: 3, backgroundColor: dividerBg, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
    stageProgressFill: { height: '100%', backgroundColor: colors.cyan, borderRadius: 2, opacity: 0.6 },
    stageProgressNote: { fontSize: 10, color: colors.textDim },
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.eyebrow}>YOUR LEARNING PATH</Text>
            <Text style={s.title}>Crypto Roadmap</Text>
          </View>
          <View style={s.pctBubble}>
            <Text style={s.pctBubbleNum}>{pct}%</Text>
            <Text style={s.pctBubbleSub}>done</Text>
          </View>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${pct}%` as any }]} />
        </View>
        <Text style={s.progressNote}>{totalLearned} of {totalCoins} coins learned</Text>
      </View>

      <Pressable style={s.basicsCard} onPress={() => {}}>
        <View style={{ flex: 1 }}>
          <View style={s.basicsBadge}><Text style={s.basicsBadgeText}>PRE-STAGE</Text></View>
          <Text style={s.basicsTitle}>Blockchain Basics</Text>
          <Text style={s.basicsSub}>7 core concepts to master first</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 6 }}>
            {CONCEPTS.map((c, i) => (
              <View key={c} style={s.conceptPill}>
                <Text style={s.conceptNum}>{i + 1}</Text>
                <Text style={s.conceptText}>{c}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={s.basicsArrow}><Text style={{ fontSize: 16 }}>🔒</Text></View>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow} contentContainerStyle={{ paddingHorizontal: 20, gap: 7 }}>
        {(['All', ...ALL_CATEGORIES] as const).map(cat => {
          const active = activeFilter === cat;
          const dotColor = cat !== 'All' ? categoryColors[cat] : undefined;
          return (
            <Pressable key={cat} onPress={() => setActiveFilter(cat)} style={[s.filterChip, active && s.filterChipActive]}>
              {dotColor && <View style={[s.filterDot, { backgroundColor: dotColor }]} />}
              <Text style={[s.filterLabel, active && { color: colors.cyan }]}>{cat}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {STAGES.map(stage => {
        const stageCoins = filteredCoins.filter(c => c.stage === stage);
        if (!stageCoins.length) return null;
        const stageLearned = stageCoins.filter(c => learnedCoins.has(c.symbol)).length;
        const stagePct = Math.round((stageLearned / stageCoins.length) * 100);
        return (
          <View key={stage} style={s.stageSection}>
            <View style={s.stageHeader}>
              <View style={s.stageLine} />
              <View style={s.stageHeaderInner}>
                <Text style={s.stageTitle}>{stage}</Text>
                <View style={s.stagePill}><Text style={s.stagePillText}>{stageLearned}/{stageCoins.length}</Text></View>
              </View>
            </View>
            <View style={s.coinList}>
              {stageCoins.map(coin => {
                const isLearned = learnedCoins.has(coin.symbol);
                const catColor = categoryColors[coin.category];
                return (
                  <Pressable key={coin.symbol}
                    style={[s.coinRow, isLearned
                      ? { borderColor: `${colors.green}25`, backgroundColor: `${colors.green}05` }
                      : { borderColor: `${catColor}18` }
                    ]}
                    onPress={() => router.push(`/coin/${coin.symbol}`)}>
                    <View style={[s.coinAccent, { backgroundColor: isLearned ? colors.green : catColor }]} />
                    <Image source={{ uri: coin.logoUrl }} style={s.coinLogo} />
                    <View style={s.coinInfo}>
                      <View style={s.coinTop}>
                        <Text style={[s.coinSymbol, { color: isLearned ? colors.green : catColor }]}>{coin.symbol}</Text>
                        <View style={[s.coinCatTag, { backgroundColor: `${catColor}14` }]}>
                          <Text style={[s.coinCatText, { color: catColor }]}>{coin.category}</Text>
                        </View>
                      </View>
                      <Text style={s.coinName}>{coin.name}</Text>
                      <Text style={s.coinDesc} numberOfLines={1}>{coin.description}</Text>
                    </View>
                    {isLearned
                      ? <View style={s.learnedCheck}><Text style={s.learnedCheckText}>✓</Text></View>
                      : <Text style={s.coinArrow}>›</Text>
                    }
                  </Pressable>
                );
              })}
            </View>
            <View style={s.stageProgress}>
              <View style={[s.stageProgressFill, { width: `${stagePct}%` as any }]} />
            </View>
            <Text style={s.stageProgressNote}>{stagePct}% of {stage} complete</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
