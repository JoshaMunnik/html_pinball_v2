import {ScoreBaseRenderer} from "./ScoreBaseRenderer";
import {MainModel} from "../../../models/MainModel";
import {nameof} from "../../../tools/globals";
import {Images} from "../../assets/Images";

export class BatteryScoreRenderer extends ScoreBaseRenderer {
  constructor(aMainData: MainModel) {
    super(
      aMainData,
      nameof<MainModel>(m => m.batteryScoreCount),
      Images.POINTS_100_OFF,
      Images.POINTS_100_ON,
      91,
      860,
      51,
      51,
      15
    );
  }
}