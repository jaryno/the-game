import { Application, Ticker } from "pixi.js";
import { GameLayer } from "./layers/GameLayer";
import { MenuScreenLayer } from "./layers/MenuScreenLayer";
import { UILayer } from "./layers/UILayer";
import { GameState } from "./types/GameState";
import { GameLoop } from "./GameLoop";

export class GameScene {
  private app: Application;
  private state: GameState = GameState.MENU;

  private readonly gameLayer: GameLayer;
  private readonly uiLayer: UILayer;
  private readonly menuScreenLayer: MenuScreenLayer;

  private readonly gameLoop: GameLoop;

  private boundGameKey: ((e: KeyboardEvent) => void) | null = null;
  private boundEndKey: ((e: KeyboardEvent) => void) | null = null;

  constructor(app: Application) {
    this.app = app;

    this.gameLayer = new GameLayer();
    this.uiLayer = new UILayer();

    this.menuScreenLayer = new MenuScreenLayer();
    this.menuScreenLayer.onStart = () => this.startGame();

    this.gameLoop = new GameLoop(this.gameLayer);
    this.gameLoop.setOnTimeUpdate((s) => this.uiLayer.setTimerText(s));
    this.gameLoop.setOnScoreUpdate((s) => this.uiLayer.setScore(s));
    this.gameLoop.setOnTimeUp(() => this.endGame());

    app.stage.addChild(this.gameLayer.container);
    app.stage.addChild(this.uiLayer.container);
    app.stage.addChild(this.menuScreenLayer.container);

    this.showMenu();
  }

  private showMenu(): void {
    this.state = GameState.MENU;
    this.gameLoop.cleanup();
    this.gameLayer.clear();
    this.uiLayer.clear();
    this.menuScreenLayer.show();
  }

  private startGame(): void {
    this.state = GameState.PLAYING;
    this.menuScreenLayer.hide();
    this.uiLayer.init();

    this.gameLoop.start();

    this.boundGameKey = (e: KeyboardEvent) => {
      if (this.state === GameState.PLAYING) {
        this.gameLoop.tryMatch(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", this.boundGameKey);
    this.app.ticker.add(this.update);
  }

  private update = (ticker: Ticker): void => {
    if (this.state !== GameState.PLAYING) return;
    this.gameLoop.update(ticker);
  };

  private endGame(): void {
    this.state = GameState.END;
    this.app.ticker.remove(this.update);

    if (this.boundGameKey) {
      window.removeEventListener("keydown", this.boundGameKey);
      this.boundGameKey = null;
    }

    this.gameLoop.cleanup();
    this.gameLayer.clear();

    const { score, normalCount, goldenCount, shardsCleared } = this.gameLoop;
    this.uiLayer.showResults(score, normalCount, goldenCount, shardsCleared);

    this.boundEndKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        window.removeEventListener("keydown", this.boundEndKey!);
        this.boundEndKey = null;
        this.showMenu();
      }
    };
    window.addEventListener("keydown", this.boundEndKey);
  }
}
