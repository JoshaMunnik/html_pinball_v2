import type {Viewport} from "zcanvas";
import {Rectangle, sprite} from "zcanvas";
import {FlipperActor} from "../../actors/FlipperActor";
import {ActorType} from "../../../types/ActorType";
import {Images} from "../../assets/Images";
import {ActorRenderer} from "./ActorRenderer";

function getFlipperImage(aType: ActorType, aBounds: Rectangle): typeof Image {
  if ((aType === ActorType.LeftFlipper) && (aBounds.top < 800)) {
    return Images.LEFT_TOP_FLIPPER as unknown as typeof Image;
  }
  if ((aType === ActorType.LeftFlipper)) {
    return Images.LEFT_BOTTOM_FLIPPER as unknown as typeof Image;
  }
  if ((aType === ActorType.RightFlipper) && (aBounds.top < 800)) {
    return Images.RIGHT_TOP_FLIPPER as unknown as typeof Image;
  }
  if ((aType === ActorType.RightFlipper)) {
    return Images.RIGHT_BOTTOM_FLIPPER as unknown as typeof Image;
  }
  throw 'unknown flipper type';
}

export class FlipperRenderer extends ActorRenderer<FlipperActor> {
  constructor(anActor: FlipperActor) {
    super(
      anActor,
      {
        bitmap: getFlipperImage(anActor.type, anActor.bounds),
        width: anActor.bounds.width,
        height: anActor.bounds.height
      }
    );
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !this._bitmapReady || !this.actor.isInsideViewport(viewport)) {
      return;
    }
    const {left, top, width, height} = this.actor.bounds;
    const angle = this.actor.angle;
    const rotate = angle !== 0;
    if (rotate) {
      const pivot = this.actor.pivot;
      ctx.save();
      const xD = pivot.x - viewport.left;
      const yD = pivot.y - viewport.top;
      ctx.translate(xD, yD);
      ctx.rotate(angle);
      ctx.translate(-xD, -yD);
    }
    ctx.drawImage(
      this._bitmap, 0, 0, width, height, left - viewport.left, top - viewport.top, width, height
    );
    if (rotate) {
      ctx.restore();
    }
    this.drawActorOutline(ctx, viewport);
  }
}
