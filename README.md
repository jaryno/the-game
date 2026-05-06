# The Game — Typing Keyboard Game

A fast-paced typing game where letters fall from the top of the screen and the player must type the matching key before they disappear. 
Built with TypeScript and PixiJS.

## How to Play

1. Press **Enter** to start a game session
2. Type the matching key to catch falling letters before they reach the bottom
3. Each session lasts **20 seconds**

### Scoring

| Letter type | How it works | Points |
|---|---|---|
| Normal (white) | Type the key to catch it | 100 pts |
| Golden (gold) | Type the key — it explodes into shards. Catch **all** shards to earn points | 200 pts |

**End-of-game formula:**

```
Total = (normal letters caught × 100) + (golden letters cleared × 200)
```

Golden letters only count if every shard from the explosion is caught. If any shard falls off screen, no golden points are awarded for that letter.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

Output is written to `dist/`. Serve it with any static file server:

```bash
npx serve dist
```

### Lint

```bash
npm run lint
```

## Tech Stack

- **TypeScript** — strict mode, no `any`
- **PixiJS 8** — WebGL rendering
- **Vite** — dev server and production bundler
- **ESLint + Prettier** — code quality and formatting

No other runtime dependencies.

## Project Structure

```
src/
  main.ts              — app entry point, canvas setup, responsive scaling
  config.ts            — game constants and text styles
  GameScene.ts         — state machine (menu → playing → end), input handling
  GameLoop.ts          — spawning, matching, scoring, tick updates
  Letter.ts            — falling letter entity (normal, golden, shard)
  ExplosionBurst.ts    — particle effect on golden letter match
  layers/
    GameLayer.ts       — container for game entities
    UILayer.ts         — score, timer, end-of-game results
    MenuScreenLayer.ts — start screen
  types/
    GameState.ts       — enum for game states
```

## Configuration

All game parameters are in `src/config.ts`:

| Parameter | Default | Description |
|---|---|---|
| `GAME_DURATION_MS` | 20000 | Session length in ms |
| `LETTER_SPAWN_INTERVAL_MS` | 800 | Time between letter spawns |
| `GOLDEN_PROBABILITY` | 0.36 | Chance a letter is golden |
| `NORMAL_SPEED` / `GOLDEN_SPEED` | 1.8 / 1.0 | Fall speed (px per tick) |
| `NORMAL_POINTS` / `GOLDEN_POINTS` | 100 / 200 | Points per letter type |
| `SHARD_COUNT_MIN` / `SHARD_COUNT_MAX` | 2 / 5 | Shards per golden explosion |
