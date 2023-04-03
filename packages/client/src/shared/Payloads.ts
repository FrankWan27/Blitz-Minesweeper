import { ServerEvents } from "./Events"

export namespace Payloads {
  export type LobbyId = {
    lobbyId: string;
  }

  export type GameboardTileUpdate = {
    tiles: TileState,
    x: number,
    y: number
  }

  export type GameboardState = {
    tiles: TileState[][],
    width: number,
    height: number
  }

  export type ClientMove = {
    clientId: string,
    type: MoveType,
    x: number,
    y: number
  }
}

export type TileState = number | 'bomb' | 'blank' | 'hidden' | 'flag';
export type MoveType = 'flag' | 'middleclick' | 'reveal';
// export type[ServerEvents.GameMessage] = {
//   message: string;
//   color?: 'green' | 'red' | 'blue' | 'orange';
// };