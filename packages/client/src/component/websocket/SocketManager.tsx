import { io, Socket } from 'socket.io-client';
// import { ClientEvents, ServerEvents } from '../../shared/index';
import { ClientEvents } from '../../shared/ClientEvents';
import { ServerEvents } from '../../shared/ServerEvents';
import GameManager from '../GameManager'
// @ts-ignore
import { showNotification } from '@mantine/notifications';
import React, { useState } from "react";

class SocketManager
{
    public socket: Socket;
    private connected: boolean = true;

    constructor()
    {
        this.socket = io();
        this.onConnect();
        this.onDisconnect();
        this.onPong();
    }

    private onConnect(): void
    {
        this.socket.on('connect', () => {
            console.log("connected");
        if (!this.connected) {
        }
        });
    }

  private onDisconnect(): void
  {
  }

  private onPong(): void {
    this.socket.on(ServerEvents.Pong, () => {
        console.log("hello");
    })
  }

  public ping(): void
  {
    console.log(this.socket);
    this.socket.emit(ClientEvents.Ping, {message: "ping"});
    console.log("pinging");
  }

  public joinLobby(lobbyId: string) {
    this.socket.emit(ClientEvents.LobbyJoin, {lobbyId})
  }

  public createLobby() {
    this.socket.emit(ClientEvents.LobbyCreate)
  }

  public onJoinLobby() {
    this.socket.on(ServerEvents.ClientJoinLobby, (data : any) => {
        console.log("joined lobby");
        this.updateURL(data.lobbyId)
    })
  }

  private updateURL(lobbyId: string) {
    window.history.replaceState("", "", "/" + lobbyId);
  }
}

const socketManager = Object.freeze(new SocketManager());
export default socketManager;