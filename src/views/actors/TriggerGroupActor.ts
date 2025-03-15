import type {canvas as zCanvas} from "zcanvas";
import {ActorBase} from "./ActorBase";
import {TriggerTarget} from "../../types/TriggerTarget";
import {TriggerType} from "../../types/TriggerType";
import {TriggerActor} from "./TriggerActor";
import {GameMessage} from "../../types/GameMessage";
import {TriggerGroupDefinition} from "../../models/definitions/TriggerGroupDefinition";
import {Config} from "../../config/Config";
import {ObjectDefinition} from "../../models/definitions/ObjectDefinition";
import {ActorLabel} from "../../types/ActorLabel";
import {MatterPhysicsEngine} from "../engine/MatterPhysicsEngine";
import {MainModel} from "../../models/MainModel";
import {ScoreType} from "../../types/ScoreType";

export class TriggerGroupActor extends ActorBase {
  private readonly m_triggerTarget: TriggerTarget;
  private readonly m_triggerType: TriggerType;
  private readonly m_triggers: TriggerActor[];
  private readonly m_completeMessage: GameMessage;
  private m_completions = 0;
  private readonly m_triggerDefinitions: ObjectDefinition[];
  private m_activeTriggers = new Set<number>(); // Body ids of active triggers
  private m_triggerTimeoutStart = 0;
  private readonly m_roundRobin: boolean;
  private readonly m_scoreType: ScoreType;

  constructor(
    anArguments: TriggerGroupDefinition, anEngine: MatterPhysicsEngine, aCanvas: zCanvas, aMainData: MainModel
  ) {
    super({fixed: true}, anEngine, aCanvas, aMainData);
    this.m_triggerTarget = anArguments.target;
    this.m_triggerType = anArguments.type;
    this.m_completeMessage = anArguments.message;
    this.m_roundRobin = anArguments.roundRobin ?? false;
    this.m_triggerDefinitions = anArguments.triggers;
    this.m_scoreType = anArguments.scoreType ?? ScoreType.None;
    this.m_triggers = this.m_triggerDefinitions.map(
      definition => new TriggerActor(definition, this.engine, this.canvas, aMainData)
    );
  }

  get triggerTarget(): TriggerTarget {
    return this.m_triggerTarget;
  }

  get triggerType(): TriggerType {
    return this.m_triggerType;
  }

  get triggers(): TriggerActor[] {
    return this.m_triggers;
  }

  get completeMessage(): GameMessage {
    return this.m_completeMessage;
  }

  get scoreType(): ScoreType {
    return this.m_scoreType;
  }

  get completions(): number {
    return this.m_completions;
  }

  override dispose(): void {
    for (const trigger of this.triggers) {
      trigger.dispose();
    }
    this.triggers.length = 0;
  }

  /**
   * Invoked whenever one of the child Trigger bodies within this TriggerGroup is hit.
   * Returns boolean value indicating whether all triggers have been hit, so the
   * game class can taken appropriate state changing action.
   */
  trigger(triggerBodyId: number): boolean {
    const trigger = this.triggers.find(trigger => trigger.body.id === triggerBodyId);
    if (trigger === undefined) {
      return false;
    }
    this.m_activeTriggers.add(triggerBodyId);
    trigger.active = true;
    const isComplete = this.m_activeTriggers.size === this.triggers.length;
    if (isComplete) {
      this.m_completions++;
    }
    return isComplete;
  }

  moveTriggersLeft(): void {
    if (!this.m_roundRobin || this.m_activeTriggers.size === 0) {
      return;
    }
    const activeValues = this.triggers.map(trigger => trigger.active);
    const first = activeValues.shift();
    activeValues.push(first);
    this.updateTriggers(activeValues);
  }

  moveTriggersRight(): void {
    if (!this.m_roundRobin || this.m_activeTriggers.size === 0) {
      return;
    }
    const activeValues = this.triggers.map(trigger => trigger.active);
    const last = activeValues.pop();
    activeValues.unshift(last);
    this.updateTriggers(activeValues);
  }

  /**
   * Unset the active state of all triggers
   */
  unsetTriggers(): void {
    for (const trigger of this.triggers) {
      trigger.active = false;
    }
    this.m_activeTriggers.clear();
  }

  override update(timestamp: DOMHighResTimeStamp): void {
    if (this.m_activeTriggers.size === 0) {
      return;
    }

    // when trigger type is timed (e.g. all triggers need to be set to active within
    // a certain threshold), we start a timeout that will unset all active triggers if
    // not all of them where activated within this period

    if (this.triggerType === TriggerType.Series) {
      if (this.m_triggerTimeoutStart === 0) {
        this.m_triggerTimeoutStart = timestamp;
      } else {
        if (
          (this.triggerTarget === TriggerTarget.SequenceCompletion) &&
          (timestamp - this.m_triggerTimeoutStart >= Config.SEQUENCE_REPEAT_WINDOW)
        ) {
          this.m_completions = 0;
        }
        if (timestamp - this.m_triggerTimeoutStart >= Config.TRIGGER_EXPIRY) {
          this.unsetTriggers();
          this.m_triggerTimeoutStart = 0;
          this.m_completions = 0;
        }
      }
    }
  }

  protected override register(): void {
  }

  protected override getLabel(): string {
    return ActorLabel.TriggerGroup;
  }

  private updateTriggers(activeValues: boolean[]): void {
    this.m_activeTriggers.clear();

    for (let i = 0, l = this.triggers.length; i < l; ++i) {
      const trigger = this.triggers[i];
      const isActive = activeValues[i];

      trigger.active = isActive;
      if (isActive) {
        this.m_activeTriggers.add(trigger.body.id);
      }
    }
  }
}
