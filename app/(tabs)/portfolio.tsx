import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';
import { COINS } from '../../constants/coins';
import { fetchPrices, priceForSymbol, formatPrice, formatChange, type PriceMap } from '../../services/prices';

const PORTFOLIO_KEY = 'cryptoverse-portfolio';
const DEFAULT_HOLDINGS = [
  { symbol: 'BTC', amount: 0.05, purchasePrice: 60000 },
  { symbol: 'ETH', amount: 1.2, purchasePrice: 3200 },
];

interface Holding { symbol: string; amount: number; purchasePrice: number; }

export default function PortfolioScreen() {
  const { colors } = useTheme();
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  const [holdingsLoaded, setHoldingsLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [prices, setPrices] = useState<PriceMap>({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesError, setPricesError] = useState('');

  // Load persisted holdings on mount
  useEffect(() => {
    AsyncStorage.getItem(PORTFOLIO_KEY).then((raw) => {
      if (raw) {
        try { setHoldings(JSON.parse(raw)); } catch {}
      }
      setHoldingsLoaded(true);
    });
  }, []);

  // Persist holdings whenever they change (skip initial load)
  useEffect(() => {
    if (!holdingsLoaded) return;
    AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(holdings));
  }, [holdings, holdingsLoaded]);

  useEffect(() => {
    fetchPrices()
      .then(setPrices)
      .catch(() => setPricesError('Could not load prices'))
      .finally(() => setPricesLoading(false));
  }, []);

  const addHolding = () => {
    if (!newSymbol || !newAmount || !newPrice) return;
    setHoldings(prev => [...prev, { symbol: newSymbol.toUpperCase(), amount: parseFloat(newAmount), purchasePrice: parseFloat(newPrice) }]);
    setNewSymbol(''); setNewAmount(''); setNewPrice('');
    setShowAdd(false);
  };

  const removeHolding = (index: number) => {
    setHoldings(prev => prev.filter((_, i) => i !== index));
  };

  // Use live price if available, else fall back to purchase price
  const getLivePrice = (symbol: string, fallback: number) => {
    const p = priceForSymbol(prices, symbol);
    return p ? p.usd : fallback;
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.amount * getLivePrice(h.symbol, h.purchasePrice), 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.amount * h.purchasePrice, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    content: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 100 },
    eyebrow: { fontSize: 10, color: colors.textDim, letterSpacing: 1.4, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
    title: { fontSize: 28, fontWeight: '800', color: colors.white, marginBottom: 16, letterSpacing: -0.4 },
    priceBar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
    priceBarDot: { width: 6, height: 6, borderRadius: 3 },
    priceBarText: { fontSize: 11, fontWeight: '600' },
    totalCard: { backgroundColor: `${colors.cyan}08`, borderWidth: 1, borderColor: `${colors.cyan}22`, borderRadius: 16, padding: 24, marginBottom: 20 },
    totalLabel: { fontSize: 10, color: colors.textDim, letterSpacing: 1, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
    totalValue: { fontSize: 38, fontWeight: '800', color: colors.white, marginBottom: 8, letterSpacing: -1 },
    pnlRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    pnlBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
    pnlText: { fontSize: 12, fontWeight: '700' },
    pnlLabel: { fontSize: 11, color: colors.textDim },
    holdingCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, padding: 18, marginBottom: 10, overflow: 'hidden' },
    holdingTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    holdingLeft: { flex: 1 },
    holdingSymbol: { fontSize: 17, fontWeight: '800', color: colors.cyan, marginBottom: 2, letterSpacing: -0.3 },
    holdingName: { fontSize: 11, color: colors.textDim },
    holdingRight: { alignItems: 'flex-end' },
    holdingLivePrice: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 2 },
    holdingChange: { fontSize: 11, fontWeight: '600' },
    holdingStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    holdingStat: {},
    holdingStatLabel: { fontSize: 9, color: colors.textDim, letterSpacing: 0.8, fontWeight: '700', marginBottom: 3, textTransform: 'uppercase' as const },
    holdingStatValue: { fontSize: 13, fontWeight: '700', color: colors.white },
    holdingPnlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    holdingPnlBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    holdingPnlText: { fontSize: 11, fontWeight: '700' },
    allocBar: { height: 2, backgroundColor: colors.bgCardBorder, borderRadius: 1, overflow: 'hidden', marginTop: 10 },
    allocFill: { height: '100%', borderRadius: 1 },
    removeBtn: { alignSelf: 'flex-end', paddingTop: 8 },
    removeBtnText: { fontSize: 11, color: colors.textDim, fontWeight: '600' },
    addCard: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, padding: 20, marginBottom: 16 },
    addTitle: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 16 },
    input: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 10, padding: 14, color: colors.white, fontSize: 14, marginBottom: 10 },
    addBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
    cancelBtn: { flex: 1, padding: 13, borderRadius: 10, borderWidth: 1, borderColor: colors.bgCardBorder, alignItems: 'center' },
    cancelBtnText: { color: colors.textMid, fontWeight: '600', fontSize: 13 },
    confirmBtn: { flex: 1, padding: 13, borderRadius: 10, backgroundColor: colors.cyan, alignItems: 'center' },
    confirmBtnText: { color: colors.bg, fontWeight: '700', fontSize: 13 },
    addBtn: { borderWidth: 1, borderColor: colors.bgCardBorder, borderRadius: 14, padding: 17, alignItems: 'center', marginBottom: 20, borderStyle: 'dashed' },
    addBtnText: { fontSize: 13, fontWeight: '600', color: colors.textMid },
    disclaimer: { fontSize: 11, color: colors.textDim, textAlign: 'center', lineHeight: 17 },
  });

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.eyebrow}>YOUR HOLDINGS</Text>
      <Text style={s.title}>Portfolio</Text>

      {/* Price status bar */}
      <View style={s.priceBar}>
        <View style={[s.priceBarDot, { backgroundColor: pricesLoading ? colors.tan : pricesError ? colors.red : colors.green }]} />
        <Text style={[s.priceBarText, { color: pricesLoading ? colors.tan : pricesError ? colors.red : colors.green }]}>
          {pricesLoading ? 'Fetching live prices…' : pricesError ? 'Live prices unavailable' : 'Live prices · CoinGecko'}
        </Text>
        {pricesLoading && <ActivityIndicator size="small" color={colors.tan} />}
      </View>

      <View style={s.totalCard}>
        <Text style={s.totalLabel}>Total Value</Text>
        <Text style={s.totalValue}>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={s.pnlRow}>
          <View style={[s.pnlBadge, { backgroundColor: totalPnl >= 0 ? `${colors.green}18` : `${colors.red}18` }]}>
            <Text style={[s.pnlText, { color: totalPnl >= 0 ? colors.green : colors.red }]}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%)
            </Text>
          </View>
          <Text style={s.pnlLabel}>vs purchase price</Text>
        </View>
      </View>

      {holdings.map((h, i) => {
        const coin = COINS.find(c => c.symbol === h.symbol);
        const livePrice = getLivePrice(h.symbol, h.purchasePrice);
        const priceInfo = priceForSymbol(prices, h.symbol);
        const value = h.amount * livePrice;
        const cost = h.amount * h.purchasePrice;
        const pnl = value - cost;
        const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
        const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;
        const isPositive = pnl >= 0;

        return (
          <View key={i} style={s.holdingCard}>
            <View style={s.holdingTop}>
              <View style={s.holdingLeft}>
                <Text style={s.holdingSymbol}>{h.symbol}</Text>
                <Text style={s.holdingName}>{coin?.name ?? h.symbol}</Text>
              </View>
              <View style={s.holdingRight}>
                <Text style={s.holdingLivePrice}>{priceInfo ? formatPrice(priceInfo.usd) : '—'}</Text>
                {priceInfo && (
                  <Text style={[s.holdingChange, { color: priceInfo.usd_24h_change >= 0 ? colors.green : colors.red }]}>
                    {formatChange(priceInfo.usd_24h_change)} 24h
                  </Text>
                )}
              </View>
            </View>

            <View style={s.holdingStats}>
              <View style={s.holdingStat}>
                <Text style={s.holdingStatLabel}>Holdings</Text>
                <Text style={s.holdingStatValue}>{h.amount} {h.symbol}</Text>
              </View>
              <View style={s.holdingStat}>
                <Text style={s.holdingStatLabel}>Value</Text>
                <Text style={s.holdingStatValue}>${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
              <View style={s.holdingStat}>
                <Text style={s.holdingStatLabel}>Avg Buy</Text>
                <Text style={s.holdingStatValue}>{formatPrice(h.purchasePrice)}</Text>
              </View>
            </View>

            <View style={s.holdingPnlRow}>
              <View style={[s.holdingPnlBadge, { backgroundColor: isPositive ? `${colors.green}15` : `${colors.red}15` }]}>
                <Text style={[s.holdingPnlText, { color: isPositive ? colors.green : colors.red }]}>
                  {isPositive ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{pnlPct.toFixed(2)}%)
                </Text>
              </View>
              <Text style={s.pnlLabel}>{pct.toFixed(1)}% of portfolio</Text>
            </View>

            <View style={s.allocBar}>
              <View style={[s.allocFill, { width: `${pct}%` as any, backgroundColor: colors.cyan }]} />
            </View>

            <Pressable style={s.removeBtn} onPress={() => removeHolding(i)}>
              <Text style={s.removeBtnText}>Remove</Text>
            </Pressable>
          </View>
        );
      })}

      {showAdd ? (
        <View style={s.addCard}>
          <Text style={s.addTitle}>Add Holding</Text>
          <TextInput style={s.input} placeholder="Symbol (e.g. SOL)" placeholderTextColor={colors.textDim} value={newSymbol} onChangeText={setNewSymbol} autoCapitalize="characters" />
          <TextInput style={s.input} placeholder="Amount" placeholderTextColor={colors.textDim} value={newAmount} onChangeText={setNewAmount} keyboardType="decimal-pad" />
          <TextInput style={s.input} placeholder="Purchase price (USD)" placeholderTextColor={colors.textDim} value={newPrice} onChangeText={setNewPrice} keyboardType="decimal-pad" />
          <View style={s.addBtns}>
            <Pressable style={s.cancelBtn} onPress={() => setShowAdd(false)}><Text style={s.cancelBtnText}>Cancel</Text></Pressable>
            <Pressable style={s.confirmBtn} onPress={addHolding}><Text style={s.confirmBtnText}>Add</Text></Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={s.addBtn} onPress={() => setShowAdd(true)}><Text style={s.addBtnText}>+ Add Holding</Text></Pressable>
      )}

      <Text style={s.disclaimer}>Prices sourced from CoinGecko · Refreshes every 60 seconds</Text>
    </ScrollView>
  );
}
