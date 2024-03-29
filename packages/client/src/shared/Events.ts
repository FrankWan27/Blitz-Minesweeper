export enum ServerEvents {
  Exception = "exception",
  ClientJoinLobby = "server.client.join.lobby",
  LobbyState = "server.lobby.state",
  LobbySettings = "server.lobby.settings",
  ServerMessage = "server.game.message",
  GameStart = "server.game.start",
  GameboardUpdate = "server.gameboard.update",
  GameboardState = "server.gameboard.state",
  GameOver = "server.game.over",
  ClientNamesMap = "server.client.names",
}

export const enum ClientEvents {
  LobbyCreate = "client.lobby.create",
  LobbyJoin = "client.lobby.join",
  LobbyLeave = "client.lobby.leave",
  LobbyQuickJoin = "client.lobby.quickjoin",
  LobbySettings = "client.lobby.settings",
  BackToLobby = "client.lobby.back",
  StartGame = "client.start.game",
  RestartGame = 'client.restart.game',
  Move = "client.game.move",
  GetGameState = "client.game.state",
  GetLobbyState = "client.lobby.state",
  SetName = "client.name.set",
}
