// region imports

import {MainModel} from "../../models/MainModel";
import {nameof} from "../../tools/globals";
import {GameMessage} from "../../types/GameMessage";
import {Config} from "../../config/Config";
import {MainController} from "../../controllers/MainController";

// endregion

// region locals

const HIDE_MESSAGE_CLASS: string = 'message__text--hide';
const MESSAGE_HIDDEN_CLASS: string = 'message__text--hidden';

// endregion

// region exports

export class Message {
  private readonly m_mainData: MainModel;
  private readonly m_mainController: MainController;
  private m_timerHandle: NodeJS.Timeout = null;
  private readonly m_messageText: HTMLElement = document.getElementById('message-text');

  constructor(aMainController: MainController, aMainData: MainModel) {
    this.m_mainData = aMainData;
    this.m_mainController = aMainController;
    this.m_mainData.addPropertyChangeListener(
      nameof<MainModel>(m => m.message), () => this.handleMessageChange()
    )
  }

  private showMessage(aMessage: string) {
    this.stopTimer();
    this.m_messageText.classList.remove(MESSAGE_HIDDEN_CLASS);
    setTimeout(
      () => {
        this.m_messageText.innerText = aMessage;
        this.m_messageText.classList.add(HIDE_MESSAGE_CLASS);
        this.startTimer();
      },
      1
    );
  }

  private startTimer() {
    this.m_timerHandle = setTimeout(
      () => {
        this.m_messageText.classList.remove(HIDE_MESSAGE_CLASS);
        this.m_messageText.classList.add(MESSAGE_HIDDEN_CLASS);
        this.m_mainController.showMessage(GameMessage.None);
        this.m_timerHandle = null;
      },
      Config.MESSAGE_DURATION
    );
  }

  private stopTimer() {
    if (this.m_timerHandle) {
      clearTimeout(this.m_timerHandle);
      this.m_messageText.classList.remove(HIDE_MESSAGE_CLASS);
      this.m_timerHandle = null;
    }
  }

  private handleMessageChange() {
    switch (this.m_mainData.message) {
      case GameMessage.Tilt:
        this.showMessage('Tilt!');
        break;
      case GameMessage.TryAgain:
        this.showMessage('Opnieuw');
        break;
    }
  }
}

// endregion