/**
 * The types of triggers.
 * Bool -> all Actors in the Trigger group must be hit for the action to happen
 * Series -> all Actors in the Trigger group must be hit in succession (within
 * a TRIGGER_EXPIRY grace period) for the action to happen
 */
export enum TriggerType {
  Bool,
  Series,
}
