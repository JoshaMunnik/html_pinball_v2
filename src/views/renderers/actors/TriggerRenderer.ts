import type {Viewport} from "zcanvas";
import {TriggerActor} from "../../actors/TriggerActor";
import {ActorRenderer} from "./ActorRenderer";
import {DevTools} from "../../../tools/DevTools";
import {ActorType} from "../../../types/ActorType";

export class TriggerRenderer extends ActorRenderer<TriggerActor> {

  constructor(anActor: TriggerActor) {
    super(
      anActor,
      {width: anActor.bounds.width, height: anActor.bounds.height}
    );
  }

  draw(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!viewport || !this.actor.isInsideViewport(viewport)) {
      return;
    }

    const {left, top, width, height} = this.actor.bounds;
    const {radius} = this.actor;

    if (DevTools.isDevelopment() && this.actor.mainData.outlines && (this.actor.type === ActorType.Circular)) {
      ctx.save();
      ctx.beginPath();
      ctx.arc((left - viewport.left) + radius, (top - viewport.top) + radius, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = this.actor.active ? "#FFF" : "#00AEEF";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    this.drawActorOutline(ctx, viewport);
  }
}
