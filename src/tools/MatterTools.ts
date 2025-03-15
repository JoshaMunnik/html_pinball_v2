import Matter from "matter-js";
import {DevTools} from "./DevTools";

export class MatterTools {
  /**
   * Give all static bodies that make up the table (e.g. walls, ramps, rects)
   * the same physical properties.
   */
  static setupTableBody(body: Matter.Body): Matter.Body {
    if (DevTools.isDevelopment()) {
      console.debug({body});
    }
    body.friction = 0;
    body.restitution = 0;
    return body;
  }

  /**
   * Debug method to view the bodies as visualised by the Matter JS renderer
   */
  static renderBodies(engine: Matter.Engine, width = 800, height = 600): Matter.Render {
    const render = Matter.Render.create({
      element: document.body,
      engine,
      options: {
        width,
        height,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true
      }
    });
    const scale = window.innerHeight / height;
    Object.assign(
      render.canvas.style, {
        position: "absolute",
        zIndex: 1,
        top: "50%",
        left: "50%",
        opacity: 0.75,
        transform: `scale(${scale}) translate(-50%, -50%)`,
        ["transform-origin"]: "0 0"
      }
    );
    Matter.Render.run(render);

    return render;
  }
}

