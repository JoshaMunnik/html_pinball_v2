import type {Rectangle} from "zcanvas";
import {ActorType} from "../../types/ActorType";

/**
 * An ObjectDef is the serialized version of an Actor (where the actor
 * type is inferred from the parent property, see TableDef) it basically
 * describes the position and dimensions of an Actor relative to its Table
 * Rectangle coordinates are from the top left of the object, taking rotation into account
 */
export type ObjectDefinition = Rectangle & {
  angle?: number;
  radius?: number;
  // detects collision but does not reflect balls
  sensor?: boolean;
  visible?: boolean;
  type?: ActorType;
};
