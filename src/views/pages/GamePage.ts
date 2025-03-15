// region imports

import {PageBase} from "./PageBase";
import {Page} from "../../types/Page";
import {MainController} from "../../controllers/MainController";
import {MainModel} from "../../models/MainModel";
import {canvas} from "zcanvas";
import {Config} from "../../config/Config";
import {TableDefinition} from "../../models/definitions/TableDefinition";
import {PinballTable} from "../../models/PinballTable";
import {UFTypescript} from "@ultraforce/ts-general-lib/dist/tools/UFTypescript";
import {DevTools} from "../../tools/DevTools";
import {Game} from "../helpers/Game";
import {ActorType} from "../../types/ActorType";
import {StatusDisplay} from "../helpers/StatusDisplay";
import {Message} from "../helpers/Message";
import {SoundToggle} from "../helpers/SoundToggle";

// endregion

// region local

const CENTER_CANVAS_CLASS: string = 'canvas-container--centered';

type TouchInformation = {
  y: number;
  time: number;
};

// endregion

// region exports

export class GamePage extends PageBase {
  // region private variables

  private readonly m_canvasContainer: HTMLElement = document.getElementById('canvas-container');

  private readonly m_touchAreaLeft: HTMLElement = document.getElementById('touch-area-left');

  private readonly m_touchAreaRight: HTMLElement = document.getElementById('touch-area-right');

  private readonly m_canvas: canvas;

  private m_game: Game;

  private readonly m_table: TableDefinition;

  private readonly m_keyboardListener: (event: KeyboardEvent) => void;

  private readonly m_resizeListener: () => void;

  private readonly m_touchLeftListener: (event: TouchEvent) => void;

  private readonly m_touchRightListener: (event: TouchEvent) => void;

  private readonly m_mainData: MainModel;

  private readonly m_mainController: MainController;

  private readonly m_touchStart: TouchInformation = {y: 0, time: 0};

  private m_roundEndTimeout: NodeJS.Timeout = null;

  private m_lastBumpTime: number;

  private m_running: boolean = false;

  private readonly m_container: HTMLElement = document.getElementById('canvas-container');

  private readonly m_statusContainer: HTMLElement = document.getElementById('status-display-container');

  private readonly m_statusDisplay: StatusDisplay;

  private readonly m_message: Message;

  private readonly m_soundToggle: SoundToggle;

  // endregion

  // region constructor

  constructor(aMainController: MainController, aMainData: MainModel) {
    super(Page.Game);
    this.m_mainController = aMainController;
    this.m_mainData = aMainData;
    this.m_statusDisplay = new StatusDisplay(aMainData);
    //this.m_soundToggle = new SoundToggle(aMainController, aMainData);
    this.m_message = new Message(aMainController, aMainData);
    this.m_canvas = new canvas({
      width: 2000,
      height: 4000,
      animate: true,
      fps: Config.FRAME_RATE,
      onUpdate: (timestamp: DOMHighResTimeStamp, framesSinceLastRender: number) => this.handleCanvasUpdate(timestamp, framesSinceLastRender)
    });
    this.m_canvas.insertInPage(this.m_canvasContainer);
    // only one table
    this.m_table = PinballTable;
    // need to add and remove listeners, use listener variables
    this.m_keyboardListener = (event) => this.handleKey(event);
    this.m_resizeListener = () => this.handleResize();
    this.m_touchLeftListener = (event: TouchEvent) => this.handleTouch(event, true);
    this.m_touchRightListener = (event: TouchEvent) => this.handleTouch(event, false);
  }

  private handleCanvasUpdate(timestamp: DOMHighResTimeStamp, framesSinceLastRender: number): void {
    if (this.m_game && this.m_running) {
      this.m_game.update(timestamp, framesSinceLastRender);
    }
  }

  // endregion

  // region methods

  override async show() {
    await super.show();
    await this.initGame();
    this.m_running = true;
  }

  hide() {
    this.m_running = false;
    super.hide();
    this.removeListeners();
    this.m_game.destroy();
  }

  // endregion

  private async initGame(): Promise<void> {
    this.m_lastBumpTime = window.performance.now();
    this.m_game = await Game.create(
      this.m_canvas,
      this.m_table,
      (readyCallback, timeout) => this.handleRoundEnd(readyCallback, timeout),
      this.m_mainController,
      this.m_mainData
    );
    this.addListeners();
    // wait single tick
    await UFTypescript.delay(0);
    this.handleResize();
  }

  private bumpTable(): void {
    // throttle so time between bump is at least 150ms
    if (window.performance.now() - this.m_lastBumpTime < 150) {
      return;
    }
    this.m_lastBumpTime = window.performance.now();
    this.m_game.bumpTable();
  }

  private addListeners(): void {
    window.addEventListener("keydown", this.m_keyboardListener);
    window.addEventListener("keyup", this.m_keyboardListener);
    window.addEventListener("resize", this.m_resizeListener);
    this.m_touchAreaLeft.addEventListener('touchstart', this.m_touchLeftListener);
    this.m_touchAreaLeft.addEventListener('touchend', this.m_touchLeftListener);
    this.m_touchAreaLeft.addEventListener('touchcancel', this.m_touchLeftListener);
    this.m_touchAreaRight.addEventListener('touchstart', this.m_touchRightListener);
    this.m_touchAreaRight.addEventListener('touchend', this.m_touchRightListener);
    this.m_touchAreaRight.addEventListener('touchcancel', this.m_touchRightListener);
  }

  private removeListeners(): void {
    window.removeEventListener("keydown", this.m_keyboardListener);
    window.removeEventListener("keyup", this.m_keyboardListener);
    window.removeEventListener("resize", this.handleResize);
    this.m_touchAreaLeft.removeEventListener('touchstart', this.m_touchLeftListener);
    this.m_touchAreaLeft.removeEventListener('touchend', this.m_touchLeftListener);
    this.m_touchAreaLeft.removeEventListener('touchcancel', this.m_touchLeftListener);
    this.m_touchAreaRight.removeEventListener('touchstart', this.m_touchRightListener);
    this.m_touchAreaRight.removeEventListener('touchend', this.m_touchRightListener);
    this.m_touchAreaRight.removeEventListener('touchcancel', this.m_touchRightListener);
  }

  private handleResize(): void {
    const {clientWidth, clientHeight} = document.documentElement;
    const statusHeight: number = this.m_statusContainer.clientHeight;
    const isMobileView: boolean = clientWidth <= 685; // see _variables.scss
    const uiHeight: number = isMobileView ? statusHeight : statusHeight;
    const canvasHeight: number = clientHeight - uiHeight;
    //console.debug({clientWidth, clientHeight, statusHeight, isMobileView, uiHeight, canvasHeight});
    if (this.m_game.scaleCanvas(clientWidth, canvasHeight)) {
      //this.m_canvasContainer.classList.remove(CENTER_CANVAS_CLASS);
    } else {
      //this.m_canvasContainer.classList.add(CENTER_CANVAS_CLASS);
    }
  }

  private handleTouch(event: TouchEvent, isLeft: boolean): void {
    switch (event.type) {
      case "touchstart":
        if (this.m_game.launched) {
          this.m_game.setFlipperState(isLeft ? ActorType.LeftFlipper : ActorType.RightFlipper, true);
          for (const touch of event.touches) {
            this.m_touchStart.y = touch.pageY;
            this.m_touchStart.time = window.performance.now();
          }
        }
        else {
          this.m_game.startLauncher();
        }
        break;
      // touch(cancel|end)
      default:
        if (this.m_game.launched) {
          this.m_game.setFlipperState(isLeft ? ActorType.LeftFlipper : ActorType.RightFlipper, false);
          if (event.type === "touchend" && (window.performance.now() - this.m_touchStart.time) < 400) {
            const movedBy = event.changedTouches[0]?.pageY - this.m_touchStart.y;
            if (movedBy < -100) {
              this.bumpTable();
            }
          }
        }
        else {
          this.m_game.releaseLauncher();
        }
        break;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  private handleKey(event: KeyboardEvent): void {
    const {type, code} = event;
    switch (code) {
      case 'KeyP':
        if (DevTools.isDevelopment() && (type === 'keydown')) {
          this.m_mainController.setPaused(!this.m_mainData.paused);
          event.preventDefault();
        }
        break;
      case 'KeyO':
        if (DevTools.isDevelopment() && (type === 'keydown')) {
          this.m_mainController.setOutlines(!this.m_mainData.outlines);
          event.preventDefault();
        }
        break;
      case 'KeyW':
      case 'ArrowUp':
        if (DevTools.isDevelopment() && (type === 'keydown')) {
          this.m_game.panViewport(-25);
          event.preventDefault();
        }
        break;
      case 'KeyS':
      case 'ArrowDown':
        if (DevTools.isDevelopment() && (this.m_mainData.paused) && (type === 'keydown')) {
          this.m_game.panViewport(25);
          event.preventDefault();
        }
        else if (type === 'keydown') {
          this.m_game.startLauncher();
        }
        else if (type === 'keyup') {
          this.m_game.releaseLauncher();
        }
        break;
      case 'Space':
        if (type === "keydown") {
          this.bumpTable();
        }
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'KeyA':
      case 'ShiftLeft':
        this.m_game.setFlipperState(ActorType.LeftFlipper, type === "keydown");
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
      case 'ShiftRight':
        this.m_game.setFlipperState(ActorType.RightFlipper, type === "keydown");
        event.preventDefault();
        break;
    }
  }

  private handleRoundEnd(readyCallback: () => void, timeout: number): void {
    if (this.m_roundEndTimeout !== null) {
      // existing round end pending (e.g.: ball fell after tilt triggered round end)
      return;
    }
    this.m_roundEndTimeout = setTimeout(
      () => {
        readyCallback();
        this.m_roundEndTimeout = null;
      },
      timeout
    );
  }
}

// endregion
