import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ClientEvents } from '@shared/ClientEvents';
import { ServerEvents } from '@shared/ServerEvents';
import { Socket } from 'socket.io';
import { LobbyManager } from './lobby.manager';
import { Client } from './client';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {

  constructor(private readonly lobbyManager: LobbyManager) {}

  afterInit(server: any): any {
    this.lobbyManager.server = server;
     console.log("Game server initialized");
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.lobbyManager.initializeSocket(socket as Client);
  }

  async handleDisconnect(socket: Socket) {
    this.lobbyManager.terminateSocket(socket as Client);
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: Client): void {
    console.log("recieved a ping");
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(client: Client): void {
    console.log(client + " creating lobby")
    this.lobbyManager.createLobby(client);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: Client, data: any): void {
    console.log(client.id + " joining lobby ", data)
    this.lobbyManager.joinLobby(client, data.lobbyId);
  }
}
