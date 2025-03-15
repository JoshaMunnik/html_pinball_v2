import type {Viewport} from "zcanvas";
import {Images} from "../../assets/Images";
import {Config} from "../../../config/Config";
import {BallActor} from "../../actors/BallActor";
import {ActorRenderer} from "./ActorRenderer";

export class BallRenderer extends ActorRenderer<BallActor> {
  constructor(anActor: BallActor) {
    super(
      anActor,
      {
      bitmap: Images.BALL as unknown as typeof Image,
      width: Config.BALL_SIZE,
      height: Config.BALL_SIZE
    });
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !this._bitmapReady || !this.actor.isInsideViewport(viewport)) {
      return;
    }
    const {left, top, width, height} = this.actor.bounds;
    ctx.save();
    ctx.drawImage(
      this._bitmap, 0, 0, width, height, left - viewport.left, top - viewport.top, width, height
    );
    ctx.restore();

    this.drawActorOutline(ctx, viewport);
  }
}
