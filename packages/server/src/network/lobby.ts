import { nanoid } from "nanoid"
import { Server } from "socket.io"
import { Client, ClientId } from "./client";
import { Minesweeper } from "game/minesweeper";
import { ServerEvents } from "@shared/Events";
import { Payloads } from "@shared/Payloads";

export class Lobby {
    public readonly id: LobbyId = nanoid(5);

    public readonly createdAt: Date = new Date();

    public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

    private readonly game: Minesweeper = new Minesweeper(10, 10, 13);

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

    public clientMove(move : Payloads.ClientMove) {
        if (this.game.validateMove(move)) {
            this.game.executeMove(move);
            this.emitGameState();
        }
    }

    public emitGameState(clientId?: ClientId) {
        if(clientId) {
            this.clients.get(clientId).emit(ServerEvents.GameboardUpdate, this.game.getGameboardState(clientId));
        } else {
            this.clients.forEach(client => {
                client.emit(ServerEvents.GameboardUpdate, this.game.getGameboardState(client.id));
            });
        }
    }
}

export type LobbyId = string;