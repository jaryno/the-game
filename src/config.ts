import { TextStyle } from "pixi.js";

export const CONFIG = Object.freeze({
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GAME_DURATION_MS: 20_000,
  LETTER_SPAWN_INTERVAL_MS: 800,
  GOLDEN_PROBABILITY: 0.36,
  NORMAL_SPEED: 1.8,
  GOLDEN_SPEED: 1,
  NORMAL_POINTS: 100,
  GOLDEN_POINTS: 200,
  LETTERS: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  SHARD_COUNT_MIN: 2,
  SHARD_COUNT_MAX: 5,
  SHARD_SPEED: 1.5,
  SHARD_HORIZONTAL_SPREAD: 5,
  SHARD_HORIZONTAL_DECELERATION: 0.96,
  SHARD_FONT_SIZE: 30,
  LETTER_SPAWN_Y: -50,
  BURST_PARTICLE_COUNT: 12,
  BURST_DURATION_MS: 380,
});

export const NORMAL_STYLE = new TextStyle({
  fontFamily: "monospace",
  fontSize: 48,
  fill: 0xffffff,
});

export const GOLDEN_STYLE = new TextStyle({
  fontFamily: "monospace",
  fontSize: 48,
  fill: 0xffd700,
});

export const UI_STYLE = new TextStyle({
  fontFamily: "monospace",
  fontSize: 28,
  fill: 0xffffff,
});

export const TITLE_STYLE = new TextStyle({
  fontFamily: "monospace",
  fontSize: 48,
  fill: 0xffd700,
});

export const SHARD_STYLE = new TextStyle({
  fontFamily: "monospace",
  fontSize: CONFIG.SHARD_FONT_SIZE,
  fill: 0xffffff,
  dropShadow: {
    color: 0xffd700,
    blur: 10,
    distance: 0,
    alpha: 0.9,
  },
});
