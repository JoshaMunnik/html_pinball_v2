import {sprite} from "zcanvas";
import {Images} from "../../assets/Images";
import {MainModel} from "../../../models/MainModel";
import {ToggleSprite} from "../components/ToggleSprite";

export class BlueArrowsRenderer extends sprite {
  private readonly m_arrows: ToggleSprite[];
  private readonly m_mainData: MainModel;

  constructor(aMainData: MainModel) {
    super({
      width: 64,
      height: 929 + 32 - 865,
      x: 360,
      y: 865
    });
    this.m_mainData = aMainData;
    this.m_arrows = [
      new ToggleSprite(360, 865, 64, 55, Images.BLUE_ARROW_ON, Images.BLUE_ARROW_OFF, false),
      new ToggleSprite(360, 897, 64, 55, Images.BLUE_ARROW_ON, Images.BLUE_ARROW_OFF, false),
      new ToggleSprite(360, 929, 64, 55, Images.BLUE_ARROW_ON, Images.BLUE_ARROW_OFF, false),
    ];
    this.m_arrows.forEach(arrow => this.addChild(arrow));
  }

  override update(timestamp: DOMHighResTimeStamp, framesSinceLastUpdate: number) {
    super.update(timestamp, framesSinceLastUpdate);
    const index: number = 2 - Math.floor(timestamp / 250) % 3;
    this.m_arrows[index].setState(true);
    this.m_arrows[(index + 1) % 3].setState(false);
  }

}