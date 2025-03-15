import Matter, {Vector} from "matter-js";
// @ts-expect-error no type definitions for matter-attractors
import MatterAttractors from "matter-attractors";
import {ActorBase} from "../actors/ActorBase";
import {ActorType} from "../../types/ActorType";
import {ActorLabel} from "../../types/ActorLabel";
import {FlipperPosition} from "../../types/FlipperPosition";
import {Point} from "zcanvas";
import {Config} from "../../config/Config";
import {TableDefinition} from "../../models/definitions/TableDefinition";
import {DevTools} from "../../tools/DevTools";
import {SvgTools} from "../../tools/SvgTools";
import {MatterTools} from "../../tools/MatterTools";
import {CollisionEvent} from "../../types/CollisionEvent";
import {MainModel} from "../../models/MainModel.js";

Matter.use(MatterAttractors);

export class MatterPhysicsEngine {
  // region private variables

  private readonly m_engine: Matter.Engine;

  private m_render?: Matter.Render = null;

  private readonly m_handleBeforeUpdate: () => void;

  private readonly m_handleCollision: (event: CollisionEvent) => void;

  private readonly m_ignoreGroup: number;

  private readonly m_table: TableDefinition;

  private m_leftFlipperUp: boolean;

  private m_rightFlipperUp: boolean;

  private readonly m_mainData: MainModel;

  private readonly m_vertices: Vector[][] = [];

  // endregion

  // region constructor

  private constructor(
    aTable: TableDefinition,
    aHandleBeforeUpdate: () => void,
    aHandleCollision: (event: CollisionEvent) => void,
    aMainData: MainModel
  ) {
    this.m_handleCollision = aHandleCollision;
    this.m_handleBeforeUpdate = aHandleBeforeUpdate;
    this.m_mainData = aMainData;
    this.m_engine = Matter.Engine.create();
    this.m_table = aTable;
    this.m_leftFlipperUp = false;
    this.m_rightFlipperUp = false;
    const {width, height} = aTable;
    // this is hefty, but in pinball we only have the ball(s) moving while all other
    // bodies are static, as such we can increase the collision detection accuracy
    this.m_engine.positionIterations = 100;
    this.m_engine.velocityIterations = 16;
    this.m_engine.world.gravity.y = Config.GRAVITY;
    this.m_engine.world.bounds = {
      min: {x: 0, y: 0},
      max: {x: width, y: height}
    };
    Matter.Events.on(this.m_engine, "collisionStart", this.m_handleCollision);
    Matter.Events.on(this.m_engine, "beforeUpdate", this.m_handleBeforeUpdate);
    // collision group to be ignored by all circular Actors
    this.m_ignoreGroup = Matter.Body.nextGroup(true);
    //this.startRender();
  }

  // endregion

  // region factory methods

  static async create(
    aTable: TableDefinition,
    aBeforeUpdateHandler: () => void,
    aCollisionHandler: (event: CollisionEvent) => void,
    aMainData: MainModel
  ): Promise<MatterPhysicsEngine> {
    const instance = new MatterPhysicsEngine(aTable, aBeforeUpdateHandler, aCollisionHandler, aMainData);
    await instance.addTableBody();
    await instance.addTableReflectors();
    return instance;
  }

  // endregion

  // region properties

  get engine(): Matter.Engine {
    return this.m_engine;
  }

  get vertices(): Vector[][] {
    return this.m_vertices;
  }

  // endregion

  // region methods

  update(aDeltaTime: number): void {
    Matter.Engine.update(this.m_engine, aDeltaTime);
  }

  addBody(actor: ActorBase, label: string): Matter.Body {
    switch (actor.type) {
      default:
      case ActorType.Rectangular:
        return this.addRectangleBody(actor, label);
      case ActorType.Circular:
        return this.addCircularBody(actor, label);
      case ActorType.LeftFlipper:
      case ActorType.RightFlipper:
        return this.addFlipperBody(actor, label);
    }
  }

  removeBody(body: Matter.Body): void {
    Matter.World.remove(this.m_engine.world, body);
  }

  updateBodyPosition(body: Matter.Body, position: Point): void {
    Matter.Body.setPosition(body, position);
  }

  launchBall(body: Matter.Body, impulse: Point): void {
    Matter.Body.setVelocity(body, impulse);
  }

  triggerFlipper(type: ActorType, isUp: boolean): void {
    if (type === ActorType.LeftFlipper) {
      this.m_leftFlipperUp = isUp;
    } else {
      this.m_rightFlipperUp = isUp;
    }
  }

  capSpeed(body: Matter.Body): void {
    Matter.Body.setVelocity(body, {
      x: Math.max(Math.min(body.velocity.x, Config.MAX_SPEED), -Config.MAX_SPEED),
      y: Math.max(Math.min(body.velocity.y, Config.MAX_SPEED), -Config.MAX_SPEED),
    });
  }

  destroy(): void {
    Matter.Events.off(this.m_engine, "collisionStart", this.m_handleCollision);
    Matter.Events.off(this.m_engine, "beforeUpdate", this.m_handleBeforeUpdate);
    this.stopRender();
    // @ts-expect-error 3rd argument not defined in .d.ts file but exists (clears all child Composites recursively)
    Matter.World.clear(this.m_engine.world, false, true);
    Matter.Engine.clear(this.m_engine);
  }

  // endregion

  // region private methods

  private stopRender() {
    if (this.m_render) {
      Matter.Render.stop(this.m_render);
      this.m_render.canvas.remove();
      this.m_render.canvas = null;
      this.m_render.context = null;
      this.m_render.textures = {};
      this.m_render = null;
    }
  }

  private startRender(): void {
    if (DevTools.isDevelopment() && !this.m_render) {
      this.m_render = MatterTools.renderBodies(this.engine, this.m_table.width, this.m_table.height);
    }
  }

  private createIgnorable(x: number, y: number, radius: number, optPlugin?: any): Matter.Body {
    return Matter.Bodies.circle(
      x,
      y,
      radius,
      {
        isStatic: true,
        collisionFilter: {
          group: this.m_ignoreGroup
        },
        plugin: optPlugin,
      }
    );
  }

  private addVertices(aLeft: number, aTop: number, aVertices: Vector[]): void {
    this.m_vertices.push(
      aVertices.map(vector => Vector.create(vector.x + aLeft, vector.y + aTop))
    );
  }

  private addMultipleVertices(aLeft: number, aTop: number, aVertices: Vector[][]): void {
    aVertices.forEach(vertices => this.addVertices(aLeft, aTop, vertices));
  }

  private async addTableBody(): Promise<void> {
    const bodyVertices: Vector[][] = await SvgTools.loadVertices(this.m_table.body.source);
    const left: number = this.m_table.body.left + this.m_table.body.width / 2;
    const top: number = this.m_table.body.top + this.m_table.body.height / 2;
    Matter.Composite.add(
      this.m_engine.world,
      MatterTools.setupTableBody(Matter.Bodies.fromVertices(left, top, bodyVertices, {isStatic: true,}, true))
    );
    this.addMultipleVertices(0, 0, bodyVertices);
  }

  private async addTableReflectors(): Promise<void> {
    for (const reflector of this.m_table.reflectors) {
      const bodyVertices = await SvgTools.loadVertices(reflector.source);
      const left: number = reflector.left + reflector.width / 2;
      const top: number = reflector.top + reflector.height / 2;
      Matter.Composite.add(
        this.m_engine.world,
        Matter.Bodies.fromVertices(left, top, bodyVertices, {isStatic: true, restitution: 1,}, true)
      );
      // unclear why top needs to be adjusted like that
      this.addMultipleVertices(reflector.left - this.m_table.body.left, reflector.top - reflector.height * 0.25, bodyVertices);
    }
  }

  private addRectangleBody(actor: ActorBase, label: string): Matter.Body {
    const {left, top, width, height} = actor.bounds;
    const body = Matter.Bodies.rectangle(
      left,
      top,
      width,
      height,
      {
        label,
        isSensor: actor.sensor,
        angle: actor.angle,
        isStatic: actor.fixed,
      }
    );
    Matter.World.add(this.m_engine.world, body);
    return body;
  }

  private addCircularBody(actor: ActorBase, label: string): Matter.Body {
    const {left, top, width, height} = actor.bounds;
    const isBumper = label !== ActorLabel.Ball;
    const body = Matter.Bodies.circle(
      left + actor.radius / 2,
      top + actor.radius / 2,
      actor.radius,
      {
        label,
        isSensor: actor.sensor,
        isStatic: actor.fixed,
        collisionFilter: {
          group: !isBumper ? this.m_ignoreGroup : undefined
        },
      }
    );
    Matter.World.add(this.m_engine.world, body);
    return body;
  }

  private plugin(position: FlipperPosition, id: number, isLeftFlipper: boolean): object {
    return {
      attractors: [
        (a: Matter.Body, b: Matter.Body): Point => {
          if (b.id !== id) {
            return;
          }
          const isFlipperUp = isLeftFlipper ? this.m_leftFlipperUp : this.m_rightFlipperUp;
          if (position === FlipperPosition.Up && isFlipperUp ||
            position === FlipperPosition.Down && !isFlipperUp) {
            return {
              x: (a.position.x - b.position.x) * Config.FLIPPER_FORCE,
              y: (a.position.y - b.position.y) * Config.FLIPPER_FORCE,
            };
          }
        }
      ]
    };
  }

  private addFlipperBody(actor: ActorBase, label: string): Matter.Body {
    const {left, top, width, height} = actor.bounds;
    const isLeftFlipper = actor.type === ActorType.LeftFlipper;
    const body = Matter.Bodies.rectangle(
      left,
      top,
      width,
      height,
      {
        label,
        frictionAir: 0,
        chamfer: {},
      }
    );
    const {id} = body;
    const pivotX = isLeftFlipper ? left - width / 2 : left + width / 2;
    const pivotY = top;
    const pivot = Matter.Bodies.circle(pivotX, pivotY, 5, {isStatic: true});
    const constraint = Matter.Constraint.create({
      pointA: {x: pivotX, y: pivotY},
      bodyB: body,
      pointB: {x: isLeftFlipper ? -width / 2 : width / 2, y: 0},
      stiffness: 0
    });
    // we restrict the area of movement by using non-visible circles that cannot collide with the balls
    const ignorableX = isLeftFlipper ? pivotX + 30 : pivotX - 20;
    const lowerMultiplier = isLeftFlipper ? 0.8 : 0.7;
    const ignore1 = this.createIgnorable(
      ignorableX, pivotY - width * 0.9, height * 1.5, this.plugin(FlipperPosition.Up, id, isLeftFlipper)
    );
    const ignore2 = this.createIgnorable(
      ignorableX, pivotY + width * lowerMultiplier, height, this.plugin(FlipperPosition.Down, id, isLeftFlipper)
    );
    Matter.World.add(this.m_engine.world, [ignore1, ignore2]); // otherwise attractors won't work
    const composite = Matter.Composite.add(
      Matter.Composite.create(), [body, pivot, constraint, ignore1, ignore2]
    );
    Matter.Composite.rotate(composite, actor.angle, {x: pivotX, y: pivotY});
    Matter.World.add(this.m_engine.world, composite);
    return body;
  }

  // endregion
}
