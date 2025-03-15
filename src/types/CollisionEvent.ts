import Matter from "matter-js";

export type CollisionEvent = {
  pairs: { bodyA: Matter.Body, bodyB: Matter.Body }[]
};

