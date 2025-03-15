import {MainModel} from "../../../models/MainModel";
import {Images} from "../../assets/Images";
import {ScoreBaseRenderer} from "./ScoreBaseRenderer";
import {nameof} from "../../../tools/globals";

export class TopLeftBumperScoreRenderer extends ScoreBaseRenderer {
  constructor(aMainData: MainModel) {
    super(
      aMainData,
      nameof<MainModel>(m => m.topLeftBumperScoreCount),
      Images.POINTS_50_OFF,
      Images.POINTS_50_ON,
      172,
      436,
      51,
      51,
      15
    );
  }
}