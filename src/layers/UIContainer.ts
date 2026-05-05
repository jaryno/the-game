import { Container, Text } from "pixi.js";
import { CONFIG, UI_STYLE } from "../config.ts";

export class UIContainer extends Container {
  public scoreText?: Text;
  public timerText?: Text;

  init() {
    this.removeChildren();

    this.scoreText = new Text({ text: "Score: 0", style: UI_STYLE });
    this.scoreText.x = 16;
    this.scoreText.y = 12;

    this.timerText = new Text({ text: "20s", style: UI_STYLE });
    this.timerText.anchor.set(1, 0);
    this.timerText.x = CONFIG.CANVAS_WIDTH - 16;
    this.timerText.y = 12;

    this.addChild(this.scoreText, this.timerText);
  }

  setScore(s: number) {
    if (this.scoreText) {
      this.scoreText.text = `Score: ${s}`;
    }
  }

  setTimerText(t: string) {
    if (this.timerText) {
      this.timerText.text = `${t}s`;
    }
  }

  showResults(score: number, goldenCount: number): void {
    this.removeChildren();

    const finalScore = score + goldenCount * CONFIG.GOLDEN_LETTER_PRICE;

    const lines = [
      "Time's Up!",
      "",
      `Points earned: ${score}`,
      `Golden letters hit: ${goldenCount}`,
      "",
      `${score} + (${goldenCount} × ${CONFIG.GOLDEN_LETTER_PRICE}) = ${finalScore}`,
      "",
      "Press ENTER to play again",
    ];

    const resultsText = new Text({ text: lines.join("\n"), style: UI_STYLE });
    resultsText.anchor.set(0.5);
    resultsText.x = CONFIG.CANVAS_WIDTH / 2;
    resultsText.y = CONFIG.CANVAS_HEIGHT / 2;
    this.addChild(resultsText);
  }
}
