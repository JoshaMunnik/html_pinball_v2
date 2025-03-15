import {ToggleSprite} from "../components/ToggleSprite";
import {MainModel} from "../../../models/MainModel";
import {Images} from "../../assets/Images";
import {nameof} from "../../../tools/globals";
import {UFPropertyChangedCallback} from "@ultraforce/ts-general-lib";

export class FreeBallRenderer extends ToggleSprite {
  private readonly m_mainData: MainModel;
  private readonly m_freeBallListener: UFPropertyChangedCallback;

  constructor(aMainData: MainModel) {
    super(334, 1383, 64, 63, Images.BOTTOM_LIGHT_ON, Images.BOTTOM_LIGHT_OFF, aMainData.freeBall);
    this.m_mainData = aMainData;
    this.m_freeBallListener = () => this.handleFreeBallChange();
    this.m_mainData.addPropertyChangeListener(nameof<MainModel>(m => m.freeBall), this.m_freeBallListener);
  }

  dispose() {
    super.dispose();
    this.m_mainData.removePropertyChangeListener(
      nameof<MainModel>(m => m.freeBall), this.m_freeBallListener
    );
  }

  private handleFreeBallChange() {
    this.setState(this.m_mainData.freeBall);
  }
}