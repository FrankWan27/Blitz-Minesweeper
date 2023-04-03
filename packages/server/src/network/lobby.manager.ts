import { Server } from "socket.io";
import { Lobby, LobbyId } from "./lobby";
import { Client } from "./client";
import { ServerEvents } from "@shared/Events";

export class LobbyManager {
    public server: Server;
    private readonly lobbies: Map<LobbyId, Lobby> = new Map<LobbyId, Lobby>();

    public createLobby(client?: Client): Lobby {
        const lobby = new Lobby(this.server);
        this.lobbies.set(lobby.id, lobby);
        if (client) {
            this.joinLobby(client, lobby.id);
        }
        console.log("Created lobby" + lobby.id)
        return lobby;
    }

    public joinLobby(client: Client, lobbyId: LobbyId): void {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            console.log("Lobby not found");
            return;
        }

        console.log("adding client to lobby" + lobbyId)
        lobby.addClient(client);
        this.server.emit(ServerEvents.ClientJoinLobby, {lobbyId});
    }

    public initializeSocket(client: Client) {
        client.lobby = null;
    }

    public terminateSocket(client: Client) {
        client.lobby?.removeClient(client);
    }
}