// region imports

import type {canvas as zCanvas} from "zcanvas";
import {sprite} from "zcanvas";
import {GameMessage} from "../../types/GameMessage";
import {ActorLabel} from "../../types/ActorLabel";
import {PopperActor} from "../actors/PopperActor";
import {GameSound} from "../../types/GameSound";
import {ActorBase} from "../actors/ActorBase";
import {BumperActor} from "../actors/BumperActor";
import Matter from "matter-js";
import {TriggerType} from "../../types/TriggerType";
import {TriggerGroupActor} from "../actors/TriggerGroupActor";
import {TriggerTarget} from "../../types/TriggerTarget";
import {BallActor} from "../actors/BallActor";
import {Config} from "../../config/Config";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {TableDefinition} from "../../models/definitions/TableDefinition";
import {FlipperActor} from "../actors/FlipperActor";
import {RectangleActor} from "../actors/RectangleActor";
import {FlipperType} from "../../types/FlipperType";
import {ActorType} from "../../types/ActorType";
import {RoundEndHandler} from "../../types/RoundEndHandler";
import {CollisionEvent} from "../../types/CollisionEvent";
import {MainController} from "../../controllers/MainController";
import {MainModel} from "../../models/MainModel";
import {ImageTools} from "../../tools/ImageTools";
import {YellowArrowRenderer} from "../renderers/scenery/YellowArrowRenderer";
import {BlueArrowsRenderer} from "../renderers/scenery/BlueArrowsRenderer";
import {ScoreType} from "../../types/ScoreType";
import {WindmillScoreRenderer} from "../renderers/scenery/WindmillScoreRenderer";
import {BatteryScoreRenderer} from "../renderers/scenery/BatteryScoreRenderer";
import {HelmetScoreRenderer} from "../renderers/scenery/HelmetScoreRenderer";
import {DevTools} from "../../tools/DevTools";
import {VertexRenderer} from "../renderers/scenery/VertexRenderer";
import {TopLeftBumperRenderer} from "../renderers/scenery/TopLeftBumperRenderer";
import {TopRightBumperRenderer} from "../renderers/scenery/TopRightBumperRenderer";
import {TopLeftBumperScoreRenderer} from "../renderers/scenery/TopLeftBumperScoreRenderer";
import {TopRightBumperScoreRenderer} from "../renderers/scenery/TopRightBumperScoreRenderer";
import {LauncherRenderer} from "../renderers/scenery/LauncherRenderer";
import {PopperType} from "../../types/PopperType";
import {FreeBallRenderer} from "../renderers/scenery/FreeBallRenderer";
import {WindMillsRenderer} from "../renderers/scenery/WindMillsRenderer";

// endregion

// region local

const HitSounds: GameSound[] = [GameSound.Hit, GameSound.HitAlt];

// endregion

// region exports

export class Game {
  private readonly m_actorMap: Map<number, ActorBase> = new Map();
  private m_engine: MatterPhysicsEngine;
  private readonly m_table: TableDefinition;
  private readonly m_canvas: zCanvas;
  private m_flippers: FlipperActor[] = [];
  private m_triggerGroups: TriggerGroupActor[] = [];
  private m_ball: BallActor;
  private readonly m_roundEndHandler: RoundEndHandler;
  private m_roundStart: number = 0;
  private m_bumpCount: number = 0;
  private m_tilt: boolean = false;
  private m_panOffset: number = 0;
  private readonly m_mainController: MainController;
  private readonly m_mainData: MainModel;
  private m_topLayerSprites: sprite[];
  private m_scenerySprites: sprite[];
  private m_launcherRenderer: LauncherRenderer;
  private m_launched: boolean;
  private m_launcherActive: boolean;
  private m_canLaunch: boolean;
  private m_hitIndex: number = 0;

  private constructor(
    aCanvas: zCanvas,
    aTable: TableDefinition,
    aRoundEndHandler: RoundEndHandler,
    aMainController: MainController,
    aMainData: MainModel
  ) {
    this.m_canvas = aCanvas;
    this.m_table = aTable;
    this.m_mainController = aMainController;
    this.m_mainData = aMainData;
    this.m_roundEndHandler = aRoundEndHandler;
  }

  static async create(
    aCanvas: zCanvas,
    aTable: TableDefinition,
    aRoundEndListener: RoundEndHandler,
    aMainController: MainController,
    aMainData: MainModel
  ): Promise<Game> {
    const result: Game = new Game(aCanvas, aTable, aRoundEndListener, aMainController, aMainData);
    await result.createEngine();
    result.addBackground();
    result.addScenery();
    result.addActors();
    result.addVertices();
    result.addTopLayer();
    result.startRound();
    return result;
  }

  destroy() {
    for (const actor of this.m_actorMap.values()) {
      actor.dispose();
    }
    this.m_actorMap.clear();
    this.m_engine.destroy();
    this.m_topLayerSprites.forEach(topLayerSprite => topLayerSprite.dispose());
    this.m_scenerySprites.forEach(scenerySprite => scenerySprite.dispose());
    while (this.m_canvas.numChildren() > 0) {
      this.m_canvas.removeChildAt(0);
    }
  }

  /**
   * Scales the canvas.
   *
   * @param clientWidth
   * @param clientHeight
   *
   * @return true if canvas was scaled, false otherwise
   */
  scaleCanvas(clientWidth: number, clientHeight: number): boolean {
    console.debug({clientWidth, clientHeight});
    const zoom = clientWidth > clientHeight
      ? Math.min(1.0, clientWidth / this.m_table.width)
      : clientWidth / this.m_table.width;
    const tableHeight: number = this.m_table.height + Config.LAUNCHER_SPACE;
    const ratio = tableHeight / this.m_table.width;
    const width = clientWidth; //Math.min(this.m_table.width, clientWidth);
    const height = Math.min(clientHeight, Math.round(width * ratio));
    // by setting the dimensions we have set the "world size"
    this.m_canvas.setDimensions(this.m_table.width, tableHeight);
    const viewportWidth: number = width / zoom;
    const viewportHeight: number = height / zoom;
    //console.debug({width, height, zoom, viewportWidth, viewportHeight});
    this.m_canvas.setViewport(viewportWidth, viewportHeight);
    // scale canvas to fit in the width
    this.m_canvas.scale(zoom);
    // the vertical offset at which the viewport should pan to follow the ball
    this.m_panOffset = (viewportHeight / 2) - (Config.BALL_SIZE / 2);
    return zoom < 1;
  }

  setFlipperState(type: FlipperType, isPointerDown: boolean): void {
    if (this.m_tilt) {
      return;
    }
    let movedUp = false;
    for (const flipper of this.m_flippers) {
      if (flipper.type === type) {
        movedUp = flipper.trigger(isPointerDown);
      }
    }
    if (movedUp) {
      this.playSound(GameSound.Flipper);
    }
    if (isPointerDown) {
      return;
    }
    for (const group of this.m_triggerGroups) {
      if (type === ActorType.LeftFlipper) {
        group.moveTriggersLeft();
      } else {
        group.moveTriggersRight();
      }
    }
  }

  bumpTable(): void {
    if (this.m_tilt || this.m_mainData.paused || !this.m_ball) {
      return;
    }
    if (Math.abs(this.m_ball.body.velocity.y) > 2) {
      return;
    }
    const horizontalForce: number = this.m_ball.body.velocity.x > 0 ? Config.BUMP_IMPULSE : -Config.BUMP_IMPULSE;
    this.m_engine.launchBall(this.m_ball.body, {x: Math.random() * horizontalForce, y: -Config.BUMP_IMPULSE});
    this.m_bumpCount++;
    if (this.m_bumpCount >= Config.MAX_BUMPS) {
      this.m_tilt = true;
      this.removeBall();
      this.showMessage(GameMessage.Tilt);
      this.endRound(2000);
    } else {
      setTimeout(
        () => {
          this.m_bumpCount = Math.max(0, this.m_bumpCount - 1);
        },
        Config.BUMP_TIMEOUT
      );
    }
    this.playSound(GameSound.Bump);
  }

  startLauncher() {
    if (!this.m_launched && this.m_canLaunch) {
      this.m_launcherActive = true;
      this.m_launcherRenderer.start();
    }
  }

  releaseLauncher() {
    if (!this.m_launcherActive) {
      return;
    }
    const speed = Config.MIN_LAUNCH_SPEED +
      this.m_launcherRenderer.percentage * (Config.MAX_LAUNCH_SPEED - Config.MIN_LAUNCH_SPEED);
    this.m_engine.launchBall(this.m_ball.body, {x: 0, y: -speed});
    this.m_launcherRenderer.stop();
    this.m_launcherActive = false;
    this.m_canLaunch = false;
    this.playSound(GameSound.Shoot);
  }

  /**
   * Should be called when zCanvas invokes update() prior to rendering
   */
  update(timestamp: DOMHighResTimeStamp, framesSinceLastRender: number): void {
    if (this.m_mainData.paused) {
      return;
    }
    // update physics engine
    /*
    const deltaTime: number = 1000 /
      Math.min(Config.FRAME_RATE, this.m_canvas.getActualFrameRate()) *
      (Settings.throttleFramerate ? framesSinceLastRender : 1);
     */
    const deltaTime: number = 1000 / Config.FRAME_RATE;
    this.m_engine.update(deltaTime);
    // update Actors
    this.m_actorMap.forEach(actor => actor.update(timestamp));
    // update scenery & top layer
    this.m_topLayerSprites.forEach(topLayerSprite => topLayerSprite.update(timestamp, framesSinceLastRender));
    this.m_scenerySprites.forEach(scenerySprite => scenerySprite.update(timestamp, framesSinceLastRender));
    // disable free ball after a while (once the ball is launched)
    this.m_mainController.setFreeBall(
      ((window.performance.now() - this.m_roundStart < Config.RETRY_TIMEOUT) || !this.m_launched) &&
      !this.m_mainData.usedFreeBall
    );
    // update ball
    this.updateBall();
  }

  panViewport(yDelta: number): void {
    this.m_canvas.panViewport(0, this.m_canvas.getViewport().top + yDelta);
  }

  get launched(): boolean {
    return this.m_launched;
  }

  private async createEngine(): Promise<void> {
    this.m_engine = await MatterPhysicsEngine.create(
      this.m_table,
      () => this.handleBeforeUpdate(),
      event => this.handleCollision(event),
      this.m_mainData
    );
  }

  private addActorToMap<T extends ActorBase>(anActor: T, anOptionalId?: number): T {
    this.m_actorMap.set(anOptionalId ?? anActor.body.id, anActor);
    return anActor;
  }

  private removeActor(actor: ActorBase): void {
    this.m_actorMap.delete(actor.body.id);
    actor.dispose();
  }

  private removeBall(): void {
    if (this.m_ball) {
      this.removeActor(this.m_ball);
      this.m_ball = null;
    }
  }

  private createBall(left: number, top: number): BallActor {
    this.m_ball = new BallActor(
      {left, top, width: Config.BALL_SIZE, height: Config.BALL_SIZE},
      this.m_engine,
      this.m_canvas,
      this.m_mainData
    );
    this.addActorToMap(this.m_ball);
    this.refreshTopLayer();
    return this.m_ball;
  }

  private addBackground(): void {
    const backgroundRenderer = new sprite({
      width: this.m_table.width,
      height: this.m_table.backgroundHeight,
      bitmap: ImageTools.asImage(this.m_table.background)
    });
    this.m_canvas.addChild(backgroundRenderer);
  }

  private addVertices(): void {
    if (DevTools.isProduction()) {
      return;
    }
    //this.m_canvas.addChild(new VertexRenderer(this.m_mainData, this.m_engine.vertices[1]));
    this.m_engine.vertices.forEach(vertices => {
      this.m_canvas.addChild(new VertexRenderer(this.m_mainData, vertices));
    });
  }

  private addScenery(): void {
    this.m_scenerySprites = [
      new YellowArrowRenderer(this.m_mainData),
      new BlueArrowsRenderer(this.m_mainData),
      new WindmillScoreRenderer(this.m_mainData),
      new BatteryScoreRenderer(this.m_mainData),
      new HelmetScoreRenderer(this.m_mainData),
      new TopLeftBumperRenderer(this.m_mainData),
      new TopRightBumperRenderer(this.m_mainData),
      new TopLeftBumperScoreRenderer(this.m_mainData),
      new TopRightBumperScoreRenderer(this.m_mainData),
      new FreeBallRenderer(this.m_mainData),
      // the launcher is controlled by this class
      this.m_launcherRenderer = new LauncherRenderer()
    ];
    this.m_scenerySprites.forEach(scenerySprite => this.m_canvas.addChild(scenerySprite));
  }

  private addPoppers(): void {
    this.m_table.poppers.map(
      definition => this.addActorToMap(
        new PopperActor(definition, this.m_engine, this.m_canvas, this.m_mainData)
      )
    );
  }

  private addFlippers(): void {
    this.m_flippers = this.m_table.flippers.map(
      definition => this.addActorToMap(
        new FlipperActor(definition, this.m_engine, this.m_canvas, this.m_mainData)
      )
    );
  }

  private addBumpers(): void {
    this.m_table.bumpers.forEach(
      definition => this.addActorToMap(
        new BumperActor(definition, this.m_engine, this.m_canvas, this.m_mainData)
      )
    );
  }

  private addTriggerGroups(): void {
    this.m_triggerGroups = this.m_table.triggerGroups.map(
      definition => {
        const group: TriggerGroupActor = new TriggerGroupActor(
          definition, this.m_engine, this.m_canvas, this.m_mainData
        );
        // individual Trigger bodies' ids are mapped to their parent TriggerGroup
        group.triggers.map(trigger => this.addActorToMap(group, trigger.body.id));
        return group;
      }
    );
  }

  private addRectangles(): void {
    this.m_table.rectangles.forEach(
      definition => this.addActorToMap(
        new RectangleActor(definition, this.m_engine, this.m_canvas, this.m_mainData)
      )
    );
  }

  private addActors(): void {
    this.addPoppers();
    this.addFlippers();
    this.addBumpers();
    this.addTriggerGroups();
    this.addRectangles();
  }

  private addTopLayer() {
    this.m_topLayerSprites = this.m_table.topLayer.map(definition => new sprite({
      x: definition.left,
      y: definition.top,
      width: definition.width,
      height: definition.height,
      bitmap: ImageTools.asImage(definition.bitmap)
    }));
    // special animating sprite on top of all other sprites
    this.m_topLayerSprites.push(new WindMillsRenderer(this.m_mainData));
  }

  private refreshTopLayer(): void {
    // move sprites back to end, so they are on top of all other sprites
    this.m_topLayerSprites.forEach(topLayerSprite => {
      this.m_canvas.removeChild(topLayerSprite);
      this.m_canvas.addChild(topLayerSprite);
    })
  }

  private awardPoints(aScore: ScoreType): void {
    this.m_mainController.addScore(aScore);
  }

  private playSound(aSound: GameSound): void {
    this.m_mainController.playSound(aSound);
  }

  private showMessage(aMessage: GameMessage): void {
    this.m_mainController.showMessage(aMessage);
  }

  private popperCollision(aPopperBody: Matter.Body, aBallBody: Matter.Body): void {
    const popper = this.m_actorMap.get(aPopperBody.id) as PopperActor;
    // ignore auto launchers while ball has not been launched manually
    if (!this.m_launched && (popper.popperType === PopperType.Launcher)) {
      this.m_canLaunch = true;
      return;
    }
    this.m_engine.launchBall(aBallBody, popper.getImpulse());
    if (popper.once) {
      this.showMessage(GameMessage.GotLucky);
      this.removeActor(popper);
    }
    if (popper.scoreType !== ScoreType.None) {
      this.awardPoints(popper.scoreType);
    }
    this.playSound(
      popper.popperType === PopperType.Launcher ? GameSound.Shoot : this.getHitSound()
    );
  }

  private bumperCollision(aBumperBody: Matter.Body, aBallBody: Matter.Body): void {
    const actor: BumperActor = (this.m_actorMap.get(aBumperBody.id) as BumperActor);
    actor.collided = true;
    this.awardPoints(actor.scoreType);
    this.playSound(actor.gameSound ?? this.getHitSound());
  }

  private completeMultiplier() {
    this.m_mainData.multiplier = Math.min(2 * this.m_mainData.multiplier, 32);
    this.showMessage(GameMessage.Multiplier);
  }

  private completeSequenceCompletion(aGroup: TriggerGroupActor): void {
    //this.awardPoints(AwardablePoint.TRIGGER_GROUP_SEQUENCE_COMPLETE * aGroup.completions);
    this.showMessage(aGroup.completeMessage);
  }

  private completeTeleport(aBallBody: Matter.Body): void {
    //this.awardPoints(AwardablePoint.ESCAPE_BONUS);
    this.showMessage(GameMessage.EscapeBonus);
    this.removeBall();
    setTimeout(
      () => {
        this.createBallAtFirstPopper();
      },
      2000
    );
  }

  private completeWindmills(aBallBody: Matter.Body): void {
    if (this.m_mainData.windmills) {
      return;
    }
    this.m_mainController.setWindmills(true);
    this.awardPoints(ScoreType.Windmills);
    this.removeBall();
    this.playSound(GameSound.Windmills);
    setTimeout(
      () => {
        // hard coded coordinate
        this.createBall(645, 644);
        this.refreshTopLayer();
        this.m_engine.launchBall(this.m_ball.body, {x: -20 * Config.GRAVITY, y: 6 * Config.GRAVITY});
      },
      Config.WINDMILL_DURATION
    );
    setTimeout(
      () => {
        this.m_mainController.setWindmills(false);
      },
      Config.WINDMILL_DURATION + 500
    );
  }

  private completeLaunched(): void {
    this.m_launched = true;
    this.m_launcherRenderer.stop();
    if (this.m_mainData.ballCount === Config.BALLS_PER_GAME) {
      this.m_roundStart = window.performance.now();
    }
  }

  private completeLane(aGroup: TriggerGroupActor): void {
    this.awardPoints(aGroup.scoreType);
    this.showMessage(aGroup.completeMessage);
    this.playSound(GameSound.Lane);
  }

  private triggerCollision(aTriggerBody: Matter.Body, aBallBody: Matter.Body): void {
    const triggerGroup = this.m_actorMap.get(aTriggerBody.id) as TriggerGroupActor;
    const groupCompleted = triggerGroup?.trigger(aTriggerBody.id);

    if (triggerGroup.triggerType !== TriggerType.Series) {
      //this.awardPoints(AwardablePoint.TRIGGER);
      if (!groupCompleted) {
        this.playSound(GameSound.Trigger);
      }
    }

    if (groupCompleted) {
      switch (triggerGroup.triggerTarget) {
        default:
          break;
        case TriggerTarget.Multiplier:
          this.completeMultiplier();
          break;
        case TriggerTarget.SequenceCompletion:
          this.completeSequenceCompletion(triggerGroup);
          break;
        case TriggerTarget.Teleport:
          this.completeTeleport(aBallBody);
          break;
        case TriggerTarget.Windmills:
          this.completeWindmills(aBallBody);
          break;
        case TriggerTarget.Launched:
          this.completeLaunched();
          break;
        case TriggerTarget.Lane:
          this.completeLane(triggerGroup);
          break;
      }
      triggerGroup.unsetTriggers();
    }
  }

  private bodyCollision(aBodyA: Matter.Body, aBodyB: Matter.Body): void {
    if (aBodyB.label !== ActorLabel.Ball) {
      return;
    }
    switch (aBodyA.label) {
      case ActorLabel.Popper:
        this.popperCollision(aBodyA, aBodyB);
        break;
      case ActorLabel.Bumper:
        this.bumperCollision(aBodyA, aBodyB);
        break;
      case ActorLabel.Trigger:
        this.triggerCollision(aBodyA, aBodyB);
        break;
    }
  }

  private createBallAtFirstPopper(): void {
    this.createBall(
      this.m_table.poppers[0].left - Config.BALL_SIZE / 2 + 18,
      this.m_table.poppers[0].top - Config.BALL_SIZE - Config.BALL_SIZE / 2
    );
  }

  private updateBall() {
    if (!this.m_ball) {
      return;
    }
    // align viewport with ball (if any)
    const {top, left} = this.m_ball.bounds;
    const y: number = top - this.m_panOffset;
    this.m_canvas.panViewport(0, y);
    // ball is outside of game
    if ((left < 0) || (left >= this.m_table.width)) {
      // remove it
      this.removeBall();
      // and shoot it again
      this.createBallAtFirstPopper();
    }
  }

  private startRound(): void {
    this.m_launched = false;
    this.m_launcherActive = false;
    this.m_canLaunch = false;
    this.createBallAtFirstPopper();
    if (this.m_mainData.ballCount === Config.BALLS_PER_GAME) {
      this.m_mainController.setUsedFreeBall(false);
    }
    this.m_tilt = false;
    this.m_mainData.multiplier = 1;
  }

  private endRound(timeout = 1500): void {
    this.playSound(GameSound.BallOut);
    this.m_roundEndHandler(
      () => {
        this.removeBall();
        this.m_mainController.decreaseBallCount();
        if (this.m_mainData.ballCount > 0) {
          this.startRound();
        }
        else {
          this.m_mainController.gameOver();
        }
      },
      timeout
    );
  }

  private handleCollision(event: CollisionEvent): void {
    event.pairs.forEach(pair => this.bodyCollision(pair.bodyA, pair.bodyB));
  }

  private handleBeforeUpdate(): void {
    if (!this.m_ball) {
      return;
    }
    this.m_engine.capSpeed(this.m_ball.body);
    const {left, top} = this.m_ball.bounds;
    if (top > this.m_table.playHeight) {
      this.removeBall();
      if (this.m_mainData.freeBall && !this.m_tilt) {
        // lost ball directly at game start, let's give the player another chance
        this.m_launched = false;
        this.createBallAtFirstPopper();
        this.showMessage(GameMessage.TryAgain);
      } else {
        this.endRound();
      }
      this.m_mainController.setUsedFreeBall(true);
    }
  }

  private getHitSound(): GameSound {
    const result: GameSound = HitSounds[this.m_hitIndex];
    this.m_hitIndex = (this.m_hitIndex + 1) % HitSounds.length;
    return result;
  }
}

// endregion