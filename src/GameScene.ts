import { Application } from "pixi.js";
import { GameContainer } from "./layers/GameContainer";
import { MenuScreenContainer } from "./layers/MenuScreenContainer";
import { UIContainer } from "./layers/UIContainer";
import { GameState } from "./types/GameState";

export class GameScene {
  private app: Application;
  private state: GameState = GameState.MENU;

  private gameContainer: GameContainer;
  private uiContainer: UIContainer;
  private menuScreen: MenuScreenContainer;

  constructor(app: Application) {
    this.app = app;

    this.gameContainer = new GameContainer();
    this.uiContainer = new UIContainer();
    this.menuScreen = new MenuScreenContainer();

    app.stage.addChild(this.gameContainer);
    app.stage.addChild(this.uiContainer);
    app.stage.addChild(this.menuScreen);

    this.showMenu();
  }

  private showMenu(): void {
    this.state = GameState.MENU;
    this.gameContainer.removeChildren();
    this.uiContainer.removeChildren();
    this.menuScreen.show();
  }
}
