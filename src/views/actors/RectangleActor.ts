import type {Rectangle, canvas} from "zcanvas";
import {ActorArguments, ActorBase} from "./ActorBase";
import {ActorType} from "../../types/ActorType";
import {DevTools} from "../../tools/DevTools";
import {MathTools} from "../../tools/MathTools";
import {RectangleRenderer} from "../renderers/actors/RectangleRenderer";
import {MatterTools} from "../../tools/MatterTools";
import {sprite} from "zcanvas";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";

export class RectangleActor extends ActorBase {
  /**
   * a Rect is an Actor that can adjust its angle and
   * rotate around a custom pivot point
   */
  constructor(anArguments: ActorArguments, anEngine: MatterPhysicsEngine, aCanvas: canvas, aMainData: MainModel) {
    super(
      {
        ...anArguments,
        type: anArguments.type ?? ActorType.Rectangular,
        fixed: anArguments.fixed ?? true
      },
      anEngine,
      aCanvas,
      aMainData
    );
    if (this.type === ActorType.Rectangular) {
      MatterTools.setupTableBody(this.body);
    }
    this.updateBodyBounds();
  }

  protected override updateBodyBounds(): Rectangle {
    if (this.cached) {
      return this.bounds;
    }
    const {left, top} = super.updateBodyBounds();
    this.pivot.x = left + this.halfWidth;
    this.pivot.y = top + this.halfHeight;
    if (DevTools.isDevelopment()) {
      if (this.angle === 0) {
        this.outline = MathTools.rectangleToPolygon(this.bounds);
      } else {
        this.outline = MathTools.rectangleToRotatedPolygon(this.bounds, this.angle, this.pivot.x, this.pivot.y);
      }
    }
    return this.bounds;
  }

  protected override getRenderer(): sprite | null {
    return this.visible ? new RectangleRenderer(this) : null;
  }
}
