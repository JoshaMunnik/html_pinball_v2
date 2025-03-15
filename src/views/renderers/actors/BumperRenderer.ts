import type {Viewport} from "zcanvas";
import {BumperActor} from "../../actors/BumperActor";
import {ImageTools} from "../../../tools/ImageTools";
import {ActorRenderer} from "./ActorRenderer";
import {DevTools} from "../../../tools/DevTools";
import {ActorType} from "../../../types/ActorType";

export class BumperRenderer extends ActorRenderer<BumperActor> {
  private m_collisionAnimation = false;
  private m_collisionIterations = 0;

  constructor(anActor: BumperActor) {
    super(
      anActor,
      {
        width: anActor.bounds.width,
        height: anActor.bounds.height,
        bitmap: ImageTools.asImage(anActor.idleBitmap)
      }
    );
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !this.actor.isInsideViewport(viewport)) {
      return;
    }
    let {left, top, width, height} = this.actor.bounds;
    if (this.actor.collided) {
      if (!this.m_collisionAnimation) {
        this.m_collisionAnimation = true;
        this.m_collisionIterations = this.actor.frames;
      } else if (--this.m_collisionIterations === 0) {
        this.m_collisionAnimation = false;
        this.actor.collided = false;
      }
    }
    ctx.drawImage(
      this.actor.collided ? this.actor.hitBitmap : this.actor.idleBitmap,
      0,
      0,
      this.actor.bitmapWidth,
      this.actor.bitmapHeight,
      left - viewport.left + this.actor.bitmapDeltaX,
      top - viewport.top + this.actor.bitmapDeltaY,
      this.actor.bitmapWidth,
      this.actor.bitmapHeight
    );
    if (DevTools.isDevelopment() && this.actor.mainData.outlines) {
      if (this.actor.type === ActorType.Circular) {
        ctx.save();
        ctx.strokeStyle = "#00AEEF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc((left - viewport.left) + this.actor.radius, (top - viewport.top) + this.actor.radius, this.actor.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "transparent";
        ctx.stroke();
        ctx.restore();
      }
      else {
        this.drawActorOutline(ctx, viewport);
      }
    }
  }
}
