import { io, Socket } from 'socket.io-client';
// import { ClientEvents, ServerEvents } from '../../shared/index';
import { ClientEvents, ServerEvents } from '../../shared/Events';
import { Payloads } from '../../shared/Payloads';
import GameManager from '../GameManager'
// @ts-ignore
import { showNotification } from '@mantine/notifications';
import React, { useState } from "react";

export class SocketManager
{
    public socket: Socket;
    private connected: boolean = true;

    constructor()
    {
        this.socket = io();
        this.onConnect();
        this.onDisconnect();
        this.onException();
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

  public onGameboardUpdate(func : (data : Payloads.GameboardTileUpdate) => void): void {
    this.socket.on(ServerEvents.GameboardUpdate, (data: Payloads.GameboardTileUpdate) => {
      func(data);
    });
  }

  public onGameboardState(func : (data : Payloads.GameboardState) => void): void {
    this.socket.on(ServerEvents.GameboardState, (data: Payloads.GameboardState) => {
      func(data);
    });
  }

  public onGameStart(func : () => void): void {
    this.socket.on(ServerEvents.GameStart, () => {
      console.log("gamestart")
      func();
    });
  }

  public onJoinLobby(func : (data : Payloads.LobbyId) => void) {
    this.socket.on(ServerEvents.ClientJoinLobby, (data : Payloads.LobbyId) => {
        showNotification({
            message: 'Joined lobby ' + data.lobbyId,
            color: 'green',
            autoClose: 2000,
          });
        func(data);
    })
  }

  public onException() : void {
    this.socket.on(ServerEvents.Exception, (data : Payloads.ServerException) => {
        showNotification({
            message: data.message,
            color: 'red',
        })
    })
  }
  
  public joinLobby(lobbyId: string) {
    this.socket.emit(ClientEvents.LobbyJoin, {lobbyId})
  }

  public createLobby() {
    this.socket.emit(ClientEvents.LobbyCreate)
  }

  public getGameState() {
    this.socket.emit(ClientEvents.GetState)
  }
}


const socketManager = Object.freeze(new SocketManager());
export default socketManager;