import {MainModel} from "../../../models/MainModel";
import {Images} from "../../assets/Images";
import {ScoreBaseRenderer} from "./ScoreBaseRenderer";
import {nameof} from "../../../tools/globals";

export class TopLeftBumperRenderer extends ScoreBaseRenderer {
  constructor(aMainData: MainModel) {
    super(
      aMainData,
      nameof<MainModel>(m => m.topLeftBumperScoreCount),
      Images.TOP_LEFT_BUMPER_OFF,
      Images.TOP_LEFT_BUMPER_ON,
      140,
      398,
      37,
      133,
      15
    );
  }
}