export class Config {
  static readonly FRAME_RATE: number = 60;
  static readonly BALL_SIZE: number = 40;

  // physics configuration
  static readonly GRAVITY: number = 0.75;
  static readonly FLIPPER_FORCE: number = 0.002666666 * this.GRAVITY;
  static readonly MAX_SPEED: number = 50 * this.GRAVITY;

  // launcher
  static readonly LAUNCHER_SPACE: number = 60;
  static readonly MIN_LAUNCH_SPEED: number = 10 * this.GRAVITY;
  static readonly MAX_LAUNCH_SPEED: number = 50 * this.GRAVITY;
  static readonly LAUNCH_PULL_TIME: number = 1000;

  // the table will tilt when more than MAX_BUMPS have occurred
  // before each bumps BUMP_TIMEOUT has passed
  static readonly MAX_BUMPS: number = 3;
  static readonly BUMP_IMPULSE: number = 4;
  static readonly BUMP_TIMEOUT: number = 2000;
  static readonly BALLS_PER_GAME: number = 3;

  // if a Ball is lost within this period, player gets a free retry
  static readonly RETRY_TIMEOUT: number = 4800;

  // duration of animation and that ball is stuck
  static readonly WINDMILL_DURATION: number = 1500;

  static readonly MESSAGE_DURATION: number = 2000;

  /**
   * The amount of milliseconds that are allowed to pass before the active triggers
   * within a not-fully activated Trigger group expire
   */
  static readonly TRIGGER_EXPIRY: number = 5000;

  /**
   * The amount of milliseconds within which the same sequence can be completed
   * for the same Trigger group to be awarded extra points
   */
  static readonly SEQUENCE_REPEAT_WINDOW: number = 3000;

  static readonly IMAGES_PATH: string = './images';

  static readonly SOUNDS_PATH: string = './sounds';

}
