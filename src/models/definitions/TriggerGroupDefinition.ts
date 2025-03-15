import {ObjectDefinition} from "./ObjectDefinition";
import {TriggerTarget} from "../../types/TriggerTarget";
import {TriggerType} from "../../types/TriggerType";
import {GameMessage} from "../../types/GameMessage";
import {ScoreType} from "../../types/ScoreType";

export type TriggerGroupDefinition = {
  target: TriggerTarget;
  type: TriggerType;
  triggers: ObjectDefinition[];
  params?: any;
  // whether to apply round-robin active state switching on flipper up
  roundRobin?: boolean;
  // optional identifier of message to flash once completed
  message?: GameMessage;
  scoreType?: ScoreType;
};

