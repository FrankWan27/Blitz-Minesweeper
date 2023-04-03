import { ServerEvents } from "./ServerEvents"

export type ServerPayloads = {
    [ServerEvents.Pong]: {
      message: string;
    };
  
    [ServerEvents.GameMessage]: {
      message: string;
      color?: 'green' | 'red' | 'blue' | 'orange';
    };
  };