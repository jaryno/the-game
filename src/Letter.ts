import { Text } from "pixi.js";
import { CONFIG, GOLDEN_STYLE, NORMAL_STYLE, SHARD_STYLE } from "./config";

export interface ShardCallbacks {
  onHit: () => void;
  onMiss: () => void;
}

export interface ShardOptions {
  vx: number;
  y: number;
  callbacks: ShardCallbacks;
}

export class Letter {
  public readonly char: string;
  public readonly isGolden: boolean;
  public readonly isShard: boolean;
  private readonly speed: number;
  private vx: number;
  public text: Text;
  public onHit?: () => void;
  public onMiss?: () => void;

  public alive = true;

  constructor(
    char: string,
    isGolden: boolean,
    x: number,
    shardOptions?: ShardOptions,
  ) {
    this.char = char;
    this.isGolden = isGolden;
    this.isShard = !!shardOptions;
    this.vx = shardOptions?.vx ?? 0;
    this.speed = this.isShard
      ? CONFIG.SHARD_SPEED
      : isGolden
        ? CONFIG.GOLDEN_SPEED
        : CONFIG.NORMAL_SPEED;

    this.onHit = shardOptions?.callbacks.onHit;
    this.onMiss = shardOptions?.callbacks.onMiss;

    this.text = new Text({
      text: char,
      style: this.isShard
        ? SHARD_STYLE
        : isGolden
          ? GOLDEN_STYLE
          : NORMAL_STYLE,
    });
    this.text.anchor.set(0.5);
    this.text.x = x;
    this.text.y = shardOptions?.y ?? CONFIG.LETTER_SPAWN_Y;
  }

  update(): void {
    if (this.isShard) {
      this.text.x += this.vx;
      this.vx *= CONFIG.SHARD_HORIZONTAL_DECELERATION;

      const hw = CONFIG.SHARD_FONT_SIZE / 2;
      if (this.text.x < hw) {
        this.text.x = hw;
        this.vx = 0;
      } else if (this.text.x > CONFIG.CANVAS_WIDTH - hw) {
        this.text.x = CONFIG.CANVAS_WIDTH - hw;
        this.vx = 0;
      }
    }

    this.text.y += this.speed;
    if (this.text.y > CONFIG.CANVAS_HEIGHT + 50) {
      this.alive = false;
    }
  }

  destroy(): void {
    this.text.destroy();
  }
}
