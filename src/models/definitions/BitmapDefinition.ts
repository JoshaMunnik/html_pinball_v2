import type {Rectangle} from "zcanvas";

export type BitmapDefinition = Rectangle & {
  bitmap: HTMLImageElement;
}