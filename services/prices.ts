import { COINS } from '../constants/coins';

export interface PriceData {
  usd: number;
  usd_24h_change: number;
}

export type PriceMap = Record<string, PriceData>; // keyed by geckoId

// Symbol → geckoId lookup
const symbolToGeckoId: Record<string, string> = Object.fromEntries(
  COINS.map((c) => [c.symbol, c.geckoId])
);

let cache: { data: PriceMap; ts: number } | null = null;
const CACHE_TTL = 60_000; // 60 seconds

export async function fetchPrices(): Promise<PriceMap> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;

  const ids = COINS.map((c) => c.geckoId).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

  const json = await res.json();

  const data: PriceMap = {};
  for (const [geckoId, vals] of Object.entries(json as any)) {
    data[geckoId] = {
      usd: (vals as any).usd ?? 0,
      usd_24h_change: (vals as any).usd_24h_change ?? 0,
    };
  }

  cache = { data, ts: Date.now() };
  return data;
}

export function priceForSymbol(prices: PriceMap, symbol: string): PriceData | null {
  const geckoId = symbolToGeckoId[symbol];
  return geckoId ? (prices[geckoId] ?? null) : null;
}

export function formatPrice(usd: number): string {
  if (usd >= 1000) return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (usd >= 1) return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
}

export function formatChange(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}
