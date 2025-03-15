import type {canvas} from "zcanvas";
import {ActorArguments, ActorBase} from "./ActorBase";
import {ActorType} from "../../types/ActorType";
import {ActorLabel} from "../../types/ActorLabel";
import {BumperRenderer} from "../renderers/actors/BumperRenderer";
import {sprite} from "zcanvas";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {BumperDefinition} from "../../models/definitions/BumperDefinition";
import {MainModel} from "../../models/MainModel";
import {ScoreType} from "../../types/ScoreType";
import {GameSound} from "../../types/GameSound";
import {Game} from "../helpers/Game";

export class BumperActor extends ActorBase {
  private m_collided = false;
  private readonly m_idleBitmap: HTMLImageElement;
  private readonly m_hitBitmap: HTMLImageElement;
  private readonly m_frames: number;
  private readonly m_bitmapDeltaX: number;
  private readonly m_bitmapDeltaY: number;
  private readonly m_bitmapWidth: number;
  private readonly m_bitmapHeight: number;
  private readonly m_scoreType: ScoreType;
  private readonly m_gameSound: GameSound | null;

  constructor(aDefinition: BumperDefinition, anEngine: MatterPhysicsEngine, aCanvas: canvas, aMainData: MainModel) {
    super(
      {
        ...aDefinition,
        type: aDefinition.type ?? ActorType.Circular,
        radius: aDefinition.radius ?? aDefinition.width / 2,
        fixed: true,
      },
      anEngine,
      aCanvas,
      aMainData
    );
    this.body.restitution = 1.0;
    this.m_idleBitmap = aDefinition.idleBitmap;
    this.m_hitBitmap = aDefinition.hitBitmap;
    this.m_frames = aDefinition.frames;
    this.m_bitmapDeltaX = aDefinition.bitmapDeltaX ?? 0;
    this.m_bitmapDeltaY = aDefinition.bitmapDeltaY ?? 0;
    this.m_bitmapHeight = aDefinition.bitmapHeight ?? aDefinition.height;
    this.m_bitmapWidth = aDefinition.bitmapWidth ?? aDefinition.width;
    this.m_scoreType = aDefinition.scoreType;
    this.m_gameSound = aDefinition.gameSound ?? null;
  }

  get collided(): boolean {
    return this.m_collided;
  }
  set collided(value: boolean) {
    this.m_collided = value;
  }

  get idleBitmap(): HTMLImageElement {
    return this.m_idleBitmap;
  }

  get hitBitmap(): HTMLImageElement {
    return this.m_hitBitmap;
  }

  get frames(): number {
    return this.m_frames;
  }

  get bitmapDeltaX(): number {
    return this.m_bitmapDeltaX;
  }

  get bitmapDeltaY(): number {
    return this.m_bitmapDeltaY;
  }

  get bitmapWidth(): number {
    return this.m_bitmapWidth;
  }

  get bitmapHeight(): number {
    return this.m_bitmapHeight;
  }

  get scoreType(): ScoreType {
    return this.m_scoreType;
  }

  get gameSound(): GameSound | null {
    return this.m_gameSound;
  }

  protected override getRenderer(): sprite | null {
    return new BumperRenderer(this);
  }

  protected override getLabel(): string {
    return ActorLabel.Bumper;
  }
}
