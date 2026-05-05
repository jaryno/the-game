import { TextStyle } from "pixi.js";

export const CONFIG = Object.freeze({
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GAME_DURATION_MS: 20_000,
  LETTER_SPAWN_INTERVAL_MS: 600,
  GOLDEN_PROBABILITY: 0.15,
  NORMAL_SPEED: 2,
  GOLDEN_SPEED: 4,
  NORMAL_POINTS: 1,
  GOLDEN_POINTS: 2,
  GOLDEN_LETTER_PRICE: 5,
  LETTERS: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
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
