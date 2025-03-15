import {FlipperType} from "../../types/FlipperType";

export type FlipperDefinition = {
  type: FlipperType;
  left: number;
  top: number;
  angle?: number;
};
