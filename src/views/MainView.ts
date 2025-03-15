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
  }

  // endregion
}
