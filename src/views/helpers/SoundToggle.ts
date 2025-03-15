import {MainModel} from "../../models/MainModel";
import {MainController} from "../../controllers/MainController";
import {nameof} from "../../tools/globals";
import {BrowserTools} from "../../tools/BrowserTools";
import {MobileOs} from "../../types/MobileOs";

const SPEAKER_VISIBLE_CLASS: string = 'sound-toggle__image--is-visible';

export class SoundToggle {
  private readonly m_mainData: MainModel;
  private readonly m_mainController: MainController;
  private readonly m_button: HTMLElement = document.getElementById('sound-toggle-button');
  private readonly m_container: HTMLElement = document.getElementById('sound-toggle-container');
  private readonly m_speakerOn: HTMLElement = document.getElementById('sound-toggle-speaker-on');
  private readonly m_speakerOff: HTMLElement = document.getElementById('sound-toggle-speaker-off');

  constructor(aMainController: MainController, aMainData: MainModel) {
    this.m_container.style.display = 'none';
    if (BrowserTools.getMobileOs() == MobileOs.iOS) {
      this.m_container.style.display = 'none';
    }
    this.m_mainController = aMainController;
    this.m_mainData = aMainData;
    this.m_button.addEventListener('click', () => this.handleButtonClick());
    this.m_mainData.addPropertyChangeListener(
      nameof<MainModel>(m => m.muteSounds), () => this.handleMuteSoundsChanges()
    );
    this.update();
  }

  public update(): void {
    if (this.m_mainData.muteSounds) {
      this.m_speakerOn.classList.remove(SPEAKER_VISIBLE_CLASS);
      this.m_speakerOff.classList.add(SPEAKER_VISIBLE_CLASS);
    }
    else {
      this.m_speakerOn.classList.add(SPEAKER_VISIBLE_CLASS);
      this.m_speakerOff.classList.remove(SPEAKER_VISIBLE_CLASS);
    }
  }

  private handleButtonClick() {
    this.m_mainController.toggleSound();
  }

  private handleMuteSoundsChanges() {
    this.update();
  }
}