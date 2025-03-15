import {ScoreBaseRenderer} from "./ScoreBaseRenderer";
import {MainModel} from "../../../models/MainModel";
import {nameof} from "../../../tools/globals";
import {Images} from "../../assets/Images";

export class HelmetScoreRenderer extends ScoreBaseRenderer {
  constructor(aMainData: MainModel) {
    super(
      aMainData,
      nameof<MainModel>(m => m.helmetScoreCount),
      Images.POINTS_100_OFF,
      Images.POINTS_100_ON,
      592,
      863,
      51,
      51,
      15
    );
  }
}