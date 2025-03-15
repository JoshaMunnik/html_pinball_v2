/**
 * Math utilities
 */

// region imports

import type {Rectangle, Viewport} from "zcanvas";

// endregion

// region locals

const {floor, cos, sin, max, min} = Math;
const ONE_EIGHTY_OVER_PI = 180 / Math.PI;
const PI_OVER_ONE_EIGHTY = Math.PI / 180;
const HALF = 0.5;

// endregion

// region exports

export class MathTools {

  static fastRound(num: number): number {
    return num > 0 ? (num + .5) << 0 : num | 0;
  }

  static radToDeg(radians: number): number {
    return ((radians * ONE_EIGHTY_OVER_PI) + 360) % 360;
  }

  static degToRad(degrees: number): number {
    return degrees * PI_OVER_ONE_EIGHTY;
  }

  static clamp(value: number, minValue: number, maxValue: number): number {
    return max(minValue, min(maxValue, value));
  }

  static rectangleToRotatedPolygon(
    rectangle: Rectangle, angleInRadians: number = 0, pivotX?: number, pivotY?: number
  ): number[] {
    const polygonRectangle: number[] = this.rectangleToPolygon(rectangle);
    const result: number[] = [];
    const xp: number = typeof pivotX === "number" ? pivotX : rectangle.left + rectangle.width * HALF;
    const yp: number = typeof pivotY === "number" ? pivotY : rectangle.top + rectangle.height * HALF;
    for (let index: number = 0; index < 8; index += 2) {
      const t: number = polygonRectangle[index] - xp;
      const v: number = polygonRectangle[index + 1] - yp;
      result.push(xp + floor(t * cos(angleInRadians) - v * sin(angleInRadians)));
      result.push(yp + floor(v * cos(angleInRadians) + t * sin(angleInRadians)));
    }
    return result;
  }

  static rectangleToPolygon(rectangle: Rectangle): number[] {
    const {left, top} = rectangle;
    return [
      left, top,
      left + rectangle.width, top,
      left + rectangle.width, top + rectangle.height,
      left, top + rectangle.height,
      // back to left, top
    ];
  }

  static rotateRectangle(rectangle: Rectangle, angleInRadians = 0, rounded = false): Rectangle {
    if (angleInRadians === 0) {
      return rectangle;
    }
    const {left, top, width, height} = rectangle;
    const x1: number = -width * HALF;
    const x2: number = width * HALF;
    const x3: number = width * HALF;
    const x4: number = -width * HALF;
    const y1: number = height * HALF;
    const y2: number = height * HALF;
    const y3: number = -height * HALF;
    const y4: number = -height * HALF;

    const cosAngle: number = Math.cos(angleInRadians);
    const sinAngle: number = Math.sin(angleInRadians);

    const x11: number = x1 * cosAngle + y1 * sinAngle;
    const y11: number = -x1 * sinAngle + y1 * cosAngle;
    const x21: number = x2 * cosAngle + y2 * sinAngle;
    const y21: number = -x2 * sinAngle + y2 * cosAngle;
    const x31: number = x3 * cosAngle + y3 * sinAngle;
    const y31: number = -x3 * sinAngle + y3 * cosAngle;
    const x41: number = x4 * cosAngle + y4 * sinAngle;
    const y41: number = -x4 * sinAngle + y4 * cosAngle;

    const xMin: number = Math.min(x11, x21, x31, x41);
    const xMax: number = Math.max(x11, x21, x31, x41);
    const yMin: number = Math.min(y11, y21, y31, y41);
    const yMax: number = Math.max(y11, y21, y31, y41);

    const result = {
      width: xMax - xMin,
      height: yMax - yMin,
      left: 0,
      top: 0
    };
    result.left = left - (result.width / 2 - width / 2);
    result.top = top - (result.height / 2 - height / 2);

    if (rounded) {
      result.left = this.fastRound(result.left);
      result.top = this.fastRound(result.top);
      result.width = this.fastRound(result.width);
      result.height = this.fastRound(result.height);
    }
    return result;
  }

  static isInsideViewport(spriteBounds: Rectangle, viewport: Viewport) {
    const {left, top} = spriteBounds;
    return (left + spriteBounds.width) >= viewport.left && left <= viewport.right &&
      (top + spriteBounds.height) >= viewport.top && top <= viewport.bottom;
  }
}

// endregion
