import {GameMessage} from "./GameMessage";

export type MessageHandler = (message: GameMessage, optDuration?: number) => void;
