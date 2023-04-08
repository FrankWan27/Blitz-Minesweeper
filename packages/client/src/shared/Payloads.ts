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
    maxPlayers: number,
    clientNames: ClientNamesMap,
    currentPlayer: ClientId,
    playerStatus: PlayerStatusMap
  }

  export type ClientMove = {
    type: MoveType,
    x: number,
    y: number
  }

  export type LobbyChangeSize = {
    lobbyId: string,
    maxSize: number
  }

  export type GameOver = {
    winnerId: string,
    winnerName: string,
    isWinner: boolean
  }
  
  export type ServerException = {
    color?: string,
    message: string
  }

  export type ServerMessage = {
    color?: string,
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
export type ClientNamesMap = {
  [clientId: ClientId] : string
}

export type PlayerStatus = {
  timeRemaining: number,
  alive: boolean
}

// export type[ServerEvents.GameMessage] = {
//   message: string;
//   color?: 'green' | 'red' | 'blue' | 'orange';
// };