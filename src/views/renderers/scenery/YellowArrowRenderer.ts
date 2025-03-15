import {Images} from "../../assets/Images";
import {MainModel} from "../../../models/MainModel";
import {ToggleSprite} from "../components/ToggleSprite";

/**
 * Yellow arrow reacts to windmills trigger.
 */
export class YellowArrowRenderer extends ToggleSprite {
  private readonly m_mainData: MainModel;

  constructor(aMainData: MainModel) {
    super(566, 778, 63, 75, Images.YELLOW_ARROW_ON, Images.YELLOW_ARROW_OFF, true);
    this.m_mainData = aMainData;
  }

  override update(timestamp: DOMHighResTimeStamp, framesSinceLastUpdate: number) {
    const oddOrEven: number = Math.floor(timestamp / 500) & 1;
    this.setState(!!oddOrEven || this.m_mainData.windmills);
  }
}