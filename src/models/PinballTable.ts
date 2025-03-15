import {TableDefinition} from "./definitions/TableDefinition";
import {Config} from "../config/Config";
import {ActorType} from "../types/ActorType";
import {Images} from "../views/assets/Images";
import {TriggerTarget} from "../types/TriggerTarget";
import {TriggerType} from "../types/TriggerType";
import {ScoreType} from "../types/ScoreType";
import {PopperType} from "../types/PopperType";
import {GameSound} from "../types/GameSound";

export const PinballTable: TableDefinition = {
  width: 800,
  height: 1579,
  backgroundHeight: 1521,
  playHeight: 1470,
  background: Images.BACKGROUND,
  body: {
    source: `${Config.IMAGES_PATH}/shape.svg`,
    // to detect these, set to 0 and 0, dump body with console.debug and check min/max ranges
    left: -14,
    top: -275,
    width: 800,
    height: 1579,
  },
  poppers: [
    // the ball launcher (must always be the first entry)
    {left: 741, top: 1372, width: 54, height: 20, forceX: 0, forceY: -60, popperType: PopperType.Launcher, sensor: false},

    // the reflectors at bottom
    {left: 158, top: 1003, width: 8, height: 155, angle: -26, forceX: 6, forceY: -5, popperType: PopperType.Bumper},
    {left: 493, top: 1003, width: 8, height: 155, angle: 26, forceX: -6, forceY: -5, popperType: PopperType.Bumper},

    // bars at top
    {
      left: 140,
      top: 410,
      width: 8,
      height: 60,
      angle: 10,
      forceX: 8,
      forceY: 1,
      scoreType: ScoreType.TopLeftBumper,
      popperType: PopperType.Bumper
    },
    {
      left: 142,
      top: 470,
      width: 8,
      height: 56,
      angle: -15,
      forceX: 8,
      forceY: -3,
      scoreType: ScoreType.TopLeftBumper,
      popperType: PopperType.Bumper
    },
    {
      left: 624,
      top: 410,
      width: 8,
      height: 60,
      angle: -1,
      forceX: -8,
      forceY: 1,
      scoreType: ScoreType.TopRightBumper,
      popperType: PopperType.Bumper
    },
    {
      left: 606,
      top: 470,
      width: 8,
      height: 56,
      angle: 20,
      forceX: -8,
      forceY: -3,
      scoreType: ScoreType.TopRightBumper,
      popperType: PopperType.Bumper
    },
  ],
  flippers: [
    // top flippers

    {type: ActorType.LeftFlipper, left: 214, top: 625 + 4, angle: 2},
    {type: ActorType.RightFlipper, left: 440, top: 625 + 4, angle: -4},

    // bottom flippers

    {type: ActorType.LeftFlipper, left: 214, top: 1259, angle: 2},
    {type: ActorType.RightFlipper, left: 376, top: 1259, angle: -4},
  ],
  reflectors: [
    //{source: `${Config.IMAGES_PATH}/top_left_bumper.svg`, left: 150, top: 406, width: 11, height: 102},
    //{source: `${Config.IMAGES_PATH}/top_right_bumper.svg`, left: 604, top: 406, width: 19, height: 102},
    //{source: `${Config.IMAGES_PATH}/bottom_left_reflector.svg`, left: 110, top: 1038, width: 112, height: 179},
    //{source: `${Config.IMAGES_PATH}/bottom_right_reflector.svg`, left: 488, top: 1038, width: 112, height: 179}
  ],
  rectangles: [
    // sides
    {left: 0, top: 0, width: 2, height: 1579},
    {left: 798, top: 0, width: 2, height: 1579},

    // top gap
    //{left: 196, top: 619, height: 2, width: 40, angle: 25},
    //{left: 563, top: 611, height: 2, width: 34, angle: -45},

    // splitters at top
    {left: 350, top: 145, width: 30, height: 102},
    {left: 436, top: 145, width: 30, height: 102},

    // roof above top bumpers
    {left: 140, top: 394, width: 20, height: 4, angle: 25},
    {left: 624, top: 394, width: 20, height: 4, angle: -25},

    // roof above top helmet
    //{left: 687, top: 792, width: 46, height: 4, angle: -35},

    // roof above top battery
    //{left: 69, top: 741, width: 34, height: 4, angle: 35},

    // at launch area
    {left: 741, top: 1364, width: 20, height: 4, angle: 20},
    {left: 775, top: 1364, width: 20, height: 4, angle: -20},
  ],
  bumpers: [
    // top
    {
      left: 271 - 44 / 2,
      top: 311 - 44 / 2,
      width: 119 - 4,
      height: 86,
      idleBitmap: Images.FLAT_LEFT_OFF,
      hitBitmap: Images.FLAT_LEFT_ON,
      bitmapWidth: 119,
      bitmapDeltaX: -4,
      frames: 5,
      radius: 44,
      scoreType: ScoreType.TopBumper
    },
    {
      left: 449 - 44 / 2,
      top: 308 - 44 / 2,
      width: 120 - 4,
      height: 89,
      idleBitmap: Images.FLAT_RIGHT_OFF,
      hitBitmap: Images.FLAT_RIGHT_ON,
      bitmapWidth: 120,
      bitmapDeltaX: -4,
      frames: 5,
      radius: 44,
      scoreType: ScoreType.TopBumper
    },
    {
      left: 333 - 44 / 2 + 16,
      top: 470 - 44 / 2,
      width: 134 - 20,
      height: 112 - 20,
      idleBitmap: Images.TOWERS_OFF,
      hitBitmap: Images.TOWERS_ON,
      bitmapWidth: 134,
      bitmapDeltaX: -20,
      bitmapDeltaY: -20,
      bitmapHeight: 112,
      frames: 5,
      radius: 44,
      scoreType: ScoreType.TopBumper
    },

    // helmets
    {
      left: 654 - 26 / 2,
      top: 808 - 26 / 2,
      width: 70,
      height: 59,
      type: ActorType.Circular,
      idleBitmap: Images.HELMET_OFF,
      hitBitmap: Images.HELMET_ON,
      frames: 15,
      radius: 26,
      bitmapDeltaX: -4,
      bitmapWidth: 70,
      bitmapHeight: 59,
      scoreType: ScoreType.HelmetBumper
    },
    {
      left: 653 - 26 / 2,
      top: 878 - 26 / 2 + 10,
      width: 54,
      height: 67,
      type: ActorType.Circular,
      idleBitmap: Images.CAMERA_OFF,
      hitBitmap: Images.CAMERA_ON,
      frames: 15,
      radius: 26,
      bitmapDeltaY: -10,
      bitmapWidth: 54,
      bitmapHeight: 67,
      scoreType: ScoreType.HelmetBumper
    },

    // batteries
    {
      left: 71,
      top: 761,
      width: 47,
      height: 86,
      type: ActorType.Rectangular,
      idleBitmap: Images.BATTERY_OFF,
      hitBitmap: Images.BATTERY_ON,
      frames: 15,
      scoreType: ScoreType.BatteryBumper,
      gameSound: GameSound.HitElectricity
    },
    {
      left: 20,
      top: 829,
      width: 47,
      height: 86,
      type: ActorType.Rectangular,
      idleBitmap: Images.BATTERY_OFF,
      hitBitmap: Images.BATTERY_ON,
      frames: 15,
      scoreType: ScoreType.BatteryBumper,
      gameSound: GameSound.HitElectricity
    },
  ],
  triggerGroups: [
    {
      target: TriggerTarget.Windmills,
      type: TriggerType.Bool,
      triggers: [
        {left: 649 - 77 / 2, top: 540, width: 78, height: 78},
        //{left: 649 - 77 / 2, top: 620, width: 77, height: 53},
        //{left: 200, top: 900, width: 200, height: 200}
      ]
    },
    {
      target: TriggerTarget.Launched,
      type: TriggerType.Bool,
      triggers: [
        {left: 412, top: 25, width: 130, height: 130, sensor: true}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.TopLane,
      triggers: [
        {left: 309, top: 163, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.TopLane,
      triggers: [
        {left: 395, top: 163, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.TopLane,
      triggers: [
        {left: 483, top: 163, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.InnerLane,
      triggers: [
        {left: 85, top: 1043, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.InnerLane,
      triggers: [
        {left: 614, top: 1043, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.OuterLane,
      triggers: [
        {left: 17, top: 1132, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
    {
      target: TriggerTarget.Lane,
      type: TriggerType.Bool,
      scoreType: ScoreType.OuterLane,
      triggers: [
        {left: 682, top: 1132, width: 26, height: 66, sensor: true, type: ActorType.Rectangular}
      ]
    },
  ],
  topLayer: [
    {
      width: 182,
      height: 497,
      left: 2,
      top: 147,
      bitmap: Images.TUNNEL_TOP,
    },
    {
      left: 619,
      top: 587,
      width: 102,
      height: 157,
      bitmap: Images.WINDMILLS_TOP
    },
    {
      left: 368 - 70,
      top: 1539 - 97,
      width: 141,
      height: 97,
      bitmap: Images.BOTTOM_OVERLAY
    },
    {
      left: 740,
      top: 1391,
      width: 57,
      height: 131,
      bitmap: Images.LAUNCHER_TOP
    }
  ]
};
