import {MainModel} from "../models/MainModel";
import {Pages} from "./helpers/Pages";
import {MainController} from "../controllers/MainController";

/**
 * The main view.
 */
export class MainView {
  // region private variables

  private readonly m_pages: Pages;

  // endregion

  // region constructor

  constructor(aMainController: MainController, aMainData: MainModel) {
    this.m_pages = new Pages(aMainController, aMainData);
    window.addEventListener("resize", () => this.handleResize());
    this.handleResize();
  }

  // endregion

  // region event handler

  private handleResize(): void {
    const {clientWidth, clientHeight} = document.documentElement;
    document.documentElement.style.setProperty('--screen-width', `${clientWidth}`);
    document.documentElement.style.setProperty('--screen-height', `${clientHeight}`);
  }

  // endregion
}
