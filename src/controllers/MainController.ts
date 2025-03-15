// region imports

import {MainModel} from "../models/MainModel";
import {Page} from "../types/Page";
import {GameMessage} from "../types/GameMessage";
import {Images} from "../views/assets/Images";
import {UFTypescript} from "@ultraforce/ts-general-lib/dist/tools/UFTypescript";
import {SoundService} from "../services/SoundService";
import {GameSound} from "../types/GameSound";
import {ScoreType} from "../types/ScoreType";
import {ScoreService} from "../services/ScoreService";
import {Config} from "../config/Config";

// endregion

// region locals

const SCORE_MAP: Map<ScoreType, number> = new Map([
  [ScoreType.BatteryBumper, 100],
  [ScoreType.HelmetBumper, 100],
  [ScoreType.Windmills, 300],
  [ScoreType.TopLeftBumper, 50],
  [ScoreType.TopRightBumper, 50],
  [ScoreType.TopBumper, 10],
  [ScoreType.TopLane, 10],
  [ScoreType.InnerLane, 10],
  [ScoreType.OuterLane, 25],
]);

// endregion

// region exports

export class MainController {
  // region private variables

  private readonly m_mainData: MainModel;
  private readonly m_soundService: SoundService;
  private readonly m_scoreService: ScoreService;

  // endregion

  // region constructor

  constructor(aData: MainModel) {
    this.m_mainData = aData;
    this.m_soundService = new SoundService(aData);
    this.m_scoreService = new ScoreService();
  }

  // endregion

  // region methods

  async start() {
    while(!Images.doneLoading()) {
      await UFTypescript.delay(100);
    }
    this.m_mainData.highscore = await this.m_scoreService.loadHighscore();
    this.m_mainData.page = Page.Introduction;
    //this.m_mainData.page = Page.GAME;
    //this.m_mainData.page = Page.FINISHED;
  }

  startGame(): void {
    this.m_mainData.lock();
    this.m_mainData.page = Page.Game;
    this.m_mainData.score = 0;
    this.m_mainData.ballCount = Config.BALLS_PER_GAME;
    this.m_mainData.unlock();
    this.m_soundService.initialize();
  }

  showMessage(aMessage: GameMessage): void {
    this.m_mainData.message = aMessage;
  }

  setPaused(aValue: boolean): void {
    this.m_mainData.paused = aValue;
  }

  setOutlines(aValue: boolean): void {
    this.m_mainData.outlines = aValue;
  }

  setWindmills(aValue: boolean): void {
    this.m_mainData.windmills = aValue;
  }

  gameOver(): void {
    this.m_mainData.page = Page.Introduction;
    /*
    if (this.m_mainData.score > this.m_mainData.highscore) {
      this.m_mainData.highscore = this.m_mainData.score;
    }
    this.m_mainData.page = Page.Finished;
    this.m_scoreService
      .saveScore(this.m_mainData.score)
      .then(highscore => {
        if (highscore > 0) {
          this.m_mainData.highscore = highscore;
        }
      });
     */
  }

  playSound(aSound: GameSound): void {
    this.m_soundService.play(aSound);
  }

  toggleSound(): void {
    this.m_mainData.muteSounds = !this.m_mainData.muteSounds;
  }

  addScore(aScoreType: ScoreType): void {
    this.m_mainData.lock();
    this.m_mainData.score += SCORE_MAP.get(aScoreType)!;
    switch(aScoreType) {
      case ScoreType.BatteryBumper:
        this.m_mainData.batteryScoreCount++;
        break;
      case ScoreType.Windmills:
        this.m_mainData.windmillScoreCount++;
        break;
      case ScoreType.HelmetBumper:
        this.m_mainData.helmetScoreCount++;
        break;
      case ScoreType.TopLeftBumper:
        this.m_mainData.topLeftBumperScoreCount++;
        break;
      case ScoreType.TopRightBumper:
        this.m_mainData.topRightBumperScoreCount++;
        break;
    }
    this.m_mainData.unlock();
  }

  setFreeBall(aState: boolean): void {
    this.m_mainData.freeBall = aState;
  }

  setUsedFreeBall(aState: boolean): void {
    this.m_mainData.lock();
    this.m_mainData.usedFreeBall = aState;
    this.m_mainData.freeBall = !aState;
    this.m_mainData.unlock();
  }

  decreaseBallCount(): void {
    if (this.m_mainData.ballCount > 0) {
      this.m_mainData.ballCount--;
    }
  }
  
  // endregion
}

// endregion

