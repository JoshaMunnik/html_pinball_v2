import type {Viewport} from "zcanvas";
import {RectangleActor} from "../../actors/RectangleActor";
import {BrowserTools} from "../../../tools/BrowserTools";
import {ActorRenderer} from "./ActorRenderer";

export class RectangleRenderer extends ActorRenderer<RectangleActor> {
  constructor(anActor: RectangleActor) {
    super(
      anActor,
      {
        width: anActor.bounds.width,
        height: anActor.bounds.height
      }
    );
    // roundRect() is not available in all browsers
    // when unsupported, remove radius from Actor (should only have a minor effect, radius is cosmetic for Rects)
    anActor.radius = !BrowserTools.hasRoundRect() ? 0 : anActor.radius;
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !this.actor.isInsideViewport(viewport)) {
      return;
    }
    /*
    const {left, top, width, height} = this.actor.bounds;
    const {angle, radius} = this.actor;
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
    ctx.fillStyle = "rgba(128,128,128,0.5)";
    if (radius === 0) {
      ctx.fillRect(left - viewport.left, top - viewport.top, width, height);
    } else {
      ctx.beginPath();
      ctx.roundRect(left - viewport.left, top - viewport.top, width, height, radius);
      ctx.fill();
    }
    if (rotate) {
      ctx.restore();
    }
    */
    this.drawActorOutline(ctx, viewport);
  }
}
