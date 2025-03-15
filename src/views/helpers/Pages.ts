// region imports

import {PageBase} from "../pages/PageBase";
import {Page} from "../../types/Page";
import {LoadingPage} from "../pages/LoadingPage";
import {GamePage} from "../pages/GamePage";
import {MainModel} from "../../models/MainModel";
import {MainController} from "../../controllers/MainController";
import {nameof} from "../../tools/globals";
import {IntroductionPage} from "../pages/IntroductionPage";
import {FinishedPage} from "../pages/FinishedPage";

// endregion

// region exports

/**
 * {@link Pages} manages all pages in the application. It makes sure only one page is visible.
 */
export class Pages {
  // region private variables

  /**
   * All pages in the application
   *
   * @private
   */
  private readonly m_pages: Map<Page, PageBase> = new Map();

  /**
   * Model to track
   *
   * @private
   */
  private readonly m_mainData: MainModel;

  /**
   * Current visible page
   *
   * @private
   */
  private m_current: Page;


  // endregion

  // region constructor

  constructor(aMainController: MainController, aMainData: MainModel) {
    this.m_mainData = aMainData;
    // first add pages, this will set the current page then add listener for future changes
    this.add(new LoadingPage());
    this.add(new IntroductionPage(aMainController, aMainData));
    this.add(new GamePage(aMainController, aMainData));
    this.add(new FinishedPage(aMainController, aMainData));
    this.m_mainData.addPropertyChangeListener(
      nameof<MainModel>(m => m.page),
      async () => await this.handlePageChange()
    );
  }

  // endregion

  // region private methods

  /**
   * Shows a page. First the current page gets hidden. If the page is already shown the method does nothing.
   *
   * @param aPage
   *   New page to show
   *
   * @private
   */
  private async show(aPage: Page): Promise<void>
  {
    if (this.m_current === aPage) {
      return;
    }
    this.m_pages.get(this.m_current).hide();
    this.m_current = aPage;
    await this.m_pages.get(this.m_current).show();
  }

  /**
   * Adds a page to the internal list. If the page is visible update the property in the attached
   * {@link MainModel} instance.
   *
   * @param aPage
   *
   * @private
   */
  private add(aPage: PageBase): void
  {
    this.m_pages.set(aPage.id, aPage);
    if (aPage.visible) {
      this.m_current = aPage.id;
      this.m_mainData.page = aPage.id;
    }
  }

  // endregion

  // region event handlers

  /**
   * Handles changes to the {@link MainModel.page}
   *
   * @private
   */
  private async handlePageChange(): Promise<void>
  {
    await this.show(this.m_mainData.page);
  }

  // endregion
}

// endregion
