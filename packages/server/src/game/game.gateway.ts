import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ClientEvents } from '@shared/ClientEvents';
import { ServerEvents } from '@shared/ServerEvents';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {
  afterInit(server: any): any {
     console.log("i am initied");
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(socket: Socket): void {
    console.log("recieved a ping");
    socket.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
