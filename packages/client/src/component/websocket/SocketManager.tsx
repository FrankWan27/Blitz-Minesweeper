import { io, Socket } from 'socket.io-client';
// import { ClientEvents, ServerEvents } from '../../shared/index';
import { ClientEvents, ServerEvents } from '../../shared/Events';
import { Payloads } from '../../shared/Payloads';
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
        this.onJoinLobby();
        this.onGameboardUpdate();
    }

    private onConnect(): void
    {
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

  private onDisconnect(): void
  {
    this.socket.on('disconnect', () => {
    });
  }

  private onGameboardUpdate(): void {
    this.socket.on(ServerEvents.GameboardUpdate, (data) => {

    }
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
    this.socket.on(ServerEvents.ClientJoinLobby, (data : Payloads.LobbyId) => {
        showNotification({
            message: 'Joined lobby ' + data.lobbyId,
            color: 'green',
            autoClose: 2000,
          });
        this.updateURL(data.lobbyId);
    })
  }

  private updateURL(str: string) {
    window.history.replaceState("", "", "/" + str);
  }
}

const socketManager = Object.freeze(new SocketManager());
export default socketManager;