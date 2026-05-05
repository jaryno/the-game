import { Text } from "pixi.js";
import { CONFIG, GOLDEN_STYLE, NORMAL_STYLE } from "./config";

export class Letter {
  public readonly char: string;
  public readonly isGolden: boolean;
  public speed: number;
  public points: number;
  public text: Text;

  public alive = true;

  constructor(char: string, isGolden: boolean, x: number) {
    this.char = char;
    this.isGolden = isGolden;
    this.speed = isGolden ? CONFIG.GOLDEN_SPEED : CONFIG.NORMAL_SPEED;
    this.points = isGolden ? CONFIG.GOLDEN_POINTS : CONFIG.NORMAL_POINTS;
    this.text = new Text({
      text: char,
      style: isGolden ? GOLDEN_STYLE : NORMAL_STYLE,
    });
    this.text.anchor.set(0.5);
    this.text.x = x;
    this.text.y = -50;
  }

  update(): void {
    this.text.y += this.speed;
    if (this.text.y > CONFIG.CANVAS_HEIGHT + 50) {
      this.alive = false;
    }
  }

  destroy(): void {
    this.text.destroy();
  }
}
