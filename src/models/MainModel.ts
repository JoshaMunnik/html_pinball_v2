// region imports

import {Page} from "../types/Page";
import {GameMessage} from "../types/GameMessage";
import {nameof} from "../tools/globals";
import {Config} from "../config/Config";
import {UFStorableModel} from "@ultraforce/ts-dom-lib/dist/models/UFStorableModel";

// endregion

// region locals

const MUTE_SOUNDS_KEY: string = 'pinball_mute_sounds';

// endregion

// region exports


export class MainModel extends UFStorableModel {
  // region private variables

  private m_page: Page = Page.None;

  private m_ballCount: number = Config.BALLS_PER_GAME;

  private m_score: number = 0;

  private m_multiplier: number = 1;

  private m_message: GameMessage = GameMessage.None;

  private m_paused: boolean = false;

  private m_outlines: boolean = false;

  private m_windmills: boolean = false;
  
  private m_windmillScoreCount: number = 0;
  
  private m_topLeftBumperScoreCount: number = 0;
  
  private m_topRightBumperScoreCount: number = 0;
  
  private m_batteryScoreCount: number = 0;
  
  private m_helmetScoreCount: number = 0;
  
  private m_freeBall: boolean = true;
  
  private m_usedFreeBall: boolean = false;

  private m_highscore: number = 0;

  // endregion

  // region properties

  get page(): Page {
    return this.m_page;
  }

  set page(value: Page) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.page),
      this.m_page,
      value,
      value => this.m_page = value
    );
  }

  get message(): GameMessage {
    return this.m_message;
  }

  set message(value: GameMessage) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.message),
      this.m_message,
      value,
      value => this.m_message = value
    );
  }

  get score(): number {
    return this.m_score;
  }

  set score(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.score),
      this.m_score,
      value,
      value => this.m_score = value
    );
  }
  
  get highscore(): number {
    return this.m_highscore;
  }

  set highscore(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.highscore),
      this.m_highscore,
      value,
      value => this.m_highscore = value
    );
  }

  get multiplier(): number {
    return this.m_multiplier;
  }

  set multiplier(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.multiplier),
      this.m_multiplier,
      value,
      value => this.m_multiplier = value
    );
  }

  get ballCount(): number {
    return this.m_ballCount;
  }

  set ballCount(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.ballCount),
      this.m_ballCount,
      value,
      value => this.m_ballCount = value
    );
  }

  get paused(): boolean {
    return this.m_paused;
  }

  set paused(value: boolean) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.paused),
      this.m_paused,
      value,
      value => this.m_paused = value
    );
  }

  get outlines(): boolean {
    return this.m_outlines;
  }

  set outlines(value: boolean) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.outlines),
      this.m_outlines,
      value,
      value => this.m_outlines = value
    );
  }

  get windmills(): boolean {
    return this.m_windmills;
  }

  set windmills(value: boolean) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.windmills),
      this.m_windmills,
      value,
      value => this.m_windmills = value
    );
  }

  get muteSounds(): boolean {
    return this.getStoredBoolProperty(MUTE_SOUNDS_KEY, false);
  }

  set muteSounds(value: boolean) {
    this.setStoredBoolProperty(nameof<MainModel>(m => m.muteSounds), MUTE_SOUNDS_KEY, value);
  }

  get windmillScoreCount(): number {
    return this.m_windmillScoreCount;
  }

  set windmillScoreCount(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.windmillScoreCount),
      this.m_windmillScoreCount,
      value,
      value => this.m_windmillScoreCount = value
    );
  }

  get topLeftBumperScoreCount(): number {
    return this.m_topLeftBumperScoreCount;
  }

  set topLeftBumperScoreCount(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.topLeftBumperScoreCount),
      this.m_topLeftBumperScoreCount,
      value,
      value => this.m_topLeftBumperScoreCount = value
    );
  }

  get topRightBumperScoreCount(): number {
    return this.m_topRightBumperScoreCount;
  }

  set topRightBumperScoreCount(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.topRightBumperScoreCount),
      this.m_topRightBumperScoreCount,
      value,
      value => this.m_topRightBumperScoreCount = value
    );
  }

  get batteryScoreCount(): number {
    return this.m_batteryScoreCount;
  }

  set batteryScoreCount(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.batteryScoreCount),
      this.m_batteryScoreCount,
      value,
      value => this.m_batteryScoreCount = value
    );
  }

  get helmetScoreCount(): number {
    return this.m_helmetScoreCount;
  }

  set helmetScoreCount(value: number) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.helmetScoreCount),
      this.m_helmetScoreCount,
      value,
      value => this.m_helmetScoreCount = value
    );
  }

  get freeBall(): boolean {
    return this.m_freeBall;
  }

  set freeBall(value: boolean) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.freeBall),
      this.m_freeBall,
      value,
      value => this.m_freeBall = value
    );
  }


  get usedFreeBall(): boolean {
    return this.m_usedFreeBall;
  }

  set usedFreeBall(value: boolean) {
    this.processPropertyValue(
      nameof<MainModel>(m => m.usedFreeBall),
      this.m_usedFreeBall,
      value,
      value => this.m_usedFreeBall = value
    );
  }


  // endregion
}

// endregion