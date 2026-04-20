export interface Concept {
  id: string;
  title: string;
  category: string;
  emoji: string;
  intro: string;
  body: string[];
  keyPoints: string[];
  coinSymbol?: string;
}

export const CONCEPTS: Record<string, Concept> = {

  'blockchain-basics': {
    id: 'blockchain-basics',
    title: 'What is a Blockchain?',
    category: 'Foundations',
    emoji: '⛓️',
    intro: 'A blockchain is a tamper-proof digital ledger shared across thousands of computers simultaneously — owned by no one, readable by everyone.',
    body: [
      'Imagine a Google spreadsheet that millions of people can read but no single person can edit — and where every change is logged permanently. That\'s the basic idea behind a blockchain. It stores records in chronological "blocks," where each block is cryptographically sealed to the one before it, forming a chain.',
      'Because this ledger is distributed across thousands of independent nodes, there\'s no single server to hack, no company to pressure, and no database to corrupt. To change a past record, you\'d need to overwrite it on more than half the network simultaneously — computationally impossible at scale.',
      'This architecture enables trust between strangers. Two people who have never met and don\'t trust each other can transact directly, knowing the blockchain enforces the rules and records the outcome forever. This is why Bitcoin\'s creator Satoshi Nakamoto called it a "peer-to-peer electronic cash system."',
    ],
    keyPoints: [
      'Blocks link cryptographically — changing one breaks all subsequent blocks',
      'No central server means no single point of failure or control',
      'Enables trustless transactions between strangers without intermediaries',
    ],
    coinSymbol: 'BTC',
  },

  'distributed-ledger': {
    id: 'distributed-ledger',
    title: 'Distributed Ledgers & Nodes',
    category: 'Foundations',
    emoji: '🌐',
    intro: 'A blockchain lives simultaneously on thousands of computers called nodes — each holding an identical copy of every transaction ever made.',
    body: [
      'In a traditional bank, one central database stores all records. The bank controls that data and you trust them to protect it. A distributed ledger flips this model: instead of one server, there are thousands — spread across countries, run by different organizations and individuals.',
      'Every node independently verifies new transactions before they\'re added. If a bad actor tries to submit a fraudulent transaction, the other nodes reject it. You\'d need to control more than 50% of the network\'s resources simultaneously to force through a false record — the famous "51% attack."',
      'Different blockchains have different numbers of nodes. Bitcoin has tens of thousands of full nodes. Ethereum has over 800,000 validators. The more nodes, the more decentralized and censorship-resistant the network — but also the harder it is to achieve fast consensus.',
    ],
    keyPoints: [
      'Every node stores a complete copy of the blockchain independently',
      'New transactions require majority validation before being accepted',
      'More nodes = greater decentralization and security against attacks',
    ],
    coinSymbol: 'BTC',
  },

  'cryptographic-hash': {
    id: 'cryptographic-hash',
    title: 'Hash Functions',
    category: 'Cryptography',
    emoji: '#️⃣',
    intro: 'Hash functions are the mathematical glue holding every blockchain together — turning any data into a unique, fixed-length fingerprint.',
    body: [
      'A hash function takes any input — a word, a file, an entire transaction history — and converts it to a fixed-length string of characters. Bitcoin\'s SHA-256 always produces a 64-character output, no matter if the input is one byte or one gigabyte. Change even a single character in the input and the output changes completely and unpredictably.',
      'This property is what links blocks together. Each block contains the hash of the previous block. If you tamper with block 500, its hash changes — which breaks block 501, 502, and every block after. To rewrite history, you\'d have to recalculate every subsequent block faster than the whole network is adding new ones. This is why blockchain history is effectively immutable.',
      'Hashing is also a one-way function: you can\'t reverse-engineer the input from the output. This is why passwords are stored as hashes, and why Bitcoin mining is essentially a hash-guessing competition — miners compete to find an input that produces a hash starting with a specific number of zeros.',
    ],
    keyPoints: [
      'Any input produces a unique, fixed-length fingerprint',
      'Changing one character completely changes the output — "avalanche effect"',
      'One-way function: computationally impossible to reverse-engineer the input',
    ],
    coinSymbol: 'BTC',
  },

  'public-key-crypto': {
    id: 'public-key-crypto',
    title: 'Public Key Cryptography',
    category: 'Cryptography',
    emoji: '🔑',
    intro: 'Public key cryptography lets two strangers communicate securely — and is the foundation of every crypto wallet and digital signature.',
    body: [
      'Every crypto wallet has two keys: a public key (like your email address — share it freely) and a private key (like your password — never share it). Your public key is used to derive your wallet address, which people use to send you funds. Your private key is what proves you own those funds and authorizes spending them.',
      'The math behind this is elegant: it\'s trivially easy to derive a public key from a private key, but computationally impossible to go the other direction. This is based on the "trapdoor problem" — mathematical operations easy in one direction but practically irreversible in the other. Bitcoin uses elliptic curve cryptography (ECDSA) over the secp256k1 curve.',
      'For context on the security: cracking a private key from its public key would require testing 2^256 possible values. Even if every computer on Earth had been running since the Big Bang, they\'d have barely scratched the surface. Your wallet is secure not because of any company\'s protection — but because of mathematics.',
    ],
    keyPoints: [
      'Public key = your address (shareable); private key = your password (never share)',
      'Deriving public from private is easy; going backwards is computationally impossible',
      'Based on elliptic curve cryptography — security backed by pure mathematics',
    ],
    coinSymbol: 'ETH',
  },

  'digital-signatures': {
    id: 'digital-signatures',
    title: 'Wallets & Digital Signatures',
    category: 'Cryptography',
    emoji: '✍️',
    intro: 'Your private key lets you prove ownership without revealing the key itself — through cryptographic digital signatures.',
    body: [
      'When you send crypto, you\'re not transferring coins directly — you\'re broadcasting a digitally signed message: "I, the owner of address X, authorize sending Y coins to address Z." Your private key creates a unique signature for this exact transaction. The network verifies the signature against your public key without ever seeing your private key.',
      'A wallet app is really just a key manager. It stores your private key and uses it to sign transactions on your behalf. "Losing your wallet" means losing access to your private key. There are no "forgot password" flows on a blockchain — whoever has the key has the coins, full stop. This is why "not your keys, not your coins" is a cardinal rule in crypto.',
      'This is why hardware wallets (Ledger, Trezor) exist: they keep your private key inside a dedicated, airgapped device, never exposing it to an internet-connected computer. Even if your laptop is fully compromised by malware, an attacker cannot steal keys that never leave the hardware device.',
    ],
    keyPoints: [
      'Transactions are signed messages authorizing transfers — not direct coin moves',
      'Private key creates signatures; the network verifies using only your public key',
      'Losing your private key = permanently losing access to your funds — no recovery',
    ],
    coinSymbol: 'ETH',
  },

  'consensus-overview': {
    id: 'consensus-overview',
    title: 'Consensus Mechanisms',
    category: 'Consensus',
    emoji: '🤝',
    intro: 'How do thousands of strangers agree on the same truth without trusting each other? That\'s the consensus problem — and every blockchain solves it differently.',
    body: [
      'In a decentralized network, there\'s no central authority to declare "this is the correct record." Instead, nodes must reach agreement through a protocol — a set of rules determining which proposed block gets added to the chain. This is the consensus mechanism, and getting it right is one of the hardest problems in distributed computing.',
      'The blockchain trilemma — described by Vitalik Buterin — states that blockchains can only optimize two of three properties at once: security, decentralization, and scalability. Bitcoin maximizes security + decentralization. Solana maximizes security + scalability. The "right" balance depends on the use case.',
      'The two dominant approaches are Proof of Work (PoW) and Proof of Stake (PoS). PoW (Bitcoin) makes nodes compete to solve computational puzzles. PoS (Ethereum, Solana, Cardano) requires nodes to lock up tokens as collateral. Newer variants include Proof of History (Solana), Avalanche Consensus, and Nominated Proof of Stake (Polkadot).',
    ],
    keyPoints: [
      'Consensus: leaderless nodes agreeing on a single correct state',
      'The Blockchain Trilemma: security vs. decentralization vs. scalability — pick two',
      'PoW uses computation; PoS uses economic collateral; newer mechanisms blend both',
    ],
    coinSymbol: 'ETH',
  },

  'proof-of-work': {
    id: 'proof-of-work',
    title: 'Proof of Work',
    category: 'Consensus',
    emoji: '⛏️',
    intro: 'Bitcoin\'s Proof of Work is one of the most elegant solutions to Byzantine fault tolerance — and the most energy-intensive consensus mechanism ever built.',
    body: [
      'In PoW, "miners" compete to add the next block by repeatedly hashing transaction data until they find an output below a target value — the current difficulty. This is like rolling a billion-sided die until you roll below 1000: pure luck, but with enough dice rolls (compute power), someone wins every ~10 minutes. The winner broadcasts their solution and earns the block reward (currently 3.125 BTC).',
      'Other nodes can verify a valid solution in milliseconds (verifying a hash is trivial; finding it is hard). This asymmetry is deliberate — verification must be cheap to keep the network decentralized, while block production must be expensive to prevent spam and ensure commitment.',
      'The immutability guarantee comes from accumulated work. To rewrite 6 past Bitcoin blocks, you\'d need more compute power than the entire rest of the network and the time to redo all that work — currently estimated to cost billions of dollars. This "work" is Bitcoin\'s security budget, funded by block rewards and transaction fees.',
    ],
    keyPoints: [
      'Miners race to find hash inputs meeting a difficulty target — pure computation',
      'Verification is trivial; solution-finding is intentionally hard',
      'Immutability guaranteed by accumulated computational work being too expensive to redo',
    ],
    coinSymbol: 'BTC',
  },

  'proof-of-stake': {
    id: 'proof-of-stake',
    title: 'Proof of Stake',
    category: 'Consensus',
    emoji: '🥩',
    intro: 'Instead of burning electricity, Proof of Stake uses economic collateral — validators lock up tokens and risk losing them if they cheat.',
    body: [
      'In PoS, validators are chosen to propose and attest to new blocks based on how much stake they\'ve locked up. Ethereum requires 32 ETH to run a validator node. The protocol pseudo-randomly selects validators to propose blocks, weighted by stake size. Thousands of validators attest to each block before it\'s finalized.',
      'The key security mechanism is "slashing." If a validator tries to approve fraudulent transactions or double-vote (sign two conflicting blocks), the protocol automatically destroys a portion of their stake — up to 100% for severe offenses. This makes attacks economically self-defeating: you\'d need to stake billions, then watch your stake get slashed.',
      'PoS is roughly 99.95% more energy-efficient than PoW. Ethereum\'s switch to PoS in September 2022 (the Merge) reduced its energy consumption from that of a small country to roughly a large office building. Today, virtually every new Layer 1 blockchain uses PoS or a variant of it.',
    ],
    keyPoints: [
      'Validators stake tokens as collateral — they lose it if they act dishonestly',
      'Slashing automatically punishes validators who try to cheat or double-sign',
      '99.95% more energy-efficient than Proof of Work',
    ],
    coinSymbol: 'ETH',
  },

  'transaction-finality': {
    id: 'transaction-finality',
    title: 'Transaction Finality',
    category: 'Consensus',
    emoji: '✅',
    intro: 'In traditional finance a payment "clears" after days — blockchain finality describes how quickly a transaction becomes permanent and irreversible.',
    body: [
      'Finality describes how certain you can be that a transaction is permanently recorded and cannot be reversed. In traditional banking, ACH transfers take 1-3 days to settle. Bitcoin achieves probabilistic finality after 6 confirmations (~60 minutes). Ethereum achieves economic finality in ~15 minutes. Solana achieves finality in ~400ms.',
      'Different blockchains have fundamentally different finality models. Bitcoin uses probabilistic finality — each additional block makes a reversal exponentially more expensive, but never 100% impossible. Ethereum uses economic finality — after "checkpointing," reversing would require destroying at least 1/3 of all staked ETH, which is economically catastrophic.',
      'The risk in the pre-finality window is a "double-spend" — broadcasting two conflicting transactions before either is finalized. This is why exchanges require multiple confirmations before crediting funds. Faster finality enables real-time payments and reduces settlement risk. It\'s one of the key competitive advantages of newer L1s like Solana, AVAX, and NEAR.',
    ],
    keyPoints: [
      'Finality = certainty that a transaction is permanent and irreversible',
      'Bitcoin ~60 min (probabilistic), Ethereum ~15 min, Solana ~400ms',
      'Faster finality enables real-time payments and reduces double-spend risk',
    ],
    coinSymbol: 'SOL',
  },

  'smart-contracts': {
    id: 'smart-contracts',
    title: 'Smart Contracts',
    category: 'Foundations',
    emoji: '📜',
    intro: 'Smart contracts are code that runs on a blockchain — self-executing agreements that enforce themselves without lawyers, banks, or intermediaries.',
    body: [
      'Nick Szabo coined the term "smart contract" in 1994 — a decade before Bitcoin. The idea: encode the terms of an agreement in software, so it executes automatically when conditions are met, without lawyers, banks, or courts. Vitalik Buterin\'s Ethereum made this practical at scale starting in 2015.',
      'A smart contract is a program stored at an address on the blockchain. When you send a transaction to it, the contract\'s code runs — it can hold tokens, send tokens, store data, and call other contracts. Once deployed, no one can change it (unless the contract itself has upgrade logic). The code is the law.',
      'Smart contracts power everything in Web3: DEXes (Uniswap), lending markets (Aave), stablecoins (DAI), NFT marketplaces, DAOs, and more. They\'re the primitive that turns a blockchain into a programmable financial platform. Ethereum alone has processed trillions of dollars in smart contract value since 2015.',
    ],
    keyPoints: [
      'Self-executing code stored on-chain — no intermediary can stop or alter it',
      'Deployed contracts are immutable by default — code is law',
      'The foundational primitive for DeFi, NFTs, DAOs, and all of Web3',
    ],
    coinSymbol: 'ETH',
  },

  'gas-fees': {
    id: 'gas-fees',
    title: 'Gas Fees & Transaction Costs',
    category: 'Foundations',
    emoji: '⛽',
    intro: 'Every computation on a blockchain costs "gas" — the mechanism that prevents spam and compensates the validators doing the work.',
    body: [
      'Gas is the unit measuring the computational work required to execute a transaction or smart contract call. A simple ETH transfer costs 21,000 gas. A complex DeFi swap might cost 200,000+ gas. Your actual fee = gas used × gas price. Gas price is set by market demand — when the network is congested, users bid higher to get priority.',
      'Ethereum\'s EIP-1559 (August 2021) introduced a base fee that burns automatically, plus an optional priority tip to validators. The base fee adjusts algorithmically based on block fullness — predictable pricing instead of unpredictable auctions. Burning fees also made ETH potentially deflationary during periods of high activity.',
      'L2 networks (Arbitrum, Optimism, Base) execute transactions off the main chain and post compressed proofs to Ethereum — this is why L2 fees can be 10-100x cheaper. Solana charges fractions of a cent per transaction because parallel execution lets it handle many transactions simultaneously without bidding wars.',
    ],
    keyPoints: [
      'Gas = unit of computation; fee = gas used × current gas price',
      'EIP-1559 burns base fees — created ETH\'s deflationary "ultrasound money" narrative',
      'L2s and high-throughput L1s achieve drastically lower fees through different architectures',
    ],
    coinSymbol: 'ETH',
  },

  'defi-overview': {
    id: 'defi-overview',
    title: 'What is DeFi?',
    category: 'DeFi',
    emoji: '🏦',
    intro: 'Decentralized Finance recreates banking, lending, and trading using smart contracts — open to anyone with an internet connection, 24/7.',
    body: [
      'DeFi is the umbrella term for financial applications built on public blockchains. No accounts, no credit checks, no business hours. A farmer in Nigeria and a hedge fund in New York access the same lending protocol at the same rates. The protocol\'s code treats both identically — it doesn\'t know and doesn\'t care who you are.',
      'The DeFi ecosystem includes DEXes (peer-to-peer token swaps), lending/borrowing markets (deposit crypto as collateral, borrow other assets), stablecoins (algorithmic or collateral-backed dollar pegs), and yield strategies (automated compound interest). At peak in late 2021, DeFi protocols managed over $180 billion in assets.',
      'DeFi is composable — protocols interlock like financial Lego. Deposit ETH into Lido to get stETH (liquid staking token). Deposit stETH into Aave to borrow USDC. Use USDC in Curve for yield. Each layer adds complexity and yield — but also cascading risk when one component fails.',
    ],
    keyPoints: [
      'Financial services built on smart contracts — no banks, no gatekeepers',
      'Core primitives: DEXes, lending markets, stablecoins, yield protocols',
      'Composability: protocols stack on each other like financial Lego',
    ],
    coinSymbol: 'ETH',
  },

  'amm': {
    id: 'amm',
    title: 'Automated Market Makers',
    category: 'DeFi',
    emoji: '🔄',
    intro: 'How do you trade without an order book? AMMs replace both buyers and sellers with a mathematical formula that prices tokens automatically.',
    body: [
      'Traditional exchanges use order books — buyers and sellers post bids and asks, and trades happen when they match. This requires willing market makers. AMMs eliminate market makers entirely: a smart contract holds two tokens in a "liquidity pool" and prices them using a formula. Uniswap\'s constant product formula is elegant: x × y = k, where x and y are token reserves.',
      'Buy ETH from the pool → ETH reserves decrease, USDC reserves increase, price adjusts automatically per the formula. The larger the trade relative to the pool size, the worse the effective price you receive — called "slippage." More liquidity in the pool = less slippage for any given trade size.',
      'Anyone can become a market maker by depositing equal value of both tokens into a pool. In return, they earn a share of every trading fee. The risk: "impermanent loss" — if the price ratio of the two tokens changes significantly, you\'d have been better off just holding them. Managing impermanent loss is the core challenge for liquidity providers.',
    ],
    keyPoints: [
      'Prices set by math (x × y = k), not order books or human market makers',
      'Larger trades relative to pool size cause more slippage — price impact',
      'LPs earn trading fees but risk impermanent loss when token ratios shift',
    ],
    coinSymbol: 'UNI',
  },

  'liquidity-pools': {
    id: 'liquidity-pools',
    title: 'Liquidity Pools',
    category: 'DeFi',
    emoji: '💧',
    intro: 'Liquidity pools are the fuel powering decentralized exchanges — democratizing market-making and earning passive yield for depositors.',
    body: [
      'A liquidity pool is a smart contract holding pairs of tokens — ETH/USDC, BTC/ETH, etc. Traders swap against this pool; liquidity providers (LPs) supply the tokens and earn a portion of every trade fee. Uniswap v3 pools handle billions in daily volume with entirely algorithmic pricing, no humans required.',
      'Uniswap v3 introduced concentrated liquidity: LPs specify a price range where their capital is active. If ETH trades between $2800-3200, you deploy all your capital in that range — earning far more fees per dollar than a full-range position. But if price moves outside your range, you earn nothing until it returns. This improves capital efficiency but requires active management.',
      'Total Value Locked (TVL) is the key metric for DeFi protocol health — measuring how much capital is deposited. At peak, DeFi had $180B+ TVL. Protocol incentive programs (liquidity mining) attract TVL by rewarding LPs with governance tokens on top of trading fees. This "vampire attack" mechanic drove the DeFi summer of 2020.',
    ],
    keyPoints: [
      'LPs deposit token pairs and earn a share of every trade\'s fee',
      'Concentrated liquidity maximizes capital efficiency — but narrows the profitable range',
      'TVL measures protocol health; liquidity mining uses token rewards to attract LPs',
    ],
    coinSymbol: 'UNI',
  },

  'layer2-overview': {
    id: 'layer2-overview',
    title: 'Layer 2 Scaling',
    category: 'Scaling',
    emoji: '🚀',
    intro: 'Layer 2s solve Ethereum\'s scalability without compromising its security — by executing transactions off-chain and settling proofs on-chain.',
    body: [
      'Ethereum processes about 15-30 transactions per second at costs that spike to $50+ during congestion. The solution isn\'t to change Ethereum L1 (which would sacrifice security and decentralization) — it\'s to build "Layer 2" networks that execute transactions faster and cheaper, then batch-settle to Ethereum as the final arbiter.',
      'There are two main L2 types: Optimistic Rollups (Arbitrum, Optimism, Base) assume transactions are valid by default, with a 7-day challenge window where fraud proofs can be submitted. ZK Rollups (zkSync, Starknet, Scroll) generate cryptographic proofs of validity for every batch — mathematically guaranteed to be correct, with no challenge window needed.',
      'L2s achieve 2,000-10,000+ TPS at 10-100x lower fees than Ethereum mainnet, while inheriting Ethereum\'s full security guarantees. Base (Coinbase\'s L2) now processes more transactions per day than Ethereum mainnet. This is how Ethereum scales to global adoption: L1 becomes a settlement layer; L2s are where most activity happens.',
    ],
    keyPoints: [
      'L2s execute off-chain and settle to Ethereum — speed without sacrificing security',
      'Optimistic: assume valid, 7-day fraud window. ZK: prove validity cryptographically',
      'Ethereum\'s endgame: settlement layer for a constellation of L2 ecosystems',
    ],
    coinSymbol: 'ARB',
  },

  'rollups': {
    id: 'rollups',
    title: 'Rollups Explained',
    category: 'Scaling',
    emoji: '🗜️',
    intro: 'Rollups compress thousands of transactions into a single proof posted to Ethereum — the most important scaling breakthrough in blockchain history.',
    body: [
      'The key insight: you don\'t need every Ethereum node to execute every transaction. You just need proof those transactions were executed correctly. Rollups execute transactions on a separate chain, then post compressed data + a proof to Ethereum. Ethereum nodes verify the proof — they don\'t re-execute the transactions.',
      'Optimistic rollups (Arbitrum, Optimism, Base) post transaction data but no cryptographic proof — they rely on "fraud proofs" submitted during a 7-day challenge window. If no one disputes a batch, it\'s accepted. This simplicity makes them highly EVM-compatible. ZK rollups (zkSync Era, Starknet, Scroll) generate a mathematical validity proof for every batch — instant finality, but complex to build.',
      'Rollups have become the dominant scaling approach. Base (Coinbase) regularly processes more daily transactions than Ethereum mainnet. Arbitrum handles 10x+ more daily transactions than Ethereum L1. EIP-4844 (Proto-Danksharding), deployed in March 2024, introduced "blobs" that cut L2 data posting costs by 10x, further improving rollup economics.',
    ],
    keyPoints: [
      'Rollups execute off-chain but post compressed data + proofs to Ethereum',
      'Optimistic: trust then challenge (7 days). ZK rollups: prove then trust (instant)',
      'Base and Arbitrum already process more transactions than Ethereum L1',
    ],
    coinSymbol: 'ARB',
  },

  'zk-proofs': {
    id: 'zk-proofs',
    title: 'Zero-Knowledge Proofs',
    category: 'Cryptography',
    emoji: '🔮',
    intro: 'ZK proofs let you prove you know something without revealing what you know — one of the most powerful cryptographic tools ever invented.',
    body: [
      'Imagine proving you know a password without typing it, or proving you\'re over 18 without showing your ID. Zero-knowledge proofs make this possible: you can prove a statement is true while revealing zero information about the underlying data. "I know the private key for this address" — proven, without showing the key. "This batch of 10,000 transactions is valid" — proven, without revealing any transaction.',
      'In blockchain, ZK proofs are used in two key ways. For privacy: Zcash uses ZK-SNARKs to hide transaction amounts and addresses. For scaling: ZK rollups use ZK proofs to validate batches of transactions on Ethereum without re-executing them. Both use the same core cryptography — proving statements about hidden data.',
      'ZK technology is advancing rapidly. STARKs (used by Starknet) don\'t require a trusted setup and are quantum-resistant. Recursive proofs allow proofs of proofs — verifying millions of transactions in a single on-chain verification. zkLogin (Sui) uses ZK proofs to let users sign in with Google while preserving blockchain-level privacy.',
    ],
    keyPoints: [
      'Prove knowledge of a secret without revealing the secret itself',
      'Two blockchain applications: privacy (hide amounts) and scaling (prove batch validity)',
      'STARKs, SNARKs, and recursive proofs represent the frontier of ZK technology',
    ],
    coinSymbol: 'STRK',
  },

  'sharding': {
    id: 'sharding',
    title: 'Sharding',
    category: 'Scaling',
    emoji: '🔀',
    intro: 'Sharding splits a blockchain\'s workload across many parallel chains — like upgrading from a single-lane highway to a 64-lane freeway.',
    body: [
      'In a standard blockchain, every node processes every transaction. This is why Ethereum is limited to ~30 TPS — all 800,000 validators verify every transaction. Sharding solves this by splitting the network into "shards" — subsets of validators that each handle a portion of the transaction and state load independently.',
      'NEAR\'s Nightshade sharding is a production implementation: NEAR splits state and execution across shards, with validators assigned to shard subsets. With 4 shards, 4 transactions can process in parallel. NEAR plans 100 shards eventually — theoretically 100x throughput with the same validator count. Dynamic resharding adapts shard count to network load.',
      'Ethereum pivoted away from execution sharding toward "danksharding" — focused on data availability rather than execution (with L2 rollups handling execution). EIP-4844 launched "blobs," the first step toward full danksharding, dramatically reducing L2 data costs and setting up Ethereum for 100,000+ TPS through the rollup ecosystem.',
    ],
    keyPoints: [
      'Shards split the network so validators only process their assigned subset of transactions',
      'NEAR uses Nightshade sharding — live on mainnet with plans for dynamic resharding',
      'Ethereum pivoted to data sharding (Danksharding) to support its L2 rollup ecosystem',
    ],
    coinSymbol: 'NEAR',
  },

  'parallel-execution': {
    id: 'parallel-execution',
    title: 'Parallel Execution',
    category: 'Scaling',
    emoji: '⚡',
    intro: 'Most blockchains execute transactions one by one — parallel execution runs thousands simultaneously, like a multi-core processor vs. a single core.',
    body: [
      'Ethereum processes transactions sequentially — one after another within each block. This is safe because sequential execution prevents conflicting state changes. But it\'s slow: one complex DeFi transaction can block hundreds of simple transfers queued behind it. The theoretical maximum is constrained by a single execution thread.',
      'Solana pioneered parallel execution with Sealevel — a runtime that analyzes which transactions access the same state. If transaction A touches Account 1 and transaction B touches Account 2, they run simultaneously. Only conflicting transactions are serialized. This architecture underpins Solana\'s theoretical 65,000+ TPS ceiling.',
      'Aptos implements Block-STM (Software Transactional Memory) — transactions execute optimistically in parallel, then validate and retry if conflicts are detected. SUI uses an object-based model: each asset is an "owned object" with clear, conflict-free ownership, making parallelism the default with very few exceptions. These approaches represent the cutting edge of L1 performance.',
    ],
    keyPoints: [
      'Sequential execution limits throughput to a single thread — a fundamental bottleneck',
      'Solana\'s Sealevel runs non-conflicting transactions simultaneously',
      'Aptos Block-STM and Sui\'s object model enable parallel execution by default',
    ],
    coinSymbol: 'SOL',
  },

  'oracles': {
    id: 'oracles',
    title: 'Blockchain Oracles',
    category: 'Infrastructure',
    emoji: '🔭',
    intro: 'Smart contracts are isolated — they can\'t see the outside world. Oracles are the bridges bringing real-world data on-chain.',
    body: [
      'A smart contract lives in a deterministic, sealed environment. It can only read data already on the blockchain. But most useful applications need external data: What\'s the current ETH price? Did the team win? Did it rain today? This is called the "oracle problem" — getting trustworthy, tamper-resistant off-chain data onto a chain is genuinely hard.',
      'Chainlink is the dominant oracle network. Its Decentralized Oracle Networks (DONs) aggregate data from multiple independent node operators, each submitting data with LINK tokens staked as collateral. The median of their responses becomes the on-chain price feed. DeFi protocols like Aave and Compound rely on Chainlink price feeds for every liquidation decision.',
      'Beyond price feeds, oracles enable: Verifiable Random Functions (VRF) for provably fair randomness in games, automation (Chainlink Keepers), and cross-chain messaging (CCIP). The expanding oracle layer is what allows blockchains to "see" and respond to the entire real world — from stock prices to weather data to sports scores.',
    ],
    keyPoints: [
      'Smart contracts are isolated — oracles bridge them to real-world data feeds',
      'Chainlink aggregates from multiple nodes with LINK collateral for trustworthy data',
      'Price feeds, VRF, automation, and cross-chain messaging all depend on oracles',
    ],
    coinSymbol: 'LINK',
  },

  'bridges': {
    id: 'bridges',
    title: 'Cross-Chain Bridges',
    category: 'Infrastructure',
    emoji: '🌉',
    intro: 'With 100+ blockchains operating in parallel, bridges connect them — and have been the most-hacked sector in all of crypto.',
    body: [
      'A cross-chain bridge moves assets from one blockchain to another. The basic mechanism: lock tokens on chain A, mint equivalent "wrapped" tokens on chain B. To return, burn the wrapped tokens and unlock the originals. The problem: bridges must hold enormous locked assets in smart contracts — making them the single biggest honeypots in crypto.',
      'In 2022, bridges lost over $2 billion to hacks. Ronin Bridge ($625M), Wormhole ($325M), Nomad ($190M). Each attack exploited vulnerabilities in the smart contracts holding locked assets. When a bridge is hacked, the "wrapped" tokens on the destination chain become worthless — they have no backing. This has stranded billions in user funds.',
      'Safer approaches are emerging: Cosmos\'s IBC (Inter-Blockchain Communication) enables trustless cross-chain messaging at the protocol level — no locked assets in a single contract. Chainlink CCIP uses decentralized oracle networks for cross-chain messaging. Polkadot\'s Relay Chain provides native interoperability between parachains. Protocol-level interoperability is replacing ad-hoc bridge contracts.',
    ],
    keyPoints: [
      'Bridges lock tokens on chain A and mint equivalents on chain B',
      'Holding locked value makes bridges the largest hacking targets in crypto',
      'IBC, Polkadot, and CCIP represent safer protocol-level interoperability approaches',
    ],
    coinSymbol: 'DOT',
  },

  'nfts': {
    id: 'nfts',
    title: 'NFTs Explained',
    category: 'Web3',
    emoji: '🎨',
    intro: 'Non-fungible tokens prove digital ownership — turning art, game items, music, and real estate into verifiable on-chain assets.',
    body: [
      '"Fungible" means interchangeable: one dollar is identical to any other dollar. Bitcoin is fungible — 1 BTC equals any other 1 BTC. NFTs are non-fungible: each token is unique. ERC-721 (Ethereum\'s NFT standard) assigns every minted token a distinct ID — token #47 is not the same as token #48, and both have verifiable on-chain provenance.',
      'Before NFTs, digital files were infinitely copyable — you couldn\'t "own" a JPEG in any meaningful sense. An NFT doesn\'t necessarily store the image on-chain (usually it\'s stored on IPFS), but it permanently records ownership on a blockchain. The provenance chain — every creation, sale, and transfer — is fully public and auditable by anyone.',
      'NFT use cases extend well beyond art: gaming (item ownership that persists across games), music royalties (Audius), concert tickets, DeFi collateral positions (Uniswap v3 LP positions are NFTs), domain names (ENS), real estate title records, and supply chain provenance. The underlying concept — verifiable digital ownership — is foundational to the Web3 economy.',
    ],
    keyPoints: [
      'NFTs are unique tokens (ERC-721) — each has distinct ownership history on-chain',
      'Blockchain records provenance permanently — every creation and sale is auditable',
      'Use cases: art, gaming, tickets, domain names, DeFi positions, real estate',
    ],
    coinSymbol: 'AXS',
  },

  'dao': {
    id: 'dao',
    title: 'Decentralized Autonomous Organizations',
    category: 'Web3',
    emoji: '🗳️',
    intro: 'DAOs replace corporate hierarchies with token-weighted voting — governance by the community, enforced by code, with no CEO required.',
    body: [
      'A DAO is an organization whose rules are written in smart contracts rather than corporate bylaws. Token holders vote on proposals: change protocol parameters, allocate treasury funds, upgrade smart contracts. When a proposal passes its threshold, the blockchain executes it automatically. No CEO, no board, no trusted executives — just code and token votes.',
      'The most powerful DAOs govern billions. MakerDAO governs the DAI stablecoin system. Uniswap DAO controls the protocol\'s fee switch and a multi-billion-dollar treasury. Compound DAO sets lending parameters. These are live experiments in on-chain governance with real financial stakes and millions of users depending on the decisions made.',
      'DAO governance is messy in practice. Voter turnout is typically under 10%. Large token holders ("whales") dominate voting. "Governance attacks" — buying enough tokens to pass a malicious proposal — are real: the Beanstalk exploit ($182M in 2022) executed entirely through a governance vote that passed and drained the protocol within one block. Finding the right balance of decentralization and practical efficiency is an unsolved problem.',
    ],
    keyPoints: [
      'Rules encoded in smart contracts — passed proposals execute automatically on-chain',
      'Major DAOs govern billions: MakerDAO, Uniswap, Compound, Aave',
      'Governance attacks, low participation, and whale dominance are real challenges',
    ],
    coinSymbol: 'UNI',
  },

  'tokenomics': {
    id: 'tokenomics',
    title: 'Tokenomics',
    category: 'Foundations',
    emoji: '📊',
    intro: 'Tokenomics is the economics of a cryptocurrency — supply, distribution, emission schedule, and incentives determine whether a token has lasting value.',
    body: [
      '"Tokenomics" covers everything about how a token is created, distributed, and used. Key questions: What\'s the maximum supply? (Bitcoin: 21M. ETH: no hard cap. SOL: ~565M. DOGE: infinite.) How is new supply introduced? (Mining, staking yields, team allocations.) What can you actually do with it? (Governance, fee payment, staking, access rights.)',
      'Emission schedules matter enormously. A project releasing tokens slowly to founders and early investors over 4 years is structurally designed to create sell pressure on retail buyers. Well-designed tokenomics align incentives: long vesting schedules for insiders, meaningful on-chain utility, and sustainable emission rates that don\'t overwhelm demand.',
      'Deflationary mechanics create scarcity: Ethereum burns base fees (EIP-1559), making ETH potentially deflationary during high network activity. Bitcoin\'s halvings cut new supply every 4 years. BNB conducts quarterly burns. The theory is sound — scarcity creates value pressure. But burns without underlying demand just delay the inevitable.',
    ],
    keyPoints: [
      'Supply cap, emission schedule, and token utility are the core tokenomics levers',
      'Vesting schedules reveal team alignment — short vesting signals incentive to sell',
      'Deflationary mechanics (burns, halvings) create scarcity but require underlying demand',
    ],
    coinSymbol: 'BTC',
  },

  'depin': {
    id: 'depin',
    title: 'DePIN — Decentralized Physical Infrastructure',
    category: 'Web3',
    emoji: '📡',
    intro: 'DePIN uses token incentives to bootstrap real-world infrastructure networks — a radical model for building the internet\'s physical layer.',
    body: [
      'DePIN (Decentralized Physical Infrastructure Networks) uses token rewards to coordinate people to provide real-world services: wireless coverage (Helium), GPU computing (Render, Akash), mapping data (Hivemapper), storage (Filecoin, Arweave), energy grids (Power Ledger). Instead of a company building the infrastructure, token rewards attract thousands of independent operators.',
      'The business model is compelling: instead of raising $1B to build a cell tower network, reward miners in tokens to set up one router at a time. The network bootstraps itself. Early contributors take the most risk (token is worth very little initially) but earn the highest rewards. As the network grows and the token appreciates, new contributors earn less but take less risk.',
      'DePIN projects face a classic chicken-and-egg problem: tokens have no value without a useful network, but building the network requires early operators to trust the token\'s future value. Helium for IoT, Render for GPU compute, and Filecoin for storage have demonstrated that decentralized incentives can bootstrap real infrastructure that competes with centralized cloud providers.',
    ],
    keyPoints: [
      'Token rewards coordinate thousands of individuals to provide real-world infrastructure',
      'DePIN covers: wireless, compute, storage, mapping, energy, and more',
      'Bootstrapping requires early operators to bet on future token value',
    ],
    coinSymbol: 'FIL',
  },

  'privacy-tech': {
    id: 'privacy-tech',
    title: 'Privacy Technology in Crypto',
    category: 'Privacy',
    emoji: '🕵️',
    intro: 'Public blockchains expose every transaction — privacy coins and ZK technology restore financial privacy without sacrificing security.',
    body: [
      'On Bitcoin and Ethereum, every transaction is permanently public. Your wallet address and full transaction history is visible to anyone — blockchain analytics firms (Chainalysis, Elliptic) specialize in de-anonymizing wallets by tracing on-chain patterns. This is useful for law enforcement but means genuine financial privacy requires different technology.',
      'Monero (XMR) provides privacy by default using three mechanisms: ring signatures (mix your transaction with a group of others), stealth addresses (one-time recipient addresses that hide who received funds), and RingCT (Confidential Transactions that hide the amounts). Together, these make Monero transactions effectively untraceable.',
      'Zcash (ZEC) uses ZK-SNARKs to let users send "shielded" transactions where sender, receiver, and amount are all hidden — mathematically equivalent to Monero\'s privacy but using a different cryptographic approach. Privacy isn\'t only for illicit use — paying for medical care, charitable donations, or salary in a transparent public ledger is a genuine privacy violation for most people.',
    ],
    keyPoints: [
      'Public blockchains expose all transactions — analytics firms actively de-anonymize wallets',
      'Monero: ring signatures + stealth addresses + RingCT (amounts hidden)',
      'Zcash: ZK-SNARKs enable shielded transactions hiding sender, receiver, and amount',
    ],
    coinSymbol: 'XMR',
  },

  'mev': {
    id: 'mev',
    title: 'MEV & Block Ordering',
    category: 'Advanced',
    emoji: '🔍',
    intro: 'Block producers can see pending transactions and reorder them for profit — this invisible tax on users is called Maximal Extractable Value.',
    body: [
      'MEV (Maximal Extractable Value) refers to profit extracted by reordering, including, or excluding transactions in a block. When you submit a transaction, it sits in the mempool — visible to all. Validators choose which transactions to include and in what order. This ordering power is worth a lot: Flashbots researchers estimated $1.3B+ in MEV extracted on Ethereum in 2022.',
      'Common MEV strategies: front-running (a bot sees your large DEX buy, buys ahead of you, then sells into your trade for profit), sandwich attacks (buy before + sell after someone\'s swap, capturing their price impact), and arbitrage (exploiting price differences between DEX pools created by other trades). Every Ethereum user implicitly pays a small MEV tax on almost every on-chain action.',
      'The MEV supply chain is now highly structured: "searchers" run bots to find MEV opportunities, "builders" construct optimal blocks, and "relays" pass them to validators. Flashbots\' MEV-Boost is used by 90%+ of Ethereum validators. MEV isn\'t eliminated — it\'s been partially democratized and redistributed. For users, Cowswap and 1inch\'s Fusion Mode use batch auctions and dutch auctions to reduce MEV exposure.',
    ],
    keyPoints: [
      'MEV: profit from reordering, including, or excluding transactions in a block',
      'Front-running, sandwich attacks, and arbitrage are the three main MEV types',
      'Flashbots MEV-Boost redistributes MEV — doesn\'t eliminate it. Users still pay.',
    ],
    coinSymbol: 'ETH',
  },

  'account-abstraction': {
    id: 'account-abstraction',
    title: 'Account Abstraction',
    category: 'Advanced',
    emoji: '🪄',
    intro: 'Account abstraction makes crypto wallets programmable — enabling social recovery, session keys, batch transactions, and gasless UX.',
    body: [
      'Ethereum has two account types: EOAs (Externally Owned Accounts) controlled by a private key, and smart contract accounts. All transactions must currently originate from an EOA — meaning wallet logic is rigid and simple. Account abstraction (ERC-4337 and EIP-7702) lets smart contract accounts initiate transactions, making wallet behavior fully programmable.',
      'With account abstraction, wallets can: auto-rotate keys if compromised (social recovery without seed phrases), define spending limits per session, batch multiple actions into one transaction (approve + swap in a single click), pay gas in USDC instead of ETH, and let apps sponsor gas fees entirely. This unlocks UX that matches or exceeds web2 applications.',
      'The stakes are high for adoption: millions of potential crypto users are deterred by complex wallet UX, gas payment requirements, and seed phrase custody. ERC-4337 is live on Ethereum since March 2023. Coinbase\'s Smart Wallet, Argent, and Safe all implement account abstraction. It\'s widely considered the most important UX breakthrough for mainstream crypto adoption.',
    ],
    keyPoints: [
      'Makes wallet logic programmable — no more rigid, seed-phrase-only accounts',
      'Enables social recovery, gas abstraction, session keys, and batch transactions',
      'ERC-4337 is live — the key to making crypto UX comparable to web2 apps',
    ],
    coinSymbol: 'ETH',
  },

  'web3-identity': {
    id: 'web3-identity',
    title: 'Web3 Identity & ENS',
    category: 'Web3',
    emoji: '🪪',
    intro: 'Your wallet is your Web3 identity — a sovereign, self-custodied identity that no company can revoke, freeze, or censor.',
    body: [
      'In Web2, your identity lives with platforms: Google knows who you are, Twitter gives you a username, banks issue card numbers. These identities can be revoked, suspended, or sold without your consent. Web3 flips this: your wallet address is your identity, derived from your private key, controlled by nobody else. You own it the same way you own the keys to your house.',
      'ENS (Ethereum Name Service) maps human-readable names like alice.eth to wallet addresses — like DNS for the blockchain. ENS names can also store social profiles, website links, and cross-chain addresses. Lens Protocol and Farcaster extend this to decentralized social graphs — your followers, posts, and reputation stored on-chain, not in a company\'s database that can ban you.',
      '"Sign In With Ethereum" (SIWE) lets dApps authenticate users via cryptographic wallet signatures instead of passwords. W3C\'s Decentralized Identifiers (DIDs) standard extends the concept to verifiable credentials, professional certifications, and medical records. The full stack for truly decentralized, user-owned identity is actively being built.',
    ],
    keyPoints: [
      'Wallet address = Web3 identity — self-sovereign, no company controls it',
      'ENS maps human names (alice.eth) to wallet addresses, social profiles, and more',
      'SIWE and DIDs enable wallet-based login and verifiable credentials across the web',
    ],
    coinSymbol: 'ENS',
  },

  'blockchain-gaming': {
    id: 'blockchain-gaming',
    title: 'Blockchain Gaming',
    category: 'Web3',
    emoji: '🎮',
    intro: 'Blockchain gaming gives players true ownership of in-game assets — items, characters, and currencies that exist on-chain and can\'t be confiscated.',
    body: [
      'In traditional gaming, your inventory belongs to the game company. Blizzard can ban your account and delete your level-60 character. Items have no value outside the game. Blockchain games change the ownership model: items are NFTs in your wallet — you own them regardless of whether the game survives. Trade them, sell them, use them across games, hold them as investments.',
      'Axie Infinity pioneered Play-to-Earn: players earned SLP tokens by playing that could be sold for real money. During the 2021 peak, Axie players in the Philippines were earning $1000+/month from gameplay. The model attracted millions of new users to crypto. It also collapsed spectacularly when token prices fell and the Ronin Bridge was hacked for $625M — the largest hack in crypto history.',
      'The next generation focuses on "Play-and-Own" rather than "Play-to-Earn" — sustainable games where fun gameplay comes first and true asset ownership is the benefit, not a financial scheme. Immutable X (IMX), Ronin Network, and Beam Chain provide gaming-specific L2s with near-zero fees and high throughput, enabling smooth in-game economies without layer-1 gas costs.',
    ],
    keyPoints: [
      'On-chain items = true ownership — no company can confiscate or delete them',
      'Axie Infinity proved P2E can scale — and showed its sustainability limits',
      'Immutable X and Ronin provide gaming-specific L2s with near-zero transaction fees',
    ],
    coinSymbol: 'AXS',
  },

};
