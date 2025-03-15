import type {canvas} from "zcanvas";
import {ActorArguments, ActorBase} from "./ActorBase";
import {ActorType} from "../../types/ActorType";
import {TriggerRenderer} from "../renderers/actors/TriggerRenderer";
import {ActorLabel} from "../../types/ActorLabel";
import {sprite} from "zcanvas";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";

export class TriggerActor extends ActorBase {
  private m_active = false;

  constructor(anArguments: ActorArguments, anEngine: MatterPhysicsEngine, aCanvas: canvas, aMainData: MainModel) {
    super(
      {
        ...anArguments,
        type: anArguments.type ?? ActorType.Circular,
        radius: anArguments.radius ?? anArguments.width / 2,
        fixed: true
      },
      anEngine,
      aCanvas,
      aMainData
    );
  }

  get active(): boolean {
    return this.m_active;
  }
  set active(value: boolean) {
    this.m_active = value;
  }

  protected override getRenderer(): sprite | null {
    return this.visible ? new TriggerRenderer(this) : null;
  }

  protected override getLabel(): string {
    return ActorLabel.Trigger;
  }
}
