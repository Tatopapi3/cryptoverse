# Cryptoverse

A mobile-first crypto learning app built with React Native and Expo. Learn Bitcoin, Ethereum, DeFi, and 80+ cryptocurrencies through a structured daily curriculum — with AI-powered deep dives, quizzes, and a full progress tracking system.

**Live Web App → [cryptoverse-nine-beta.vercel.app](https://cryptoverse-nine-beta.vercel.app)**

---

## Features

- **Unified Learn Screen** — Calendar view where every day has a scheduled lesson, concept, or quiz. Completed items turn green with a checkmark.
- **AI Deep Dive** — Tap any coin for a streamed, beginner-friendly explanation powered by Claude AI (server-side proxy — key never exposed to client).
- **Weekly Quiz** — 7 AI-generated questions pulling from the current month's curriculum. Earn XP with perfect score and streak bonuses.
- **Explore Tab** — Browse all coins by category, filter by learned/unlearned, search by name or symbol.
- **Portfolio Tracker** — Track your holdings with live price data and persistent storage.
- **XP & Streak System** — Earn XP for every lesson, concept, and quiz. Build daily streaks.
- **Dark / Light Mode** — Full theme support across every screen.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navigation | Expo Router |
| State | Zustand |
| Persistence | AsyncStorage |
| AI | Anthropic Claude (via Vercel Edge proxy) |
| Deployment | Vercel (web) + EAS Build (iOS/Android) |

---

## Running Locally

```bash
git clone https://github.com/Tatopapi3/cryptoverse.git
cd cryptoverse
npm install
```

Create a `.env` file:

```
ANTHROPIC_API_KEY=your_key_here
EXPO_PUBLIC_API_URL=https://your-vercel-deployment.vercel.app
```

Start the dev server:

```bash
npx expo start
```

Press `w` for web, `i` for iOS simulator, `a` for Android emulator.

---

## Deploying

**Web (Vercel):**
```bash
npx vercel --prod
```

**iOS + Android (EAS):**
```bash
eas build --platform all
eas submit --platform ios
eas submit --platform android
```

---

## Project Structure

```
app/
  (tabs)/         # Main tab screens (Learn, Explore, Portfolio, Community)
  coin/           # Coin detail + AI deep dive
  lesson/         # Concept lesson screen
  quiz.tsx        # Weekly quiz
api/
  deep-dive.ts    # Vercel edge function — proxies Claude streaming
  quiz.ts         # Vercel edge function — proxies quiz generation
constants/
  coins.ts        # All 80+ coins with metadata
  curriculum.ts   # Monthly lesson schedule
  blockchain-concepts.ts  # 50+ concept definitions
services/
  claude.ts       # Deep dive service (calls /api/deep-dive)
  quiz.ts         # Quiz service (calls /api/quiz)
store/
  useProgressStore.ts  # XP, streak, learned coins/concepts, quiz history
```
