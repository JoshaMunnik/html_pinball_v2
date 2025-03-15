import type {canvas} from "zcanvas";
import {ActorArguments, ActorBase} from "./ActorBase";
import {BallRenderer} from "../renderers/actors/BallRenderer";
import {ActorType} from "../../types/ActorType";
import {ActorLabel} from "../../types/ActorLabel";
import {sprite} from "zcanvas";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";

export class BallActor extends ActorBase {
  constructor(anArguments: ActorArguments, anEngine: MatterPhysicsEngine, aCanvas: canvas, aMainData: MainModel) {
    super(
      {
        ...anArguments,
        type: ActorType.Circular,
        fixed: false,
        radius: anArguments.radius ?? anArguments.width / 2
      },
      anEngine,
      aCanvas,
      aMainData
    );
    this.body.friction = 0.05;
    this.body.frictionAir = 0.001;
    this.body.frictionStatic = 0.1;
    this.body.restitution = 0;
    this.body.slop = 0.001;
  }

  protected override getRenderer(): sprite | null {
    return new BallRenderer(this);
  }

  protected override getLabel(): string {
    return ActorLabel.Ball;
  }
}
