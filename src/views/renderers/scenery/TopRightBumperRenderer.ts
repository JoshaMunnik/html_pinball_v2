import {MainModel} from "../../../models/MainModel";
import {Images} from "../../assets/Images";
import {ScoreBaseRenderer} from "./ScoreBaseRenderer";
import {nameof} from "../../../tools/globals";

export class TopRightBumperRenderer extends ScoreBaseRenderer {
  constructor(aMainData: MainModel) {
    super(
      aMainData,
      nameof<MainModel>(m => m.topRightBumperScoreCount),
      Images.TOP_RIGHT_BUMPER_OFF,
      Images.TOP_RIGHT_BUMPER_ON,
      599,
      398,
      37,
      133,
      15
    );
  }
}