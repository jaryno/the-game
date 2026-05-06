import { Ticker } from "pixi.js";
import { CONFIG } from "./config";
import { Letter } from "./Letter";
import { GameLayer } from "./layers/GameLayer";
import { ExplosionBurst } from "./ExplosionBurst";

export class GameLoop {
  private letters: Letter[] = [];
  private bursts: ExplosionBurst[] = [];
  private spawnAccumulator = 0;
  private timeLeft = 0;
  private gameLayer: GameLayer;

  public score = 0;
  public normalScore = 0;
  public goldenCount = 0;
  public shardsCleared = 0;

  private onTimeUpdate?: (secondsLeft: number) => void;
  private onScoreUpdate?: (score: number) => void;
  private onTimeUp?: () => void;

  constructor(gameContainer: GameLayer) {
    this.gameLayer = gameContainer;
  }

  private spawnLetter(): void {
    const char =
      CONFIG.LETTERS[Math.floor(Math.random() * CONFIG.LETTERS.length)];
    const isGolden = Math.random() < CONFIG.GOLDEN_PROBABILITY;
    const x = 40 + Math.random() * (CONFIG.CANVAS_WIDTH - 80);
    const letter = new Letter(char, isGolden, x);
    this.gameLayer.container.addChild(letter.text);
    this.letters.push(letter);
  }

  public setOnTimeUpdate(callback: (secondsLeft: number) => void) {
    this.onTimeUpdate = callback;
  }

  public setOnScoreUpdate(callback: (score: number) => void) {
    this.onScoreUpdate = callback;
  }

  public setOnTimeUp(callback: () => void) {
    this.onTimeUp = callback;
  }

  start(): void {
    this.letters = [];
    this.bursts = [];
    this.spawnAccumulator = 0;
    this.timeLeft = CONFIG.GAME_DURATION_MS;
    this.score = 0;
    this.normalScore = 0;
    this.goldenCount = 0;
    this.shardsCleared = 0;
  }

  update(ticker: Ticker): void {
    this.timeLeft -= ticker.deltaMS;
    if (this.timeLeft <= 0) {
      this.onTimeUp?.();
      return;
    }

    this.onTimeUpdate?.(Math.ceil(this.timeLeft / 1000));
    this.updateSpawner(ticker.deltaMS);
    this.updateLetters();
    this.updateBursts(ticker.deltaMS);
  }

  private updateSpawner(deltaMS: number): void {
    this.spawnAccumulator += deltaMS;
    while (this.spawnAccumulator >= CONFIG.LETTER_SPAWN_INTERVAL_MS) {
      this.spawnAccumulator -= CONFIG.LETTER_SPAWN_INTERVAL_MS;
      this.spawnLetter();
    }
  }

  private updateLetters(): void {
    for (const letter of this.letters) {
      letter.update();
    }

    this.letters = this.letters.filter((l) => {
      if (!l.alive) {
        this.gameLayer.container.removeChild(l.text);
        l.destroy();
        return false;
      }
      return true;
    });
  }

  private updateBursts(deltaMS: number): void {
    for (const burst of this.bursts) {
      burst.update(deltaMS);
    }

    this.bursts = this.bursts.filter((b) => {
      if (b.done) {
        this.gameLayer.container.removeChild(b.container);
        b.destroy();
        return false;
      }
      return true;
    });
  }

  tryMatch(key: string): boolean {
    const candidates = this.letters.filter((l) => l.alive && l.char === key);
    const match =
      candidates.find((l) => l.isShard) ?? candidates.find((l) => !l.isShard);
    if (!match) return false;

    match.alive = false;

    if (match.isGolden && !match.isShard) {
      this.triggerExplosion(match);
    } else if (match.isShard) {
      match.onClear?.();
    } else {
      this.score += match.points;
      this.normalScore += match.points;
      this.onScoreUpdate?.(this.score);
    }

    return true;
  }

  private triggerExplosion(letter: Letter): void {
    const x = letter.text.x;
    const y = letter.text.y;
    const count =
      CONFIG.SHARD_COUNT_MIN +
      Math.floor(
        Math.random() * (CONFIG.SHARD_COUNT_MAX - CONFIG.SHARD_COUNT_MIN + 1),
      );

    let remaining = count;
    const onClear = () => {
      if (--remaining > 0) return;
      this.score += CONFIG.GOLDEN_POINTS;
      this.goldenCount++;
      this.shardsCleared++;
      this.onScoreUpdate?.(this.score);
    };

    const burst = new ExplosionBurst(x, y);
    this.gameLayer.container.addChild(burst.container);
    this.bursts.push(burst);

    this.spawnShards(letter.char, x, y, count, onClear);
  }

  private spawnShards(
    char: string,
    x: number,
    y: number,
    count: number,
    onClear: () => void,
  ): void {
    for (let i = 0; i < count; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      const vx =
        sign *
        (CONFIG.SHARD_HORIZONTAL_SPREAD * 0.4 +
          Math.random() * CONFIG.SHARD_HORIZONTAL_SPREAD * 0.6);
      const shard = new Letter(char, false, x, { vx, y, onClear });
      this.gameLayer.container.addChild(shard.text);
      this.letters.push(shard);
    }
  }

  cleanup(): void {
    for (const letter of this.letters) {
      letter.destroy();
    }
    this.letters = [];

    for (const burst of this.bursts) {
      this.gameLayer.container.removeChild(burst.container);
      burst.destroy();
    }
    this.bursts = [];
  }
}
