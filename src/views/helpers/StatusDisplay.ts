import {MainModel} from "../../models/MainModel";
import {TextTools} from "../../tools/TextTools";
import {Config} from "../../config/Config";

export class StatusDisplay {
  // region private variables

  private readonly m_mainData: MainModel;

  private readonly m_yourScore: HTMLElement = document.getElementById('status-your-score');

  private readonly m_balls: HTMLElement = document.getElementById('status-balls');

  private readonly m_highscore: HTMLElement = document.getElementById('status-highscore');

  // endregion

  // region constructor

  constructor(aMainData: MainModel) {
    this.m_mainData = aMainData;
    this.m_mainData.addChangeListener(() => this.handleMainDataChange());
    this.handleMainDataChange();
  }

  // endregion

  // region event handlers

  private handleMainDataChange(): void {
    this.m_highscore.innerText = TextTools.formatScore(this.m_mainData.highscore);
    this.m_balls.innerHTML = (Config.BALLS_PER_GAME - this.m_mainData.ballCount + 1) + '&nbsp;/&nbsp;' + Config.BALLS_PER_GAME;
    this.m_yourScore.innerText = TextTools.formatScore(this.m_mainData.score);
  }

  // endregion
}