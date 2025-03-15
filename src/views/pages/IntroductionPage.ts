// region imports

import {PageBase} from "./PageBase";
import {Page} from "../../types/Page";
import {MainController} from "../../controllers/MainController";
import {MainModel} from "../../models/MainModel";
import {nameof} from "../../tools/globals";
import {TextTools} from "../../tools/TextTools";

// endregion

// region exports

export class IntroductionPage extends PageBase {
  private readonly m_startButton: HTMLElement = document.getElementById('introduction-start-button');
  private readonly m_highscore: HTMLElement = document.getElementById('introduction-highscore');
  private readonly m_mainController: MainController;
  private readonly m_mainData: MainModel;

  constructor(aMainController: MainController, aMainData: MainModel) {
    super(Page.Introduction);
    this.m_mainController = aMainController;
    this.m_mainData = aMainData;
    this.m_startButton.addEventListener('click', () => this.handleStartClick());
    this.m_mainData.addPropertyChangeListener(nameof<MainModel>('highscore'), () => this.handleHighscoreChange());
    this.handleHighscoreChange();
  }

  private handleStartClick(): void {
    this.m_mainController.startGame();
  }

  private handleHighscoreChange(): void {
    this.m_highscore.innerText = TextTools.formatScore(this.m_mainData.highscore);
  }
}

// endregion