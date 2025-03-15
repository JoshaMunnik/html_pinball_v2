// region imports

import {GameSound} from "../types/GameSound";
import {Config} from "../config/Config";
import {MainModel} from "../models/MainModel";
import {nameof} from "../tools/globals";
import {BrowserTools} from "../tools/BrowserTools";
import {MobileOs} from "../types/MobileOs";

// endregion

// region local

const SOUND_FILE_MAP: Map<number, string> = new Map([
  [GameSound.BallOut, "sfx_ball_out.mp3"],
  //[GameSound.BUMP, "sfx_bump.mp3"],
  //[GameSound.BUMPER, "sfx_bumper.mp3"],
  //[GameSound.EVENT, "sfx_event.mp3"],
  [GameSound.Flipper, "sfx_flipper.mp3"],
  //[GameSound.POPPER, "sfx_popper.mp3"],
  //[GameSound.TRIGGER, "sfx_trigger.mp3"],
  [GameSound.Hit, "sfx_hit.mp3"],
  [GameSound.HitAlt, "sfx_hit_alt.mp3"],
  [GameSound.Shoot, "sfx_shoot.mp3"],
  [GameSound.HitElectricity, "sfx_hit_electricity.mp3"],
  [GameSound.Windmills, "sfx_windmills.mp3"],
  [GameSound.Lane, "sfx_lane.mp3"],
]);

// endregion

// region exports

export class SoundService {
  // region private variables

  private readonly m_soundMap: Map<GameSound, HTMLMediaElement> = new Map();
  private m_audioContext?: AudioContext;
  //private m_effectsBus?: BiquadFilterNode;
  private m_masterBus?: AudioNode;
  private readonly m_mainData: MainModel;

  // endregion

  // region constructor

  constructor(aMainData: MainModel) {
    this.m_mainData = aMainData;
    if (BrowserTools.getMobileOs() != MobileOs.iOS) {
      this.m_mainData.addPropertyChangeListener(
        nameof<MainModel>(m => m.muteSounds), () => this.handleMuteSoundsChanges()
      );
    }
  }

  // endregion

  // region public methods

  initialize(): void {
    if (BrowserTools.getMobileOs() == MobileOs.iOS) {
      return;
    }
    if (!this.m_audioContext) {
      this.setupWebAudioAPI();
      this.load();
    }
  }

  play(sound: GameSound): void {
    if (BrowserTools.getMobileOs() == MobileOs.iOS) {
      return;
    }
    if (this.m_mainData.muteSounds) {
      return;
    }
    // assume play is called after there was at least one user interaction
    if (!this.m_soundMap.has(sound)) {
      return;
    }
    const audioElement = this.m_soundMap.get(sound);
    if (audioElement) {
      this.playAudioElement(audioElement);
    }
  }

  // endregion

  // region event handlers

  private handleMuteSoundsChanges()
  {
    if (this.m_mainData.muteSounds) {
      //this.m_soundMap.forEach((media: HTMLMediaElement) => media.pause());
    }
    else {
      this.load();
    }
  }

  // endregion

  // region private methods

  private setupWebAudioAPI(): void {    // @ts-expect-error Property 'webkitAudioContext' does not exist on type 'Window & typeof globalThis'
    const audioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (typeof audioContextConstructor !== "undefined") {
      this.m_audioContext = new audioContextConstructor();
      // a "channel strip" to connect all audio nodes to
      this.m_masterBus = this.m_audioContext.createGain();
      // a bus for all sound effects (biquad filter allows detuning)
      //this.m_effectsBus = this.m_audioContext.createBiquadFilter();
      //this.m_effectsBus.connect(this.m_masterBus);
      // filter connects to the output so we can actually hear stuff
      this.m_masterBus.connect(this.m_audioContext.destination);
    }
  }

  private createAudioElement(source: string, loop = false, bus?: AudioNode): HTMLMediaElement {
    const element: HTMLAudioElement = document.createElement("audio");
    element.crossOrigin = "anonymous";
    element.setAttribute("src", source);

    if (loop) {
      element.setAttribute("loop", "loop");
    }
    // connect sound to AudioContext when supported
    if (bus) {
      const acSound: MediaElementAudioSourceNode = this.m_audioContext.createMediaElementSource(element);
      acSound.connect(bus);
    }
    return element;
  }

  private load() {
    // only load once
    if (this.m_soundMap.size > 0) {
      return;
    }
    SOUND_FILE_MAP.forEach((file, sound) => {
      //this.m_soundMap.set(sound, this.createAudioElement(`${Config.SOUNDS_PATH}/${file}`, false, this.m_effectsBus));
      this.m_soundMap.set(sound, this.createAudioElement(`${Config.SOUNDS_PATH}/${file}`, false, this.m_masterBus));
    });
  }

  private playAudioElement(audioElement: HTMLMediaElement): void {
    if (audioElement.currentTime > 0 && !audioElement.ended) {
      return;
    }
    audioElement.currentTime = 0;
    // randomize pitch to prevent BOREDOM
    /*
    if (this.m_effectsBus) {
      this.m_effectsBus.detune.value = -1200 + (Math.random() * 2400); // in -1200 to +1200 range
    }
     */
    if (!audioElement.paused || audioElement.currentTime) {
      audioElement.currentTime = 0;
    } else {
      audioElement
        .play()
        .then(() => {})
        .catch(() => {})
      ;
    }
  }

  // endregion
}

// endregion