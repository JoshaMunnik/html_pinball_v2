import {ActorBase} from "../../actors/ActorBase";
import {sprite, SpriteSheet, Viewport} from "zcanvas";
import {DevTools} from "../../../tools/DevTools";

export class ActorRenderer<T extends ActorBase> extends sprite {
  // region private variables

  private readonly m_actor: T;

  // endregion

  // region constructor

  protected constructor(
    anActor: T,
    anOptions?: {
      width: number;
      height: number;
      x?: number;
      y?: number;
      bitmap?: (new (width?: number, height?: number) => HTMLImageElement) | HTMLCanvasElement | string;
      collidable?: boolean;
      interactive?: boolean;
      mask?: boolean;
      sheet?: Array<SpriteSheet>;
      sheetTileWidth?: number;
      sheetTileHeight?: number;
    }
  ) {
    super(anOptions);
    this.m_actor = anActor;
  }

  // endregion

  // region public properties

  get actor(): T {
    return this.m_actor;
  }

  // endregion

  // region protected methods

  protected drawActorOutline(aContext: CanvasRenderingContext2D, aViewport: Viewport) {
    if (DevTools.isDevelopment() && this.actor.mainData.outlines) {
      aContext.save();
      const outlineValues = this.actor.outline;
      aContext.translate(-aViewport.left, -aViewport.top);
      aContext.strokeStyle = "red";
      aContext.beginPath();
      aContext.moveTo(outlineValues[0], outlineValues[1]);
      for (let index = 2; index < outlineValues.length; index += 2) {
        aContext.lineTo(outlineValues[index], outlineValues[index + 1]);
      }
      aContext.closePath();
      aContext.stroke();
      aContext.restore();
    }
  }

  // endregion
}