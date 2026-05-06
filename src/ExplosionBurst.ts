import { Container, Graphics } from "pixi.js";
import { CONFIG } from "./config";

interface Particle {
  gfx: Graphics;
  vx: number;
  vy: number;
}

export class ExplosionBurst {
  readonly container = new Container();
  private readonly particles: Particle[] = [];
  private elapsed = 0;

  private _done = false;

  get done() {
    return this._done;
  }

  constructor(x: number, y: number) {
    for (let i = 0; i < CONFIG.BURST_PARTICLE_COUNT; i++) {
      const angle = (i / CONFIG.BURST_PARTICLE_COUNT) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      const radius = 2 + Math.random() * 3;

      const gfx = new Graphics();
      gfx.circle(0, 0, radius).fill(0xffd700);
      gfx.x = x;
      gfx.y = y;

      this.particles.push({
        gfx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
      this.container.addChild(gfx);
    }
  }

  update(deltaMS: number): void {
    this.elapsed += deltaMS;
    const progress = Math.min(this.elapsed / CONFIG.BURST_DURATION_MS, 1);
    this.container.alpha = 1 - progress;

    for (const p of this.particles) {
      p.gfx.x += p.vx;
      p.gfx.y += p.vy;
    }

    if (progress >= 1) {
      this._done = true;
    }
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
