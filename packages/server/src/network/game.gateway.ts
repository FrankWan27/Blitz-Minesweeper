import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ClientEvents, ServerEvents } from '@shared/Events';
import { Payloads } from '@shared/Payloads';
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

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(client: Client): void {
    console.log(client + " creating lobby")
    this.lobbyManager.createLobby(client);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: Client, data: Payloads.LobbyId): void {
    console.log(client.id + " joining lobby ", data)
    this.lobbyManager.joinLobby(client, data.lobbyId);
  }

  @SubscribeMessage(ClientEvents.Move)
  onClientMove(client: Client, data: Payloads.ClientMove): void {
    if (!client.lobby) {
      // throw new ServerException(SocketExceptions.LobbyError, 'You are not in a lobby');
    }
    client.lobby.clientMove(data);
  }

  @SubscribeMessage(ClientEvents.GetState)
  onClientGetState(client: Client): void {
    if (!client.lobby) {
      // throw new ServerException(SocketExceptions.LobbyError, 'You are not in a lobby');
    }
    client.lobby.emitGameState(client.id);
  }
}
