import {Config} from "../../config/Config";

export const Images = new class ImagesClass {
  // region private variables
  
  private m_loadingCount: number = 0;
  private m_loadedCount: number = 0;
  
  // endregion
  
  // region public methods

  doneLoading(): boolean {
    return this.m_loadedCount >= this.m_loadingCount;
  }
  
  // endregion

  // region public constants

  readonly BACKGROUND: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/background.png`);
  readonly BALL: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/ball.png`);
  readonly BATTERY_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/battery_off.png`);
  readonly BATTERY_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/battery_on.png`);
  readonly BLUE_ARROW_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/blue_arrow_off.png`);
  readonly BLUE_ARROW_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/blue_arrow_on.png`);
  readonly BOTTOM_LIGHT_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/bottom_light_off.png`);
  readonly BOTTOM_LIGHT_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/bottom_light_on.png`);
  readonly BOTTOM_OVERLAY: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/bottom_overlay.png`);
  readonly CAMERA_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/camera_off.png`);
  readonly CAMERA_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/camera_on.png`);
  readonly FLAT_LEFT_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/flat_left_off.png`);
  readonly FLAT_LEFT_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/flat_left_on.png`);
  readonly FLAT_RIGHT_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/flat_right_off.png`);
  readonly FLAT_RIGHT_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/flat_right_on.png`);
  readonly HELMET_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/helmet_off.png`);
  readonly HELMET_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/helmet_on.png`);
  readonly LAUNCHER: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/launcher.png`);
  readonly LAUNCHER_TOP: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/launcher_top.png`);
  readonly LEFT_BOTTOM_FLIPPER: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/left_bottom_flipper.png`);
  readonly LEFT_TOP_FLIPPER: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/left_top_flipper.png`);
  readonly POINTS_100_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/points_100_off.png`);
  readonly POINTS_100_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/points_100_on.png`);
  readonly POINTS_50_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/points_50_off.png`);
  readonly POINTS_50_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/points_50_on.png`);
  readonly POINTS_300_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/points_300_off.png`);
  readonly POINTS_300_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/points_300_on.png`);
  readonly RIGHT_BOTTOM_FLIPPER: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/right_bottom_flipper.png`);
  readonly RIGHT_TOP_FLIPPER: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/right_top_flipper.png`);
  readonly TOP_LEFT_BUMPER_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/top_left_bumper_off.png`);
  readonly TOP_LEFT_BUMPER_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/top_left_bumper_on.png`);
  readonly TOP_RIGHT_BUMPER_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/top_right_bumper_off.png`);
  readonly TOP_RIGHT_BUMPER_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/top_right_bumper_on.png`);
  readonly TOWERS_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/towers_off.png`);
  readonly TOWERS_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/towers_on.png`);
  readonly TUNNEL_TOP: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/tunnel_top.png`);
  readonly WINDMILLS: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/windmills.png`);
  readonly WINDMILLS_TOP: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/windmills_top.png`);
  readonly YELLOW_ARROW_OFF: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/yellow_arrow_off.png`);
  readonly YELLOW_ARROW_ON: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/yellow_arrow_on.png`);
  readonly SPRITE_SHEET_10FPS: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/sprite_sheet_10fps.png`);
  readonly SPRITE_SHEET_15FPS: HTMLImageElement = this.loadImage(`${Config.IMAGES_PATH}/sprite_sheet_15fps.png`);

  // endregion
  
  // region private methods

  private loadImage(aSource: string): HTMLImageElement {
    const result = new Image();
    this.m_loadingCount++;
    result.addEventListener('load', () => this.m_loadedCount++);
    result.src = aSource;
    return result;
  }

  // endregion
}
