// region imports

import {sprite, Viewport} from "zcanvas";
import {MathTools} from "../../../tools/MathTools";
import {Images} from "../../assets/Images";
import {Config} from "../../../config/Config";

// endregion

// region exports

export class LauncherRenderer extends sprite {
  // region private variables

  private m_active: boolean = false;

  private m_startTime: DOMHighResTimeStamp = -1;

  private m_percentage: number = 0.0;

  // endregion

  // region constructor

  constructor() {
    super({x: 747, y: 1373, width: 40, height: 204 + Config.LAUNCHER_SPACE});
  }

  // endregion

  // region public methods

  start() {
    this.m_active = true;
  }

  stop() {
    this.m_active = false;
    this.m_percentage = 0.0;
    this.m_startTime = -1;
    this.invalidate();
  }

  override update(timestamp: DOMHighResTimeStamp, framesSinceLastUpdate: number): void {
    if (!this.m_active || (this.m_percentage >= 1.0)) {
      return;
    }
    if (this.m_startTime < 0) {
      this.m_startTime = timestamp;
    }
    const elapsed: number = timestamp - this.m_startTime;
    this.m_percentage = Math.min(elapsed / Config.LAUNCH_PULL_TIME, 1.0);
    this.invalidate();
  }

  override draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !MathTools.isInsideViewport(this.getBounds(), viewport)) {
      return;
    }
    const {left, top, width, height} = this.getBounds();
    ctx.drawImage(
      Images.LAUNCHER,
      0,
      0,
      width,
      height,
      left - viewport.left,
      top - viewport.top + Math.floor(Config.LAUNCHER_SPACE * this.m_percentage),
      width,
      height
    );
  }

  // endregion

  // region public properties

  get percentage(): number {
    return this.m_percentage;
  }

  // endregion

}

// endregion