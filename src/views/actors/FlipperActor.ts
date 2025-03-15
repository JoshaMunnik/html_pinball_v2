import type {canvas} from "zcanvas";
import {RectangleActor} from "./RectangleActor";
import {FlipperRenderer} from "../renderers/actors/FlipperRenderer";
import {ActorLabel} from "../../types/ActorLabel";
import {sprite} from "zcanvas";
import {FlipperDefinition} from "../../models/definitions/FlipperDefinition";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";

export class FlipperActor extends RectangleActor {
  private m_isUp: boolean;

  constructor(anArguments: FlipperDefinition, anEngine: MatterPhysicsEngine, aCanvas: canvas, aMainData: MainModel) {
    super({...anArguments, width: 136, height: 52, fixed: false}, anEngine, aCanvas, aMainData);
    //this.body.friction = 0.025;
    this.body.friction = 0.0;
    this.m_isUp = false;
  }

  trigger(anUp: boolean): boolean {
    if (anUp === this.m_isUp) {
      return false;
    }
    this.m_isUp = anUp;
    this.engine.triggerFlipper(this.type, this.m_isUp);
    return anUp;
  }

  protected override getRenderer(): sprite | null {
    return new FlipperRenderer(this);
  }

  protected override getLabel(): string {
    return ActorLabel.Flipper;
  }
}


