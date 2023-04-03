import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ClientEvents, ServerEvents } from '@shared';
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

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(socket: Socket): void {
    
  }


  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
