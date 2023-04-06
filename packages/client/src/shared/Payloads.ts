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


  export type LobbyState = {
    lobbyId: string,
    gameStarted: boolean,
    gamePaused: boolean,
    gameEnded: boolean,
    playerCount: number,
    currentPlayer: ClientId,
    playerStatus: PlayerStatusMap
  }

  export type ClientMove = {
    type: MoveType,
    x: number,
    y: number
  }

  export type ServerException = {
    message: string
  }

  export type Name = {
    name: string
  }
}

export type TileState = number | 'bomb' | 'blank' | 'hidden' | 'flag';
export type MoveType = 'flag' | 'middleclick' | 'reveal';
export type ClientId = string;

export type PlayerStatusMap = {
  [clientId: ClientId] : PlayerStatus
}

export type PlayerStatus = {
  timeRemaining: number,
  alive: boolean
}

// export type[ServerEvents.GameMessage] = {
//   message: string;
//   color?: 'green' | 'red' | 'blue' | 'orange';
// };