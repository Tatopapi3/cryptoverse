export interface ColorScheme {
  bg: string;
  bgCard: string;
  bgCardBorder: string;
  cyan: string;
  purple: string;
  white: string;
  textMid: string;
  textDim: string;
  green: string;
  red: string;
  tan: string;
  layer1: string;
  layer2: string;
  defi: string;
  payments: string;
  nftGaming: string;
  infrastructure: string;
  privacy: string;
  meme: string;
}

export const darkColors: ColorScheme = {
  bg: '#060e06',
  bgCard: 'rgba(255,255,255,0.03)',
  bgCardBorder: 'rgba(255,255,255,0.07)',
  cyan: '#8fbe7e',
  purple: '#a08ec8',
  white: '#edeae0',
  textMid: 'rgba(237,234,224,0.58)',
  textDim: 'rgba(237,234,224,0.32)',
  green: '#7ab568',
  red: '#c4675a',
  tan: '#c9a55c',
  layer1: '#8fbe7e',
  layer2: '#a08ec8',
  defi: '#5aab7a',
  payments: '#c9a55c',
  nftGaming: '#c4788a',
  infrastructure: '#c49a5c',
  privacy: '#b0a8cc',
  meme: '#d4856a',
};

export const lightColors: ColorScheme = {
  bg: '#f4f0e8',
  bgCard: 'rgba(0,0,0,0.04)',
  bgCardBorder: 'rgba(0,0,0,0.08)',
  cyan: '#3d7a30',
  purple: '#5c46a0',
  white: '#182218',
  textMid: 'rgba(24,34,24,0.62)',
  textDim: 'rgba(24,34,24,0.38)',
  green: '#2e7a1e',
  red: '#a83020',
  tan: '#8a6818',
  layer1: '#3d7a30',
  layer2: '#5c46a0',
  defi: '#2a7a4a',
  payments: '#8a6818',
  nftGaming: '#8a3850',
  infrastructure: '#8a5818',
  privacy: '#484090',
  meme: '#963a20',
};

export const darkCategoryColors: Record<string, string> = {
  'Layer 1': darkColors.layer1,
  'Layer 2': darkColors.layer2,
  'DeFi': darkColors.defi,
  'Payments': darkColors.payments,
  'NFT/Gaming': darkColors.nftGaming,
  'Infrastructure': darkColors.infrastructure,
  'Privacy': darkColors.privacy,
  'Meme': darkColors.meme,
};

export const lightCategoryColors: Record<string, string> = {
  'Layer 1': lightColors.layer1,
  'Layer 2': lightColors.layer2,
  'DeFi': lightColors.defi,
  'Payments': lightColors.payments,
  'NFT/Gaming': lightColors.nftGaming,
  'Infrastructure': lightColors.infrastructure,
  'Privacy': lightColors.privacy,
  'Meme': lightColors.meme,
};

// Backward-compatible defaults (dark theme)
export const colors = darkColors;
export const categoryColors = darkCategoryColors;

export const stages = {
  foundation: 'Foundation',
  ecosystem: 'Ecosystem',
  advanced: 'Advanced',
};
