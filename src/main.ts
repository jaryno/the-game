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

const container = document.getElementById("pixi-container");
if (!container) throw new Error("Missing #pixi-container element");
container.appendChild(app.canvas);

new GameScene(app);
