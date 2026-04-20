export type EventType = 'conference' | 'upgrade' | 'milestone' | 'ama' | 'halving';

export interface CryptoEvent {
  id: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  description: string;
  type: EventType;
  coinSymbol?: string;
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  conference: '#a08ec8',
  upgrade:    '#8fbe7e',
  milestone:  '#c9a55c',
  ama:        '#5aab7a',
  halving:    '#c4675a',
};

export const EVENTS: CryptoEvent[] = [

  // ── January 2026 ──────────────────────────────────────────────────────────
  { id: 'e-jan-01', date: '2026-01-03', title: 'Bitcoin Genesis Block Day',        description: '17th anniversary of Satoshi mining Bitcoin block #0 on Jan 3, 2009.',                    type: 'milestone',   coinSymbol: 'BTC'  },
  { id: 'e-jan-02', date: '2026-01-07', title: 'Dogecoin Birthday',                description: 'Dogecoin was launched on Dec 6, 2013 — community celebrates its journey to legitimacy.',  type: 'milestone',   coinSymbol: 'DOGE' },
  { id: 'e-jan-03', date: '2026-01-12', title: 'Crypto Market Open 2026',          description: 'Traditional first full trading week of the year. Historically volatile with fresh capital inflows.',  type: 'milestone'  },
  { id: 'e-jan-04', date: '2026-01-19', title: 'World Economic Forum (Davos)',      description: 'Crypto regulation, CBDCs, and digital assets on the agenda at Davos 2026.',              type: 'conference'                    },
  { id: 'e-jan-05', date: '2026-01-24', title: 'Solana Foundation AMA',            description: 'Live Q&A with Solana Foundation on Firedancer progress and 2026 ecosystem roadmap.',      type: 'ama',         coinSymbol: 'SOL'  },
  { id: 'e-jan-06', date: '2026-01-28', title: 'BNB Chain Q1 Burn',               description: 'BNB quarterly token burn — supply reduction event tracked closely by holders.',            type: 'upgrade',     coinSymbol: 'BNB'  },

  // ── February 2026 ─────────────────────────────────────────────────────────
  { id: 'e-feb-01', date: '2026-02-04', title: 'Cardano Chang Hard Fork',          description: 'Cardano enters full decentralized governance — community votes on protocol parameters.',  type: 'upgrade',     coinSymbol: 'ADA'  },
  { id: 'e-feb-02', date: '2026-02-10', title: 'Bitcoin ETF Anniversary',          description: '2nd anniversary of the first US spot Bitcoin ETF approval — $50B+ AUM milestone watch.',  type: 'milestone',   coinSymbol: 'BTC'  },
  { id: 'e-feb-03', date: '2026-02-14', title: "Valentine's Day Market Watch",     description: 'Historically notable trading session. BTC and meme coins on watch for sentiment spikes.',  type: 'milestone', coinSymbol: 'BTC'  },
  { id: 'e-feb-04', date: '2026-02-18', title: 'XRP Ledger Upgrade',               description: 'XRP Ledger protocol upgrade — new AMM features and CBDC corridor improvements.',          type: 'upgrade',     coinSymbol: 'XRP'  },
  { id: 'e-feb-05', date: '2026-02-22', title: 'Algorand Governance Voting',       description: 'Algorand community governance vote — Q1 2026 measures on ecosystem funding.',             type: 'ama',         coinSymbol: 'ALGO' },
  { id: 'e-feb-06', date: '2026-02-26', title: 'Stellar Lumens AMA',               description: 'Stellar Development Foundation live AMA — cross-border payment partnerships update.',     type: 'ama',         coinSymbol: 'XLM'  },

  // ── March 2026 ────────────────────────────────────────────────────────────
  { id: 'e-mar-01', date: '2026-03-02', title: 'ETHDenver 2026 Opens',             description: "Ethereum's flagship developer conference opens in Denver, Colorado.",                      type: 'conference',  coinSymbol: 'ETH'  },
  { id: 'e-mar-02', date: '2026-03-07', title: 'ETHDenver 2026 Closes',            description: 'Final day of ETHDenver — hackathon results and $2M+ in prizes announced.',                type: 'conference',  coinSymbol: 'ETH'  },
  { id: 'e-mar-03', date: '2026-03-11', title: 'Uniswap v5 Launch',                description: 'Uniswap v5 goes live — hook-based architecture and native cross-chain swaps.',            type: 'upgrade',     coinSymbol: 'UNI'  },
  { id: 'e-mar-04', date: '2026-03-15', title: 'Aave v4 AMA',                      description: 'Aave community AMA on v4 liquidity layer and cross-chain borrowing design.',              type: 'ama',         coinSymbol: 'AAVE' },
  { id: 'e-mar-05', date: '2026-03-20', title: 'Ethereum Pectra Upgrade',          description: 'Major Ethereum upgrade — EIP-7702 account abstraction and EIP-4844 blob scaling v2.',     type: 'upgrade',     coinSymbol: 'ETH'  },
  { id: 'e-mar-06', date: '2026-03-25', title: 'MakerDAO Endgame Phase 2',         description: 'MakerDAO activates Endgame Phase 2 — SubDAO launches and NewStable rollout.',            type: 'upgrade',     coinSymbol: 'MKR'  },
  { id: 'e-mar-07', date: '2026-03-28', title: 'DeFi TVL Milestone Watch',         description: 'DeFi total value locked approaches $250B — community milestone tracking event.',          type: 'milestone'                     },

  // ── April 2026 ────────────────────────────────────────────────────────────
  { id: 'e-apr-01', date: '2026-04-03', title: 'Solana Firedancer Mainnet',        description: 'Firedancer validator client goes live on mainnet — targeting 1M TPS throughput.',        type: 'upgrade',     coinSymbol: 'SOL'  },
  { id: 'e-apr-02', date: '2026-04-08', title: 'Avalanche Durango Upgrade',        description: 'Avalanche network upgrade — Warp Messaging improvements and L1 subnet enhancements.',     type: 'upgrade',     coinSymbol: 'AVAX' },
  { id: 'e-apr-03', date: '2026-04-11', title: 'NEAR Sharding Phase 2',            description: 'NEAR activates dynamic sharding — network splits into 8 shards for higher throughput.',   type: 'upgrade',     coinSymbol: 'NEAR' },
  { id: 'e-apr-04', date: '2026-04-16', title: 'Aptos AIP Governance Vote',        description: 'Aptos community votes on AIP-150 — gas model improvements and parallel execution v2.',   type: 'ama',         coinSymbol: 'APT'  },
  { id: 'e-apr-05', date: '2026-04-18', title: 'DeFi Weekly AMA',                  description: 'Live AMA with Uniswap v5 and Aave v4 core developers on scaling and MEV mitigation.',     type: 'ama',         coinSymbol: 'UNI'  },
  { id: 'e-apr-06', date: '2026-04-22', title: 'Sui Mysticeti Upgrade',            description: 'Sui Mysticeti consensus upgrade — sub-100ms finality and object-level parallelism.',      type: 'upgrade',     coinSymbol: 'SUI'  },
  { id: 'e-apr-07', date: '2026-04-28', title: 'Speed Wars Community Recap',       description: 'End-of-month community discussion on L1 performance benchmarks: SOL vs AVAX vs SUI.',     type: 'ama'                           },

  // ── May 2026 ──────────────────────────────────────────────────────────────
  { id: 'e-may-01', date: '2026-05-01', title: 'ZK Summit 13',                     description: 'Zero-knowledge proof conference — Starknet, Scroll, Linea, zkSync presentations.',        type: 'conference',  coinSymbol: 'STRK' },
  { id: 'e-may-02', date: '2026-05-06', title: 'Arbitrum Stylus Expansion',        description: 'Arbitrum Stylus adds Rust and C++ smart contract support — DevX overhaul.',              type: 'upgrade',     coinSymbol: 'ARB'  },
  { id: 'e-may-03', date: '2026-05-12', title: 'Optimism Fault Proof V2',          description: 'OP Stack deploys Fault Proof V2 — full permissionless challenge mechanism live.',         type: 'upgrade',     coinSymbol: 'OP'   },
  { id: 'e-may-04', date: '2026-05-16', title: 'Polygon AggLayer Launch',          description: 'Polygon AggLayer aggregates L2 liquidity across 50+ ZK chains — unified UX milestone.',  type: 'upgrade',     coinSymbol: 'POL'  },
  { id: 'e-may-05', date: '2026-05-19', title: 'Consensus 2026 — Austin',          description: "The world's largest crypto conference returns to Austin, TX — 30,000+ attendees.",        type: 'conference'                    },
  { id: 'e-may-06', date: '2026-05-23', title: 'Starknet v0.14 Upgrade',           description: 'Starknet v0.14 — recursive STARK proofs and 10x throughput improvement.',                type: 'upgrade',     coinSymbol: 'STRK' },
  { id: 'e-may-07', date: '2026-05-27', title: 'L2 Fees Hit New Low',              description: 'Average L2 transaction fee below $0.001 milestone — rollup-centric future arrives.',      type: 'milestone'                     },

  // ── June 2026 ─────────────────────────────────────────────────────────────
  { id: 'e-jun-01', date: '2026-06-03', title: 'Solana Breakpoint 2026',           description: "Solana's annual developer summit — Firedancer benchmarks and SVM updates revealed.",      type: 'conference',  coinSymbol: 'SOL'  },
  { id: 'e-jun-02', date: '2026-06-08', title: 'Chainlink CCIP v2 Launch',         description: 'Chainlink CCIP v2 — cross-chain token transfers with guaranteed settlement.',             type: 'upgrade',     coinSymbol: 'LINK' },
  { id: 'e-jun-03', date: '2026-06-13', title: 'The Graph Protocol v2',            description: 'The Graph launches v2 query marketplace — decentralized indexing for all EVM chains.',    type: 'upgrade',     coinSymbol: 'GRT'  },
  { id: 'e-jun-04', date: '2026-06-17', title: 'API3 DAO Governance Vote',         description: 'API3 community vote on first-party oracle partnerships and dAPI expansion plans.',        type: 'ama',         coinSymbol: 'API3' },
  { id: 'e-jun-05', date: '2026-06-20', title: 'Chainlink SmartCon 2026',          description: 'Chainlink ecosystem summit — CCIP v2, Data Streams, and new oracle network designs.',    type: 'conference',  coinSymbol: 'LINK' },
  { id: 'e-jun-06', date: '2026-06-24', title: 'BAND Protocol Upgrade',            description: 'BandChain 3.0 — modular data oracle architecture with cross-chain VRF.',                 type: 'upgrade',     coinSymbol: 'BAND' },
  { id: 'e-jun-07', date: '2026-06-29', title: 'Oracle Economy AMA Recap',         description: 'Monthly community recap: oracle networks, real-world data, and blockchain automation.',   type: 'ama',         coinSymbol: 'LINK' },

  // ── July 2026 ─────────────────────────────────────────────────────────────
  { id: 'e-jul-01', date: '2026-07-01', title: 'Axie Infinity Season 10',          description: 'Axie Infinity Season 10 kicks off — new Lunacian chapters and AXS reward pools.',        type: 'milestone',   coinSymbol: 'AXS'  },
  { id: 'e-jul-02', date: '2026-07-04', title: 'Independence Day Rally',           description: 'Historically bullish US trading day for crypto markets — BTC and meme coins on watch.',   type: 'milestone',   coinSymbol: 'BTC'  },
  { id: 'e-jul-03', date: '2026-07-09', title: 'The Sandbox LAND Sale',            description: 'The Sandbox hosts its largest-ever virtual land sale — metaverse parcels auction.',       type: 'milestone',   coinSymbol: 'SAND' },
  { id: 'e-jul-04', date: '2026-07-15', title: 'Immutable X zkEVM v2',             description: 'ImmutableX zkEVM v2 — carbon-neutral gaming transactions with native NFT standards.',     type: 'upgrade',     coinSymbol: 'IMX'  },
  { id: 'e-jul-05', date: '2026-07-19', title: 'GALA Games Festival',              description: 'Annual Gala Games community festival — new title announcements and GALA staking rewards.',  type: 'conference', coinSymbol: 'GALA' },
  { id: 'e-jul-06', date: '2026-07-23', title: 'Decentraland DAO Vote',            description: 'Decentraland governance vote on wearables marketplace fees and MANA emission schedule.',   type: 'ama',         coinSymbol: 'MANA' },
  { id: 'e-jul-07', date: '2026-07-28', title: 'P2E Market Report Q2',             description: 'Industry-wide Play-to-Earn market report — active wallets, volume, and top games.',       type: 'milestone'                     },

  // ── August 2026 ───────────────────────────────────────────────────────────
  { id: 'e-aug-01', date: '2026-08-04', title: 'Filecoin FVM v2',                  description: 'Filecoin Virtual Machine v2 — native smart contracts for decentralized storage deals.',   type: 'upgrade',     coinSymbol: 'FIL'  },
  { id: 'e-aug-02', date: '2026-08-05', title: 'Ethereum Merge Anniversary',       description: '4th anniversary of Ethereum transitioning to proof-of-stake on Sep 15, 2022.',           type: 'milestone',   coinSymbol: 'ETH'  },
  { id: 'e-aug-03', date: '2026-08-10', title: 'Arweave Permaweb Summit',          description: 'Arweave annual conference on permanent web infrastructure and AO compute layer.',         type: 'conference',  coinSymbol: 'AR'   },
  { id: 'e-aug-04', date: '2026-08-16', title: 'Render Network v3',                description: 'Render Network v3 — Apple Metal integration and real-time AI rendering marketplace.',    type: 'upgrade',     coinSymbol: 'RNDR' },
  { id: 'e-aug-05', date: '2026-08-19', title: 'Akash Network DeAI Launch',        description: 'Akash Network launches DeAI marketplace — decentralized GPU inference for AI models.',   type: 'upgrade',     coinSymbol: 'AKT'  },
  { id: 'e-aug-06', date: '2026-08-23', title: 'DePIN Summit 2026',                description: 'First dedicated Decentralized Physical Infrastructure conference — Filecoin, Helium, Render.', type: 'conference'              },
  { id: 'e-aug-07', date: '2026-08-28', title: 'Hedera Governing Council Vote',    description: 'Hedera Governing Council quarterly vote on treasury allocation and network upgrades.',    type: 'ama',         coinSymbol: 'HBAR' },

  // ── September 2026 ────────────────────────────────────────────────────────
  { id: 'e-sep-01', date: '2026-09-05', title: 'Polkadot JAM Upgrade',             description: 'Polkadot JAM (Join Accumulate Machine) goes live — replaces Relay Chain with CoreChains.', type: 'upgrade',   coinSymbol: 'DOT'  },
  { id: 'e-sep-02', date: '2026-09-09', title: 'Cosmos IBC v3 Launch',             description: 'IBC v3 — native fee abstraction and cross-chain smart contract calls between Cosmos chains.', type: 'upgrade',  coinSymbol: 'ATOM' },
  { id: 'e-sep-03', date: '2026-09-12', title: 'TOKEN2049 Singapore',              description: "Asia's premier crypto conference at Marina Bay Sands — 20,000+ attendees expected.",       type: 'conference'                    },
  { id: 'e-sep-04', date: '2026-09-16', title: 'TON Foundation AMA',               description: 'Telegram Open Network Foundation AMA — TON Space wallet and mini-app ecosystem update.',  type: 'ama',         coinSymbol: 'TON'  },
  { id: 'e-sep-05', date: '2026-09-20', title: 'TRON Energy Upgrade',              description: 'TRON network energy model upgrade — new staking v3 and bandwidth allocation system.',     type: 'upgrade',     coinSymbol: 'TRX'  },
  { id: 'e-sep-06', date: '2026-09-24', title: 'BNB Chain Greenfield v2',          description: 'BNB Greenfield decentralized storage v2 — EVM programmability and data NFTs.',           type: 'upgrade',     coinSymbol: 'BNB'  },
  { id: 'e-sep-07', date: '2026-09-28', title: 'Cross-Chain Bridge Audit Report',  description: 'Industry-wide annual bridge security audit results — TVL, exploits, and best practices.', type: 'milestone'                    },

  // ── October 2026 ──────────────────────────────────────────────────────────
  { id: 'e-oct-01', date: '2026-10-05', title: 'Monero Seraphis Upgrade',          description: 'Monero Seraphis hard fork — next-generation stealth address and ring signature system.',  type: 'upgrade',     coinSymbol: 'XMR'  },
  { id: 'e-oct-02', date: '2026-10-09', title: 'Zcash Proof of Stake Migration',   description: 'Zcash activates PoS consensus — major protocol transition from PoW.',                    type: 'upgrade',     coinSymbol: 'ZEC'  },
  { id: 'e-oct-03', date: '2026-10-14', title: 'Secret Network v3',                description: 'Secret Network v3 — confidential computing upgrades and cross-chain private bridges.',    type: 'upgrade',     coinSymbol: 'SCRT' },
  { id: 'e-oct-04', date: '2026-10-19', title: 'ENS DAO Annual Report',            description: 'Ethereum Name Service DAO publishes annual report — registrations, integrations, revenue.', type: 'ama',       coinSymbol: 'ENS'  },
  { id: 'e-oct-05', date: '2026-10-22', title: 'Privacy Summit 2026',              description: 'Annual privacy-focused blockchain conference — ZK proofs, confidential DeFi, and regulation.',  type: 'conference'              },
  { id: 'e-oct-06', date: '2026-10-27', title: 'Blur NFT Season Drop',             description: 'Blur marketplace launches Season 4 — trader points, airdrop, and new creator tools.',    type: 'milestone',   coinSymbol: 'BLUR' },
  { id: 'e-oct-07', date: '2026-10-31', title: 'Bitcoin Whitepaper Day',           description: '18th anniversary of Satoshi Nakamoto publishing the Bitcoin whitepaper on Oct 31, 2008.',  type: 'milestone',  coinSymbol: 'BTC'  },

  // ── November 2026 ─────────────────────────────────────────────────────────
  { id: 'e-nov-01', date: '2026-11-04', title: 'GMX v3 Launch',                    description: 'GMX v3 — synthetic asset trading and multi-collateral perpetuals on Arbitrum.',           type: 'upgrade',     coinSymbol: 'GMX'  },
  { id: 'e-nov-02', date: '2026-11-08', title: 'dYdX Chain v4 Upgrade',            description: 'dYdX v4 — off-chain order book with on-chain settlement and validator incentives.',       type: 'upgrade',     coinSymbol: 'DYDX' },
  { id: 'e-nov-03', date: '2026-11-12', title: 'Devcon 8 Bangkok',                 description: 'Ethereum Foundation developer conference — Vitalik keynote and 2027 roadmap revealed.',   type: 'conference',  coinSymbol: 'ETH'  },
  { id: 'e-nov-04', date: '2026-11-16', title: 'Synthetix v4 Perps',              description: 'Synthetix v4 perpetuals — shared liquidity model and native cross-chain collateral.',     type: 'upgrade',     coinSymbol: 'SNX'  },
  { id: 'e-nov-05', date: '2026-11-19', title: 'Curve DAO Gauge Vote',             description: 'Curve monthly gauge weight vote — $2B+ in liquidity directed by veCRV holders.',         type: 'ama',         coinSymbol: 'CRV'  },
  { id: 'e-nov-06', date: '2026-11-23', title: 'Advanced DeFi Summit',             description: 'Community virtual summit on perpetuals, options, structured products, and yield vaults.',  type: 'conference'                    },
  { id: 'e-nov-07', date: '2026-11-27', title: 'Yearn Finance v4',                 description: 'Yearn Finance v4 — modular vault architecture and automated multi-chain yield strategies.', type: 'upgrade',   coinSymbol: 'YFI'  },

  // ── December 2026 ─────────────────────────────────────────────────────────
  { id: 'e-dec-01', date: '2026-12-03', title: 'Ronin Network v2',                 description: 'Ronin Network v2 — permissionless validator set and native cross-chain bridge.',          type: 'upgrade',     coinSymbol: 'RON'  },
  { id: 'e-dec-02', date: '2026-12-07', title: 'Illuvium Open World Beta',         description: 'Illuvium Open World game enters open beta — 3D exploration and ILV land staking.',        type: 'milestone',   coinSymbol: 'ILV'  },
  { id: 'e-dec-03', date: '2026-12-10', title: 'Gods Unchained World Championship', description: 'Annual Gods Unchained esports championship — $500K prize pool in GODS tokens.',         type: 'milestone',   coinSymbol: 'GODS' },
  { id: 'e-dec-04', date: '2026-12-15', title: 'SushiSwap v4 Trident',             description: 'SushiSwap Trident v4 — concentrated liquidity and native limit orders on all chains.',   type: 'upgrade',     coinSymbol: 'SUSHI'},
  { id: 'e-dec-05', date: '2026-12-19', title: 'Loopring zkEVM Expansion',         description: 'Loopring launches zkEVM L2 — full EVM compatibility with ZK rollup security.',           type: 'upgrade',     coinSymbol: 'LRC'  },
  { id: 'e-dec-06', date: '2026-12-23', title: 'Crypto Year in Review 2026',       description: 'Industry-wide annual review — top protocols, milestones, hacks, and breakout narratives.', type: 'milestone'                    },
  { id: 'e-dec-07', date: '2026-12-25', title: 'Christmas Rally',                  description: 'Year-end crypto market rally — a beloved community tradition since 2017.',                type: 'milestone',   coinSymbol: 'BTC'  },
  { id: 'e-dec-08', date: '2026-12-31', title: 'Cryptoverse Year in Review',       description: 'Complete your final 2026 quiz and review your full learning journey.',                    type: 'milestone'                     },
];

// Index by date string for O(1) lookup in the calendar grid
export const EVENTS_BY_DATE: Record<string, CryptoEvent[]> = {};
EVENTS.forEach((e) => {
  if (!EVENTS_BY_DATE[e.date]) EVENTS_BY_DATE[e.date] = [];
  EVENTS_BY_DATE[e.date].push(e);
});
