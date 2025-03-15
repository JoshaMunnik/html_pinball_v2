import type {Point, canvas} from "zcanvas";
import {RectangleActor} from "./RectangleActor";
import {Config} from "../../config/Config";
import {ActorLabel} from "../../types/ActorLabel";
import {DevTools} from "../../tools/DevTools";
import {RectangleRenderer} from "../renderers/actors/RectangleRenderer";
import {sprite} from "zcanvas";
import {PopperDefinition} from "../../models/definitions/PopperDefinition";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";
import {ScoreType} from "../../types/ScoreType";
import {PopperType} from "../../types/PopperType";

export class PopperActor extends RectangleActor {
  private readonly m_once: boolean;
  private readonly m_impulse: Point;
  private readonly m_scoreType: ScoreType;
  private readonly m_popperType: PopperType;

  constructor(anArguments: PopperDefinition, anEngine: MatterPhysicsEngine, aCanvas: canvas, aMainData: MainModel) {
    super({...anArguments, fixed: true, sensor: anArguments.sensor ?? true}, anEngine, aCanvas, aMainData);
    this.m_once = anArguments.once ?? false;
    this.m_impulse = {x: anArguments.forceX * Config.GRAVITY, y: anArguments.forceY * Config.GRAVITY};
    this.m_scoreType = anArguments.scoreType ?? ScoreType.None;
    this.m_popperType = anArguments.popperType;
  }

  getImpulse(): Point {
    return this.m_impulse;
  }

  get once(): boolean {
    return this.m_once;
  }

  get scoreType(): ScoreType {
    return this.m_scoreType;
  }

  get popperType(): PopperType {
    return this.m_popperType;
  }

  protected override getLabel(): string {
    return ActorLabel.Popper;
  }

  protected override getRenderer(): sprite | null {
     // Poppers are by default invisible, but it might be convenient to debug their position
    return DevTools.isDevelopment() ? new RectangleRenderer(this) : null;
  }
}
