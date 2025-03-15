// region imports

import {Page} from "../../types/Page";

// endregion

// region local

const SHOW_CLASS: string = 'page--is-visible';

// endregion

// region exports

export class PageBase {
  // region private variables

  private readonly m_element: HTMLDivElement;

  private readonly m_id: Page;

  // endregion

  // region constructor

  protected constructor(anId: Page) {
    this.m_id = anId;
    this.m_element = document.getElementById(anId) as HTMLDivElement;
  }

  // endregion

  // region methods

  async show(): Promise<void> {
    this.m_element.classList.add(SHOW_CLASS);
    return Promise.resolve();
  }

  hide(): void {
    this.m_element.classList.remove(SHOW_CLASS);
  }

  // endregion

  // region properties

  get visible(): boolean {
    return this.m_element.classList.contains(SHOW_CLASS);
  }

  get id(): Page {
    return this.m_id;
  }

  // endregion
}

// endregion
