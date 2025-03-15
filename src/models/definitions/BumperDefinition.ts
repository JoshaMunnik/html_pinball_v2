import type {Rectangle} from "zcanvas";
import {ActorType} from "../../types/ActorType";
import {ScoreType} from "../../types/ScoreType";
import {GameSound} from "../../types/GameSound";

export type BumperDefinition = Rectangle & {
  type?: ActorType;
  idleBitmap: HTMLImageElement;
  hitBitmap: HTMLImageElement;
  frames: number;
  radius?: number;
  bitmapDeltaX?: number;
  bitmapDeltaY?: number;
  bitmapWidth?: number;
  bitmapHeight?: number;
  scoreType: ScoreType;
  gameSound?: GameSound;
}