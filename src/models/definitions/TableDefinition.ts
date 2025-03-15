import {PopperDefinition} from "./PopperDefinition";
import {TriggerGroupDefinition} from "./TriggerGroupDefinition";
import {ObjectDefinition} from "./ObjectDefinition";
import {ShapeDefinition} from "./ShapeDefinition";
import {FlipperDefinition} from "./FlipperDefinition";
import {BitmapDefinition} from "./BitmapDefinition";
import {BumperDefinition} from "./BumperDefinition";

/**
 * The data model for a pinball table, it combines all
 * the definitions above to define the table contents and "game world".
 */
export type TableDefinition = {
  width: number;
  height: number;
  // if ball drops below this value, it is gone
  playHeight: number;
  // height of background image
  backgroundHeight: number;
  background: HTMLImageElement,
  body: ShapeDefinition,
  poppers: PopperDefinition[];
  flippers: FlipperDefinition[];
  reflectors: ShapeDefinition[];
  rectangles: ObjectDefinition[];
  bumpers: BumperDefinition[];
  triggerGroups: TriggerGroupDefinition[];
  topLayer: BitmapDefinition[];
};
