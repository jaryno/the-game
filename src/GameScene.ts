import { Application, Ticker } from "pixi.js";
import { GameContainer } from "./layers/GameContainer";
import { MenuScreenContainer } from "./layers/MenuScreenContainer";
import { UIContainer } from "./layers/UIContainer";
import { GameState } from "./types/GameState";
import { GameLoop } from "./GameLoop.ts";

export class GameScene {
  private app: Application;
  private state: GameState = GameState.MENU;

  private readonly gameContainer: GameContainer;
  private readonly uiContainer: UIContainer;
  private readonly menuScreen: MenuScreenContainer;

  private readonly gameLoop: GameLoop;

  private boundGameKey: ((e: KeyboardEvent) => void) | null = null;
  private boundEndKey: ((e: KeyboardEvent) => void) | null = null;

  constructor(app: Application) {
    this.app = app;

    this.gameContainer = new GameContainer();
    this.uiContainer = new UIContainer();

    this.menuScreen = new MenuScreenContainer();
    this.menuScreen.onStart = () => this.startGame();

    this.gameLoop = new GameLoop(this.gameContainer);

    app.stage.addChild(this.gameContainer);
    app.stage.addChild(this.uiContainer);
    app.stage.addChild(this.menuScreen);

    this.showMenu();
  }

  private showMenu(): void {
    this.state = GameState.MENU;
    this.gameLoop.cleanup();
    this.gameContainer.removeChildren();
    this.uiContainer.removeChildren();
    this.menuScreen.show();
  }

  private startGame(): void {
    this.state = GameState.PLAYING;
    this.menuScreen.hide();
    this.uiContainer.init();

    this.gameLoop.start();

    this.gameLoop.setOnTimeUpdate((s) => this.uiContainer.setTimerText(s));
    this.gameLoop.setOnScoreUpdate((s) => this.uiContainer.setScore(s));
    this.gameLoop.setOnTimeUp(() => this.endGame());

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
    this.gameContainer.removeChildren();

    const { score, goldenCount } = this.gameLoop;
    this.uiContainer.showResults(score, goldenCount);

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
