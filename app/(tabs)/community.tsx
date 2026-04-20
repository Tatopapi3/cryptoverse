import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const MOCK_LEADERS = [
  { rank: 1, username: 'cryptowhale_jc', xp: 4800, streak: 42, learned: 18 },
  { rank: 2, username: 'web3_native', xp: 3950, streak: 28, learned: 15 },
  { rank: 3, username: 'defi_degen', xp: 3200, streak: 21, learned: 12 },
  { rank: 4, username: 'hodl_king', xp: 2750, streak: 14, learned: 10 },
  { rank: 5, username: 'satoshi_jr', xp: 2100, streak: 9, learned: 8 },
];

const rankColors = ['#c9a55c', '#a0a0a0', '#8a6840'];

export default function CommunityScreen() {
  const { colors } = useTheme();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 100 },
    eyebrow: { fontSize: 10, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
    title: { fontSize: 28, fontWeight: '800', color: colors.white, marginBottom: 20, letterSpacing: -0.4 },
    tabs: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 100, borderWidth: 1, borderColor: colors.bgCardBorder },
    tabActive: { backgroundColor: `${colors.cyan}12`, borderColor: `${colors.cyan}35` },
    tabText: { fontSize: 13, color: colors.textDim, fontWeight: '600' },
    tabTextActive: { fontSize: 13, color: colors.cyan, fontWeight: '700' },
    leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, padding: 16, marginBottom: 10 },
    leaderRowTop: { borderColor: `${colors.tan}25`, backgroundColor: `${colors.tan}06` },
    rank: { fontSize: 20, fontWeight: '800', width: 36, textAlign: 'center' },
    userInfo: { flex: 1 },
    username: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 3 },
    userStats: { fontSize: 12, color: colors.textDim },
    xp: { fontSize: 14, fontWeight: '800', color: colors.cyan },
    comingSoon: { alignItems: 'center', paddingTop: 40 },
    comingSoonEmoji: { fontSize: 40, marginBottom: 14 },
    comingSoonTitle: { fontSize: 17, fontWeight: '700', color: colors.white, marginBottom: 8, textAlign: 'center' },
    comingSoonSub: { fontSize: 13, color: colors.textDim, textAlign: 'center', maxWidth: 280, lineHeight: 20 },
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>COMMUNITY</Text>
      <Text style={s.title}>Leaderboard</Text>
      <View style={s.tabs}>
        <View style={[s.tab, s.tabActive]}><Text style={s.tabTextActive}>Weekly</Text></View>
        <View style={s.tab}><Text style={s.tabText}>All Time</Text></View>
      </View>
      {MOCK_LEADERS.map(user => (
        <View key={user.rank} style={[s.leaderRow, user.rank <= 3 && s.leaderRowTop]}>
          <Text style={[s.rank, { color: rankColors[user.rank - 1] ?? colors.textDim }]}>
            {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
          </Text>
          <View style={s.userInfo}>
            <Text style={s.username}>{user.username}</Text>
            <Text style={s.userStats}>{user.learned} coins · 🔥 {user.streak} days</Text>
          </View>
          <Text style={s.xp}>{user.xp.toLocaleString()} XP</Text>
        </View>
      ))}
      <View style={s.comingSoon}>
        <Text style={s.comingSoonEmoji}>👥</Text>
        <Text style={s.comingSoonTitle}>Community discussions coming in Phase 3</Text>
        <Text style={s.comingSoonSub}>Per-coin threads, follow system, and shareable milestone cards</Text>
      </View>
    </ScrollView>
  );
}
