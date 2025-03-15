import {MobileOs} from "../types/MobileOs";

export class BrowserTools {
  static hasRoundRect(): boolean {
    try {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('safari') < 0) {
        return false;
      }
      const versionText: string = userAgent.match(/version\/([0-9]+)\./)[1];
      const majorVersion: number = parseInt(versionText.split('.')[0]);
      return majorVersion >= 16;
    }
    catch {
      return false;
    }
  }

  static getMobileOs (): MobileOs {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
      return MobileOs.Android
    }
    else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return MobileOs.iOS
    }
    return MobileOs.Other
  }

}
