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

function resize() {
  const scale = Math.min(
    1,
    window.innerWidth / CONFIG.CANVAS_WIDTH,
    window.innerHeight / CONFIG.CANVAS_HEIGHT,
  );
  app.canvas.style.width = `${CONFIG.CANVAS_WIDTH * scale}px`;
  app.canvas.style.height = `${CONFIG.CANVAS_HEIGHT * scale}px`;
}

window.addEventListener("resize", resize);
resize();
