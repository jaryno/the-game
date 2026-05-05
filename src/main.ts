import { Application } from "pixi.js";
import { CONFIG } from "./config";
import { GameScene } from "./GameScene";

const app = new Application();

await app.init({
  width: CONFIG.CANVAS_WIDTH,
  height: CONFIG.CANVAS_HEIGHT,
  backgroundColor: 0x111111,
  antialias: true,
});

document.getElementById("pixi-container")!.appendChild(app.canvas);

new GameScene(app);
