import { Container, Text } from "pixi.js";
import { CONFIG, UI_STYLE } from "../config.ts";

export class UILayer {
  readonly container = new Container();

  public scoreText?: Text;
  public timerText?: Text;

  init() {
    this.container.removeChildren();

    this.scoreText = new Text({ text: "Score: 0", style: UI_STYLE });
    this.scoreText.x = 16;
    this.scoreText.y = 12;

    this.timerText = new Text({ text: "20s", style: UI_STYLE });
    this.timerText.anchor.set(1, 0);
    this.timerText.x = CONFIG.CANVAS_WIDTH - 16;
    this.timerText.y = 12;

    this.container.addChild(this.scoreText, this.timerText);
  }

  setScore(s: number) {
    if (this.scoreText) {
      this.scoreText.text = `Score: ${s}`;
    }
  }

  setTimerText(n: number) {
    if (this.timerText) {
      this.timerText.text = `${n}s`;
    }
  }

  showResults(score: number, normalScore: number): void {
    this.container.removeChildren();

    const goldenScore = score - normalScore;

    const lines = [
      "Game Over",
      "",
      `Normal letters: ${normalScore} pts`,
      `Golden clears:  ${goldenScore} pts`,
      "",
      `Total: ${score} pts`,
      "",
      "Press ENTER to play again",
    ];

    const resultsText = new Text({ text: lines.join("\n"), style: UI_STYLE });
    resultsText.anchor.set(0.5);
    resultsText.x = CONFIG.CANVAS_WIDTH / 2;
    resultsText.y = CONFIG.CANVAS_HEIGHT / 2;
    this.container.addChild(resultsText);
  }

  clear(): void {
    this.container.removeChildren();
  }
}
