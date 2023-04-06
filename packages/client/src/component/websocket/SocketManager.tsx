import { io, Socket } from 'socket.io-client';
// import { ClientEvents, ServerEvents } from '../../shared/index';
import { ClientEvents, ServerEvents } from '../../shared/Events';
import { Payloads } from '../../shared/Payloads';
// @ts-ignore
import { showNotification } from '@mantine/notifications';

export class SocketManager {
  public socket: Socket;
  private connected: boolean = true;

  constructor() {
    this.socket = io();
    this.onConnect();
    this.onDisconnect();
    this.onException();
  }

  private onConnect(): void {
    this.socket.on('connect', () => {
      console.log("connected");
      if (!this.connected) {
        showNotification({
          message: 'Reconnected to server!',
          color: 'green',
          autoClose: 2000,
        });
        this.connected = true;
      }
    });
  }

  private onDisconnect(): void {
    this.socket.on('disconnect', () => {
    });
  }

  public onGameboardUpdate(func: (data: Payloads.GameboardTileUpdate) => void): void {
    this.socket.on(ServerEvents.GameboardUpdate, (data: Payloads.GameboardTileUpdate) => {
      func(data);
    });
  }

  public onGameboardState(func: (data: Payloads.GameboardState) => void): void {
    this.socket.on(ServerEvents.GameboardState, (data: Payloads.GameboardState) => {
      func(data);
    });
  }

  public onLobbyState(func: (data: Payloads.LobbyState) => void): void {
    this.socket.on(ServerEvents.LobbyState, (data: Payloads.LobbyState) => {
      func(data);
    })
  }

  public onGameStart(func: () => void): void {
    this.socket.on(ServerEvents.GameStart, () => {
      func();
    });
  }

  public onJoinLobby(func: (data: Payloads.LobbyId) => void) {
    this.socket.on(ServerEvents.ClientJoinLobby, (data: Payloads.LobbyId) => {
      showNotification({
        message: 'Joined lobby ' + data.lobbyId,
        color: 'green',
        autoClose: 2000,
      });
      func(data);
    })
  }

  public onException(): void {
    this.socket.on(ServerEvents.Exception, (data: Payloads.ServerException) => {
      showNotification({
        message: data.message,
        color: 'red',
      })
    })
  }

  public joinLobby(lobbyId: string) {
    this.socket.emit(ClientEvents.LobbyJoin, { lobbyId })
  }

  public quickJoin(): void {
    this.socket.emit(ClientEvents.LobbyQuickJoin);
  }

  public createLobby() {
    this.socket.emit(ClientEvents.LobbyCreate)
  }

  public getGameState() {
    this.socket.emit(ClientEvents.GetState)
  }

  public move(x: number, y: number) {
    this.socket.emit(ClientEvents.Move, { type: 'reveal', x, y })
  }

  public getId() : string {
    return this.socket.id;
  }

  public setName(name: string) {
    this.socket.emit(ClientEvents.SetName, { name })
  }
}


const socketManager = Object.freeze(new SocketManager());
export default socketManager;