// region imports

import {sprite, Viewport} from "zcanvas";
import {MainModel} from "../../../models/MainModel";
import {Vector} from "matter-js";
import {MathTools} from "../../../tools/MathTools";

// endregion

// region locals

/**
 * Processes a list of vertices and determines the bounding box, adjusting the vertices to be relative to the top-left
 *
 * @param aVertices
 */
function processVertices(
  aVertices: Vector[]
): {top: number, left: number, width: number, height: number, path: Vector[]} {
  let top: number = Number.MAX_VALUE;
  let left: number = Number.MAX_VALUE;
  let bottom: number = Number.MIN_VALUE;
  let right: number = Number.MIN_VALUE;
  aVertices.forEach(vertex => {
    left = Math.min(left, vertex.x);
    right = Math.max(right, vertex.x);
    top = Math.min(top, vertex.y);
    bottom = Math.max(bottom, vertex.y);
  });
  const path: Vector[] = aVertices.map(
    vertex => Vector.create(vertex.x - left, vertex.y - top)
  );
  return {left, top, width: right - left, height: bottom - top, path};
}

// endregion

// region exports

/**
 * Renders a set of vertices as a polygon
 */
export class VertexRenderer extends sprite {
  // region private variables

  private readonly m_mainData: MainModel;
  private readonly m_path: Vector[];

  // endregion

  // region constructor

  constructor(aMainData: MainModel, aVertices: Vector[]) {
    const {top, left, width, height, path} = processVertices(aVertices);
    super({x: left, y: top, width, height});
    this.m_path = path;
    this.m_mainData = aMainData;
    //console.debug('VertexRenderer', this.getBounds(), this.m_path, aVertices);
  }

  // endregion

  // region public methods

  override draw(aContext: CanvasRenderingContext2D, aViewport: Viewport): void {
    const {left, top, width, height} = this.getBounds();
    if (!aViewport || !MathTools.isInsideViewport(this.getBounds(), aViewport) || !this.m_mainData.outlines) {
      return;
    }
    aContext.save();
    aContext.translate(-aViewport.left, -aViewport.top);
    aContext.strokeStyle = "green";
    aContext.lineWidth = 2;
    aContext.beginPath();
    aContext.moveTo(this.m_path[0].x + left, this.m_path[0].y + top);
    for (let index = 1; index < this.m_path.length; index++) {
      aContext.lineTo(this.m_path[index].x + left, this.m_path[index].y + top);
    }
    aContext.closePath();
    aContext.stroke();
    aContext.restore();
    /*
    aContext.save();
    aContext.translate(-aViewport.left, -aViewport.top);
    aContext.strokeStyle = "red";
    aContext.rect(left, top, width, height);
    aContext.stroke();
    aContext.restore();
    */
  }

  // endregion
}

// endregion