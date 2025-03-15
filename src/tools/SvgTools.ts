// region imports

// @ts-expect-error no type definitions for poly-decomp
import PolyDecomp from "poly-decomp";
import Matter, {Vector} from "matter-js";

// endregion

// region local

// note pathseg polyfill should also be provided onto window as SVGPathSeg
Matter.Common.setDecomp(PolyDecomp);

// SVG parsing can be expensive, maintain a cache for previously parsed files
const vertexCache: Map<string, Vector[][]> = new Map();

/* internal methods */

async function loadSVG(url: string): Promise<XMLDocument> {
  let response: Response = await fetch(url);
  let raw: string = await response.text();
  return (new window.DOMParser()).parseFromString(raw, "image/svg+xml");
}

function selectPaths(document: XMLDocument, selector: string): SVGPathElement[] {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
}

function getPathData(pathData: string) {
  let parts = pathData && pathData.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
    coords;
  let array = [];

  for (let i = 0, l = parts && parts.length; i < l; i++) {
    coords = parts[i].match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
    if (!coords) {
      continue;
    }

    for (let j = 0; j < coords.length; j+=2) {
      array.push({
        x: +coords[j],
        y: +coords[j + 1]
      })
    }
  }

  return array;
}

// endregion

// region exports

export class SvgTools {

  static async loadVertices(filePath: string): Promise<Vector[][]> {
    if (vertexCache.has(filePath)) {
      return vertexCache.get(filePath);
    }
    const svg: XMLDocument = await loadSVG(filePath);
    const paths = selectPaths(svg, "path");
    const vertices: Vector[][] = paths.map(path => Matter.Svg.pathToVertices(path, 30));
    //const vertices: Vector[][] = paths.map(path => getPathData(path.getAttribute('d')));

    vertexCache.set(filePath, vertices);

    return vertices;
  }
}

// endregion

