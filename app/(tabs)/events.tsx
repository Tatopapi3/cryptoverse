import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const MOCK_EVENTS = [
  { id: '1', title: 'ETHDenver 2026', type: 'Conference', date: 'May 12–18, 2026', location: 'Denver, CO', coins: ['ETH', 'ARB', 'OP'], online: false },
  { id: '2', title: 'Solana Breakpoint', type: 'Conference', date: 'Jun 3–5, 2026', location: 'Amsterdam', coins: ['SOL'], online: false },
  { id: '3', title: 'DeFi Weekly AMA', type: 'AMA', date: 'Apr 18, 2026', location: 'Online', coins: ['UNI', 'AAVE'], online: true },
  { id: '4', title: 'ZK Summit 12', type: 'Hackathon', date: 'May 1, 2026', location: 'Online', coins: ['ETH', 'IMX'], online: true },
];

export default function EventsScreen() {
  const { colors } = useTheme();

  const typeColors: Record<string, string> = {
    Conference: colors.cyan,
    AMA: colors.purple,
    Hackathon: colors.tan,
    Meetup: colors.green,
    Webinar: colors.layer2,
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 100 },
    eyebrow: { fontSize: 10, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
    title: { fontSize: 28, fontWeight: '800', color: colors.white, marginBottom: 24, letterSpacing: -0.4 },
    eventCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 16, padding: 20, marginBottom: 12 },
    eventTop: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    typeBadge: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
    typeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
    onlineBadge: { backgroundColor: colors.bgCard, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.bgCardBorder },
    onlineText: { fontSize: 10, color: colors.textMid, fontWeight: '600' },
    eventTitle: { fontSize: 16, fontWeight: '700', color: colors.white, marginBottom: 8, letterSpacing: -0.2 },
    eventDate: { fontSize: 12, color: colors.textMid, marginBottom: 3 },
    eventLocation: { fontSize: 12, color: colors.textMid, marginBottom: 12 },
    coinTags: { flexDirection: 'row', gap: 6 },
    coinTag: { backgroundColor: `${colors.cyan}12`, borderRadius: 100, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 1, borderColor: `${colors.cyan}25` },
    coinTagText: { fontSize: 10, fontWeight: '700', color: colors.cyan },
    comingSoon: { marginTop: 8, padding: 18, backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.bgCardBorder },
    comingSoonText: { fontSize: 12, color: colors.textDim, textAlign: 'center', lineHeight: 19 },
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>UPCOMING</Text>
      <Text style={s.title}>Crypto Events</Text>
      {MOCK_EVENTS.map(event => {
        const typeColor = typeColors[event.type] ?? colors.cyan;
        return (
          <View key={event.id} style={s.eventCard}>
            <View style={s.eventTop}>
              <View style={[s.typeBadge, { backgroundColor: `${typeColor}15`, borderColor: `${typeColor}35` }]}>
                <Text style={[s.typeText, { color: typeColor }]}>{event.type}</Text>
              </View>
              {event.online && <View style={s.onlineBadge}><Text style={s.onlineText}>🌐 Online</Text></View>}
            </View>
            <Text style={s.eventTitle}>{event.title}</Text>
            <Text style={s.eventDate}>📅 {event.date}</Text>
            <Text style={s.eventLocation}>📍 {event.location}</Text>
            <View style={s.coinTags}>
              {event.coins.map(c => <View key={c} style={s.coinTag}><Text style={s.coinTagText}>{c}</Text></View>)}
            </View>
          </View>
        );
      })}
      <View style={s.comingSoon}>
        <Text style={s.comingSoonText}>Full events calendar with RSVP, filters, and calendar sync coming in Phase 2</Text>
      </View>
    </ScrollView>
  );
}
