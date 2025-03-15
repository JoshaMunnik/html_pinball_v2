// region imports

import {sprite, Viewport} from "zcanvas";
import {MathTools} from "../../../tools/MathTools";

// endregion

// region exports

/**
 * A sprite that draws a different bitmap depending on its state.
 */
export class ToggleSprite extends sprite {
  private readonly m_bitmapOn: HTMLImageElement;
  private readonly m_bitmapOff: HTMLImageElement;
  private m_state: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    bitmapOn: HTMLImageElement,
    bitmapOff: HTMLImageElement,
    initialState: boolean
  ) {
    super({x, y, width, height});
    this.m_bitmapOff = bitmapOff;
    this.m_bitmapOn = bitmapOn;
    this.m_state = initialState;
  }

  setState(aState: boolean) {
    if (this.m_state != aState) {
      this.m_state = aState;
      this.invalidate();
    }
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    const {left, top, width, height} = this.getBounds();
    if (!viewport || !MathTools.isInsideViewport({left, top, width, height}, viewport)) {
      return;
    }
    ctx.drawImage(
      this.m_state ? this.m_bitmapOn : this.m_bitmapOff,
      0,
      0,
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