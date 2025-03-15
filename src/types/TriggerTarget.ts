/**
 * Triggers are Actors that belong to a group. Depending on the trigger type, how
 * you hit each of these Actors can result in an action happening in the game, like
 * getting a bonus.
 */
export enum TriggerTarget {
  Multiplier,
  SequenceCompletion,
  Teleport,
  Windmills,
  Launched,
  Lane
}
