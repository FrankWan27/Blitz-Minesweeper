import { nanoid } from "nanoid"
import { Socket } from "socket.io"
import { Client, ClientId } from "./client";

export class Lobby {
    public readonly id: string = nanoid(5);

    public readonly createdAt: Date = new Date();

    public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

}