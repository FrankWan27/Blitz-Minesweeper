export enum ServerEvents
{
  Exception = 'exception',
  ClientJoinLobby = 'server.client.join.lobby',
  GameMessage = 'server.game.message',
  GameboardUpdate = 'server.gameboard.update',
  GameboardState = 'server.gameboard.state',
}

export const enum ClientEvents
{
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  Move = 'client.game.move',
  GetState = 'client.game.state',
}