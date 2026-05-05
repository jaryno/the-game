import { Ticker } from "pixi.js";
import { CONFIG } from "./config";
import { Letter } from "./Letter";
import { GameLayer } from "./layers/GameLayer";

export class GameLoop {
  private letters: Letter[] = [];
  private spawnAccumulator = 0;
  private timeLeft = 0;
  private gameContainer: GameLayer;

  public score = 0;
  public goldenCount = 0;

  private onTimeUpdate?: (secondsLeft: number) => void;
  private onScoreUpdate?: (score: number) => void;
  private onTimeUp?: () => void;

  constructor(gameContainer: GameLayer) {
    this.gameContainer = gameContainer;
  }

  private spawnLetter(): void {
    const char =
      CONFIG.LETTERS[Math.floor(Math.random() * CONFIG.LETTERS.length)];

    const isGolden = Math.random() < CONFIG.GOLDEN_PROBABILITY;
    const x = 40 + Math.random() * (CONFIG.CANVAS_WIDTH - 80);
    const letter = new Letter(char, isGolden, x);

    this.gameContainer.container.addChild(letter.text);
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
    this.spawnAccumulator = 0;
    this.timeLeft = CONFIG.GAME_DURATION_MS;
    this.score = 0;
    this.goldenCount = 0;
  }

  update(ticker: Ticker): void {
    this.timeLeft -= ticker.deltaMS;
    if (this.timeLeft <= 0) {
      this.onTimeUp?.();
      return;
    }

    this.onTimeUpdate?.(Math.ceil(this.timeLeft / 1000));

    this.spawnAccumulator += ticker.deltaMS;
    while (this.spawnAccumulator >= CONFIG.LETTER_SPAWN_INTERVAL_MS) {
      this.spawnAccumulator -= CONFIG.LETTER_SPAWN_INTERVAL_MS;
      this.spawnLetter();
    }

    for (const letter of this.letters) {
      letter.update();
    }

    this.letters = this.letters.filter((l) => {
      if (!l.alive) {
        this.gameContainer.container.removeChild(l.text);
        l.destroy();
        return false;
      }
      return true;
    });
  }

  tryMatch(key: string): boolean {
    const match = this.letters.find((l) => l.alive && l.char === key);
    if (!match) return false;

    this.score += match.points;
    if (match.isGolden) {
      this.goldenCount++;
    }
    match.alive = false;
    this.onScoreUpdate?.(this.score);

    return true;
  }

  cleanup(): void {
    for (const letter of this.letters) {
      letter.destroy();
    }
    this.letters = [];
  }
}
