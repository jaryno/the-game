import { Container } from "pixi.js";

export class GameLayer {
  readonly container = new Container();

  clear(): void {
    this.container.removeChildren();
  }
}
