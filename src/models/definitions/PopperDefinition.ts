import type {Rectangle} from "zcanvas";
import {ScoreType} from "../../types/ScoreType";
import {PopperType} from "../../types/PopperType";

/**
 * A Popper is a mechanism that provides an impulse on the Ball.
 *
 * Multiple poppers can be added to a table. Poppers that are defined to only work
 * once will be removed from the active game upon first use.
 */
export type PopperDefinition = Rectangle & {
  angle?: number;
  forceX: number;
  forceY: number;
  once?: boolean;
  scoreType?: ScoreType;
  popperType: PopperType;
  sensor?: boolean;
};
