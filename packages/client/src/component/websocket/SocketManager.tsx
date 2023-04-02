import { io, Socket } from 'socket.io-client';
// import { ClientEvents } from '@shared/ClientEvents';
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
    this.socket.on('server.pong', () => {
        console.log("hello");
    })
  }

  public ping(): void
  {
    // let s = ClientEvents.Ping;
    console.log(this.socket);
    this.socket.emit('client.ping', {message: "ping"});
    console.log("pinging");
  }
}

const socketManager = new SocketManager();
export default socketManager;