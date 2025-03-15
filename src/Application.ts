// region imports

import {MainController} from "./controllers/MainController";
import {MainModel} from "./models/MainModel";
import {MainView} from "./views/MainView";

// endregion

// region exports

/**
 * Root class, it creates a model, view and controller.
 */
export class Application {
  // region private variables

  private readonly m_mainController: MainController;

  private readonly m_mainModel: MainModel;

  private readonly m_mainView: MainView;

  // endregion

  // region constructor

  constructor() {
    this.m_mainModel = new MainModel();
    this.m_mainController = new MainController(this.m_mainModel);
    this.m_mainView = new MainView(this.m_mainController, this.m_mainModel);
  }

  // endregion

  // region methods

  /**
   * Starts the application.
   */
  async run() {
    await this.m_mainController.start();
  }

  // endregion
}

// endregion
