// region imports

import type {canvas, Point, Rectangle, sprite, Viewport} from "zcanvas";
import {collision} from "zcanvas";
import {ActorType} from "../../types/ActorType";
import Matter from "matter-js";
import {MathTools} from "../../tools/MathTools";
import {DevTools} from "../../tools/DevTools";
import {IdTools} from "../../tools/IdTools";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";

// endregion

// region exports

export type ActorArguments = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  radius?: number;
  angle?: number; // provide in degrees
  type?: ActorType;
  visible?: boolean;
  fixed?: boolean;
  sensor?: boolean;
};

/**
 * Base class for actors. An actor encapsulates both a matter body and optional sprite drawn within the canvas.
 */
export class ActorBase {
  // region private variables

  private readonly m_id: number;
  private readonly m_bodyBounds: Rectangle;
  private m_radius: number;
  private m_renderer: sprite | null;
  private readonly m_type: ActorType;
  private readonly m_fixed: boolean;
  private readonly m_sensor: boolean;
  private readonly m_visible: boolean;
  // internally in radians
  private m_angle: number;
  private readonly m_engine: MatterPhysicsEngine;
  private readonly m_canvas: canvas;
  private m_body: Matter.Body | null;
  private readonly m_halfWidth: number;
  private readonly m_halfHeight: number;
  private m_rotatedBounds: Rectangle;
  private readonly m_pivot: Point;
  private readonly m_cached: boolean;
  private readonly m_mainData: MainModel;
  // debug only
  private m_outline: number[];

  // endregion

  // region constructor

  constructor(
    {
      left = 0,
      top = 0,
      width = 1,
      height = 1,
      angle = 0,
      radius = 0,
      fixed = true,
      sensor = false,
      visible = true,
      type = ActorType.Rectangular
    }: ActorArguments = {},
    anEngine: MatterPhysicsEngine,
    aCanvas: canvas,
    aMainData: MainModel
  ) {
    this.m_engine = anEngine;
    this.m_canvas = aCanvas;
    this.m_id = IdTools.generateId();
    this.m_fixed = fixed;
    this.m_sensor = sensor;
    this.m_angle = MathTools.degToRad(angle);
    this.m_radius = radius;
    this.m_type = type;
    this.m_visible = visible;
    this.m_halfWidth = width / 2;
    this.m_halfHeight = height / 2;
    this.m_mainData = aMainData;
    // the bounds supplied to the constructor correspond to the top-left
    // coordinate of the Actor as rendered visually on-screen. The MatterJS Body
    // representing this Actor is however offset by its centre of mass
    // as such we "correct" this internally before syncing with the
    // MatterJS Body during the simulation (see cacheBounds())
    this.m_bodyBounds = {
      left: left + this.m_halfWidth,
      top: top + this.m_halfHeight,
      width,
      height
    };
    this.m_pivot = {x: 0, y: 0};
    if (this.m_angle !== 0) {
      this.m_rotatedBounds = MathTools.rotateRectangle(this.m_bodyBounds, this.m_angle);
      this.m_bodyBounds.left -= (width - this.m_rotatedBounds.width) / 2;
      this.m_bodyBounds.top -= (height - this.m_rotatedBounds.height) / 2;
    }
    // instance variables used by getters (prevents garbage collector hit)
    // invocation of cacheBounds() on position update will set the values properly
    this.m_outline = [];
    this.register();
    if (this.m_body) {
      this.updateBodyBounds();
    }
    this.m_cached = this.m_fixed;
  }

  // endregion

  // region public methods

  dispose(): void {
    this.engine.removeBody(this.m_body);
    this.m_renderer?.dispose();
    this.m_renderer = null;
  }


  isInsideViewport(viewport: Viewport): boolean {
    return collision.isInsideViewport(
      this.m_angle !== 0 ? this.m_rotatedBounds : this.m_bodyBounds,
      viewport
    );
  }

  /**
   * Invoked on each step of the simulation to synchronise
   * the Actors properties with the altered body properties
   */
  update(timestamp: DOMHighResTimeStamp): void {
    this.m_angle = this.m_body.angle;
    this.updateBodyBounds();
  }

  // endregion

  // region public properties

  get body(): Matter.Body {
    return this.m_body;
  }

  get type(): ActorType {
    return this.m_type;
  }

  get engine(): MatterPhysicsEngine {
    return this.m_engine;
  }

  get canvas(): canvas {
    return this.m_canvas;
  }

  get outline(): number[] {
    return this.m_outline;
  }
  protected set outline(value: number[]) {
    this.m_outline = value;
  }

  get bounds(): Rectangle {
    return this.m_bodyBounds;
  }

  get halfWidth(): number {
    return this.m_halfWidth;
  }

  get halfHeight(): number {
    return this.m_halfHeight;
  }

  get angle(): number {
    return this.m_angle;
  }

  get pivot(): Point {
    return this.m_pivot;
  }

  get visible(): boolean {
    return this.m_visible;
  }

  get radius(): number {
    return this.m_radius;
  }
  set radius(value: number) {
    this.m_radius = value;
  }

  get fixed(): boolean {
    return this.m_fixed;
  }

  get sensor(): boolean {
    return this.m_sensor;
  }

  get mainData(): MainModel {
    return this.m_mainData;
  }

  protected get cached(): boolean {
    return this.m_cached;
  }

  // endregion

  // region protected methods

  /**
   * Override in your sub classes to provide a sprite in case this Actor
   * should be visually represented on-screen on the canvas.
   */
  protected getRenderer(): sprite | null {
    return null;
  }

  protected getLabel(): string {
    return `actor-${this.m_id}`;
  }

  /**
   * Invoked on construction. Registers the body inside the physics engine
   * and when existing, constructs the renderer class and adds it onto the canvas
   */
  protected register(): void {
    this.m_body = this.engine.addBody(this, this.getLabel());
    this.m_renderer = this.getRenderer();
    if (this.m_renderer) {
      this.canvas.addChild(this.m_renderer);
    }
  }

  protected updateBodyBounds(): Rectangle {
    if (this.m_cached) {
      return this.m_bodyBounds;
    }
    this.m_bodyBounds.left = this.m_body.position.x - this.m_halfWidth;
    this.m_bodyBounds.top = this.m_body.position.y - this.m_halfHeight;
    if (this.m_angle !== 0) {
      this.m_rotatedBounds = MathTools.rotateRectangle(this.m_bodyBounds, this.m_angle);
    }
    if (DevTools.isDevelopment()) {
      this.m_outline = MathTools.rectangleToPolygon(this.m_bodyBounds);
    }
    return this.m_bodyBounds;
  }

  // endregion
}

// endregion