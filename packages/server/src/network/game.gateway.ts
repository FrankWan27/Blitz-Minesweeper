import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClientEvents, ServerEvents } from '@shared/Events';
import { Payloads } from '@shared/Payloads';
import { Socket } from 'socket.io';
import { LobbyManager } from './lobby.manager';
import { Client } from './client';
import { ServerException } from './server.exception';
import { getRandomName } from '@shared/Utils';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {
  constructor(private readonly lobbyManager: LobbyManager) {}

  @WebSocketServer() 
  private server: any;

  afterInit(server: any): any {
    this.lobbyManager.server = server;
    console.log('Game server initialized');
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.lobbyManager.initializeSocket(socket as Client);
  }

  async handleDisconnect(socket: Socket) {
    this.lobbyManager.terminateSocket(socket as Client);
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(client: Client): void {
    this.lobbyManager.createLobby(client);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: Client, data: Payloads.LobbyId): void {
    this.lobbyManager.joinLobby(client, data.lobbyId);
  }

  @SubscribeMessage(ClientEvents.LobbyQuickJoin)
  onClientQuickJoin(client: Client): void {
    this.lobbyManager.quickJoin(client);
  }

  @SubscribeMessage(ClientEvents.Move)
  onClientMove(client: Client, data: Payloads.ClientMove): void {
    if (!client.lobby) {
      throw new ServerException('You are not in a lobby');
    }
    client.lobby.clientMove(client.id, data);
  }

  @SubscribeMessage(ClientEvents.SetName)
  onClientSetName(client: Client, data: Payloads.Name): void {
    if (data.name == '') {
      client.name = getRandomName();
    } else {
      client.name = data.name;
    }
    client.lobby?.emitPlayerNames();
  }

  @SubscribeMessage(ClientEvents.GetGameState)
  onClientGetGameState(client: Client): void {
    if (!client.lobby) {
      throw new ServerException('You are not in a lobby');
    }
    client.lobby.emitGameState();
  }

  @SubscribeMessage(ClientEvents.LobbySettings)
  onClientSetLobbySettings(client: Client, data: Payloads.LobbySettings): void {
    console.log(data);
    if (client.lobby.id != data.lobbyId) {
      throw new ServerException(
        'You are not in the lobby you are trying to change settings for!',
      );
    }
    if (client.id != client.lobby.host) {
      throw new ServerException(
        'You are not the host of the lobby you are trying to change settings for!'
      )
    }
    client.lobby.setLobbySettings(data);
  }
}
