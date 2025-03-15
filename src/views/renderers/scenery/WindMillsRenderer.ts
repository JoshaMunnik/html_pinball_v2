// region imports

import {sprite, Viewport} from "zcanvas";
import {MathTools} from "../../../tools/MathTools";
import {Images} from "../../assets/Images";
import {MainModel} from "../../../models/MainModel";
import {UFPropertyChangedCallback} from "@ultraforce/ts-general-lib";
import {nameof} from "../../../tools/globals";
import {Config} from "../../../config/Config";

// endregion

// region internals

const ROW_COUNT: number = 8;
const COL_COUNT: number = 3;

// endregion

// region exports

export class WindMillsRenderer extends sprite {
  private m_frame: number = 0;
  private readonly m_mainData: MainModel;
  private m_lastTimeStamp: DOMHighResTimeStamp = -1;
  private readonly m_windmillChangeListener: UFPropertyChangedCallback;
  private m_start: DOMHighResTimeStamp = -1;
  private m_scoreCount: number;

  constructor(aMainData: MainModel) {
    super({x: 594, y: 511, width: 154, height: 196});
    this.m_mainData = aMainData;
    this.m_windmillChangeListener = () => this.handleWindmillChange();
    this.m_mainData.addPropertyChangeListener(
      nameof<MainModel>(m => m.windmillScoreCount), this.m_windmillChangeListener
    );
    this.m_scoreCount = this.m_mainData.windmillScoreCount;
  }

  private handleWindmillChange() {
    if (this.m_scoreCount !== this.m_mainData.windmillScoreCount) {
      this.m_start = window.performance.now();
      this.m_scoreCount = this.m_mainData.windmillScoreCount;
    }
  }

  dispose() {
    super.dispose();
    this.m_mainData.removePropertyChangeListener(
      nameof<MainModel>(m => m.windmillScoreCount), this.m_windmillChangeListener
    );
  }

  update(timestamp: DOMHighResTimeStamp, framesSinceLastUpdate: number): void {
    if (this.m_start < 0) {
      return;
    }
    if (window.performance.now() - this.m_start > Config.WINDMILL_DURATION) {
      this.m_start = -1;
      return;
    }
    if (this.m_lastTimeStamp < 0) {
      this.m_lastTimeStamp = timestamp;
      return;
    }
    if (timestamp - this.m_lastTimeStamp > 1000 / 12) {
      this.m_frame = (this.m_frame + 1) % (ROW_COUNT * COL_COUNT);
      this.m_lastTimeStamp = timestamp;
      this.invalidate();
    }
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !MathTools.isInsideViewport(this.getBounds(), viewport)) {
      return;
    }
    const {left, top, width, height} = this.getBounds();
    const col = this.m_frame % COL_COUNT;
    const row = Math.floor(this.m_frame / COL_COUNT);
    ctx.drawImage(
      Images.WINDMILLS,
      col * width,
      row * height,
      width,
      height,
      left - viewport.left,
      top - viewport.top,
      width,
      height
    );
  }
}

// endregion