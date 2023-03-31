import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ClientEvents } from '@shared/ClientEvents';
import { ServerEvents } from '@shared/ServerEvents';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: Socket): void {
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
