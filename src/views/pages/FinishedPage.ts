// region imports

import {PageBase} from "./PageBase";
import {Page} from "../../types/Page";
import {MainController} from "../../controllers/MainController";
import {MainModel} from "../../models/MainModel";
import {nameof} from "../../tools/globals";
import {TextTools} from "../../tools/TextTools";

// endregion

// region exports

export class FinishedPage extends PageBase {
  private readonly m_startButton: HTMLElement = document.getElementById('finished-start-button');
  //private readonly m_highscore: HTMLElement = document.getElementById('finished-highscore');
  private readonly m_score: HTMLElement = document.getElementById('finished-your-score');
  private readonly m_mainController: MainController;
  private readonly m_mainData: MainModel;

  constructor(aMainController: MainController, aMainData: MainModel) {
    super(Page.Finished);
    this.m_mainController = aMainController;
    this.m_mainData = aMainData;
    this.m_startButton.addEventListener('click', () => this.handleStartClick());
    this.m_mainData.addPropertyChangeListener(
      nameof<MainModel>(m => m.highscore), () => this.handleHighscoreChange()
    );
    this.m_mainData.addPropertyChangeListener(
      nameof<MainModel>(m => m.score), () => this.handleScoreChange()
    );
    this.handleHighscoreChange();
    this.handleScoreChange();
  }

  private handleStartClick(): void {
    this.m_mainController.startGame();
  }

  private handleHighscoreChange(): void {
    //this.m_highscore.innerText = TextTools.formatScore(this.m_mainData.highscore);
  }

  private handleScoreChange(): void {
    this.m_score.innerText = TextTools.formatScore(this.m_mainData.score);
  }
}

// endregion