export enum ServerEvents {
  Exception = 'exception',
  ClientJoinLobby = 'server.client.join.lobby',
  LobbyState = 'server.lobby.state',

  GameMessage = 'server.game.message',
  GameStart = 'server.game.start',
  GameboardUpdate = 'server.gameboard.update',
  GameboardState = 'server.gameboard.state',
}


export const enum ClientEvents {
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  LobbyQuickJoin = "client.lobby.quickjoin",
  Move = 'client.game.move',
  GetState = 'client.game.state',
  SetName = 'client.name.set',
}