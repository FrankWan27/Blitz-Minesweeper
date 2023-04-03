import { nanoid } from "nanoid"
import { Server } from "socket.io"
import { Client, ClientId } from "./client";

export class Lobby {
    public readonly id: LobbyId = nanoid(5);

    public readonly createdAt: Date = new Date();

    public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

    constructor(private readonly server: Server) {
    }

    public addClient(client: Client) {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.lobby = this;
    }

    public removeClient(client: Client) {
        this.clients.delete(client.id);
        client.leave(this.id);
        client.lobby = null;
    }
}

export type LobbyId = string;