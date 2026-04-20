import { ScrollView, View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/useProgressStore';
import { COINS } from '../../constants/coins';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, categoryColors, isDark, toggle } = useTheme();
  const { xp, streak, learnedCoins } = useProgressStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalCoins = COINS.length;
  const learned = learnedCoins.size;
  const level = Math.floor(xp / 500) + 1;
  const levelNames = ['', 'Novice', 'Apprentice', 'Analyst', 'Strategist', 'Whale'];
  const levelName = levelNames[Math.min(level, levelNames.length - 1)];
  const xpPct = ((xp % 500) / 500) * 100;
  const roadmapPct = Math.round((learned / totalCoins) * 100);
  const nextCoin = COINS.find(c => !learnedCoins.has(c.symbol));
  const recentUnlearned = COINS.filter(c => !learnedCoins.has(c.symbol)).slice(1, 6);

  const card = { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 18 };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { paddingTop: Platform.OS === 'ios' ? 64 : 44, paddingBottom: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    greeting: { fontSize: 15, color: colors.textDim, letterSpacing: 0.5, marginBottom: 2 },
    title: { fontSize: 30, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    themeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, alignItems: 'center', justifyContent: 'center' },
    themeBtnText: { fontSize: 17 },
    levelPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: `${colors.cyan}12`, borderWidth: 1, borderColor: `${colors.cyan}28`, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 },
    levelDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan },
    levelLabel: { fontSize: 13, fontWeight: '700', color: colors.cyan, letterSpacing: 0.8 },
    statsStrip: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 20 },
    statChip: { flex: 1, ...card, borderRadius: 14, padding: 14 },
    statChipValue: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, lineHeight: 30 },
    statChipLabel: { fontSize: 12, color: colors.textDim, fontWeight: '600', marginTop: 2, marginBottom: 8 },
    chipBar: { height: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', borderRadius: 1, overflow: 'hidden' },
    chipBarFill: { height: '100%', borderRadius: 1 },
    nextCard: { ...card, marginHorizontal: 20, marginBottom: 24, overflow: 'hidden', borderRadius: 18 },
    nextCardAccent: { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    nextCardInner: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 0 },
    nextCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    nextBadge: { borderWidth: 1, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
    nextBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    catTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    catTagText: { fontSize: 12, fontWeight: '700' },
    nextCardBody: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
    nextLogo: { width: 48, height: 48, borderRadius: 24, marginTop: 2 },
    nextSymbol: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5, lineHeight: 32 },
    nextName: { fontSize: 15, color: colors.white, fontWeight: '600', marginBottom: 4 },
    nextDesc: { fontSize: 14, color: colors.textDim, lineHeight: 20 },
    nextCTA: { borderTopWidth: 1, paddingVertical: 14 },
    nextCTAText: { fontSize: 15, fontWeight: '700' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle: { fontSize: 19, fontWeight: '800', color: colors.white, letterSpacing: -0.3 },
    sectionLink: { fontSize: 14, color: colors.cyan, fontWeight: '600' },
    coinList: { paddingHorizontal: 20, gap: 8, marginBottom: 24 },
    coinRow: { ...card, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, overflow: 'hidden' },
    coinRowAccent: { position: 'absolute' as any, left: 0, top: 0, bottom: 0, width: 3 },
    coinRowLogo: { width: 38, height: 38, borderRadius: 19, marginLeft: 8 },
    coinRowTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
    coinRowSymbol: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
    coinRowCat: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
    coinRowCatText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
    coinRowName: { fontSize: 14, color: colors.textMid },
    coinRowArrow: { fontSize: 24, color: colors.textDim, fontWeight: '300', paddingRight: 4 },
    challengeCard: { ...card, flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 20, borderColor: `${colors.cyan}20`, overflow: 'hidden' },
    challengeGlow: { position: 'absolute' as any, top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: `${colors.cyan}08` },
    challengeEye: { fontSize: 11, color: colors.cyan, letterSpacing: 1.2, fontWeight: '700', marginBottom: 5 },
    challengeTitle: { fontSize: 21, fontWeight: '800', color: colors.white, marginBottom: 3, letterSpacing: -0.3 },
    challengeSub: { fontSize: 14, color: colors.textDim },
    challengeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${colors.cyan}18`, alignItems: 'center', justifyContent: 'center' },
    challengeBtnText: { fontSize: 18, color: colors.cyan, fontWeight: '700' },
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting}</Text>
          <Text style={s.title}>Welcome back</Text>
        </View>
        <View style={s.headerRight}>
          <Pressable style={s.themeBtn} onPress={toggle}>
            <Text style={s.themeBtnText}>{isDark ? '☀️' : '🌙'}</Text>
          </Pressable>
          <View style={s.levelPill}>
            <View style={s.levelDot} />
            <Text style={s.levelLabel}>{levelName}</Text>
          </View>
        </View>
      </View>

      <View style={s.statsStrip}>
        <View style={[s.statChip, { borderColor: `${colors.cyan}28` }]}>
          <Text style={[s.statChipValue, { color: colors.cyan }]}>{xp.toLocaleString()}</Text>
          <Text style={s.statChipLabel}>XP</Text>
          <View style={s.chipBar}>
            <View style={[s.chipBarFill, { width: `${xpPct}%` as any, backgroundColor: colors.cyan }]} />
          </View>
        </View>
        <View style={[s.statChip, { borderColor: `${colors.tan}28` }]}>
          <Text style={[s.statChipValue, { color: colors.tan }]}>{streak}</Text>
          <Text style={s.statChipLabel}>🔥 Streak</Text>
        </View>
        <View style={[s.statChip, { borderColor: `${colors.purple}28` }]}>
          <Text style={[s.statChipValue, { color: colors.purple }]}>{roadmapPct}%</Text>
          <Text style={s.statChipLabel}>Progress</Text>
          <View style={s.chipBar}>
            <View style={[s.chipBarFill, { width: `${roadmapPct}%` as any, backgroundColor: colors.purple }]} />
          </View>
        </View>
      </View>

      {nextCoin && (() => {
        const catColor = categoryColors[nextCoin.category];
        return (
          <Pressable style={[s.nextCard, { borderColor: `${catColor}25` }]} onPress={() => router.push(`/coin/${nextCoin.symbol}`)}>
            <View style={[s.nextCardAccent, { backgroundColor: catColor }]} />
            <View style={s.nextCardInner}>
              <View style={s.nextCardTop}>
                <View style={[s.nextBadge, { backgroundColor: `${catColor}15`, borderColor: `${catColor}30` }]}>
                  <Text style={[s.nextBadgeText, { color: catColor }]}>UP NEXT</Text>
                </View>
                <View style={[s.catTag, { backgroundColor: `${catColor}12` }]}>
                  <Text style={[s.catTagText, { color: catColor }]}>{nextCoin.category}</Text>
                </View>
              </View>
              <View style={s.nextCardBody}>
                <Image source={{ uri: nextCoin.logoUrl }} style={s.nextLogo} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.nextSymbol, { color: catColor }]}>{nextCoin.symbol}</Text>
                  <Text style={s.nextName}>{nextCoin.name}</Text>
                  <Text style={s.nextDesc} numberOfLines={2}>{nextCoin.description}</Text>
                </View>
              </View>
              <View style={[s.nextCTA, { borderTopColor: `${catColor}15` }]}>
                <Text style={[s.nextCTAText, { color: catColor }]}>Start learning →</Text>
              </View>
            </View>
          </Pressable>
        );
      })()}

      {recentUnlearned.length > 0 && (
        <>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Continue Learning</Text>
            <Pressable onPress={() => router.push('/roadmap')}>
              <Text style={s.sectionLink}>See all</Text>
            </Pressable>
          </View>
          <View style={s.coinList}>
            {recentUnlearned.map(coin => {
              const catColor = categoryColors[coin.category];
              return (
                <Pressable key={coin.symbol} style={s.coinRow} onPress={() => router.push(`/coin/${coin.symbol}`)}>
                  <View style={[s.coinRowAccent, { backgroundColor: catColor }]} />
                  <Image source={{ uri: coin.logoUrl }} style={s.coinRowLogo} />
                  <View style={{ flex: 1 }}>
                    <View style={s.coinRowTop}>
                      <Text style={[s.coinRowSymbol, { color: catColor }]}>{coin.symbol}</Text>
                      <View style={[s.coinRowCat, { backgroundColor: `${catColor}15` }]}>
                        <Text style={[s.coinRowCatText, { color: catColor }]}>{coin.category}</Text>
                      </View>
                    </View>
                    <Text style={s.coinRowName}>{coin.name}</Text>
                  </View>
                  <Text style={s.coinRowArrow}>›</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <Pressable style={s.challengeCard} onPress={() => router.push('/quiz')}>
        <View style={s.challengeGlow} />
        <View style={{ flex: 1 }}>
          <Text style={s.challengeEye}>✦ DAILY CHALLENGE</Text>
          <Text style={s.challengeTitle}>Ready for today's quiz?</Text>
          <Text style={s.challengeSub}>Test your knowledge · 5 random coins</Text>
        </View>
        <View style={s.challengeBtn}>
          <Text style={s.challengeBtnText}>→</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}
