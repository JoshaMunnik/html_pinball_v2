import {ScoreBaseRenderer} from "./ScoreBaseRenderer";
import {MainModel} from "../../../models/MainModel";
import {nameof} from "../../../tools/globals";
import {Images} from "../../assets/Images";

export class WindmillScoreRenderer extends ScoreBaseRenderer {
  constructor(aMainData: MainModel) {
    super(
      aMainData,
      nameof<MainModel>(m => m.windmillScoreCount),
      Images.POINTS_300_OFF,
      Images.POINTS_300_ON,
      620,
      721,
      51,
      51,
      60
    );
  }
}
