import { Container, Text } from "pixi.js";
import { CONFIG, TITLE_STYLE, UI_STYLE } from "../config";

export class MenuScreenContainer extends Container {
  onStart: (() => void) | null = null;

  private boundKeyHandler = (e: KeyboardEvent): void => {
    if (e.key === "Enter") this.onStart?.();
  };

  show(): void {
    this.removeChildren();

    const title = new Text({ text: "THE GAME", style: TITLE_STYLE });
    title.anchor.set(0.5);
    title.x = CONFIG.CANVAS_WIDTH / 2;
    title.y = CONFIG.CANVAS_HEIGHT / 2 - 40;

    const prompt = new Text({
      text: "Press ENTER to Start THE GAME",
      style: UI_STYLE,
    });
    prompt.anchor.set(0.5);
    prompt.x = CONFIG.CANVAS_WIDTH / 2;
    prompt.y = CONFIG.CANVAS_HEIGHT / 2 + 30;

    this.addChild(title, prompt);
    this.visible = true;
    window.addEventListener("keydown", this.boundKeyHandler);
  }

  hide(): void {
    this.visible = false;
    window.removeEventListener("keydown", this.boundKeyHandler);
  }
}
