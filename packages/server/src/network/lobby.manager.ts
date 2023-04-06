import { Server } from "socket.io";
import { Lobby, LobbyId } from "./lobby";
import { Client } from "./client";
import { ServerEvents } from "@shared/Events";
import { ServerException } from "./server.exception";
import { getRandomName } from "@shared/Utils";
import { Cron } from "@nestjs/schedule";

const LOBBY_MAX_LIFETIME = 60 * 60 * 1000; // one hour
export class LobbyManager {
  public server: Server;
  private readonly lobbies: Map<LobbyId, Lobby> = new Map<LobbyId, Lobby>();

  public createLobby(client: Client): Lobby {
    if (client.lobby != null) {
      throw new ServerException("Can't create a new lobby, you are already in a lobby!")
    }
    const lobby = new Lobby(this.server);
    this.lobbies.set(lobby.id, lobby);
    this.joinLobby(client, lobby.id);
    return lobby;
  }

  public quickJoin(client: Client) {
    this.lobbies.forEach((lobby) => {
      if (lobby.clients.size < lobby.maxClients && lobby.gameStarted == false) {
        this.joinLobby(client, lobby.id);
        return;
      }
    })
    throw new ServerException("There are currently no open lobbies! Please try again later", "orange");
  }

  public joinLobby(client: Client, lobbyId: LobbyId): void {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new ServerException("Lobby not found!");
    }

    lobby.addClient(client);
    client.emit(ServerEvents.ClientJoinLobby, { lobbyId });
  }

  public initializeSocket(client: Client) {
    client.lobby = null;
    client.name = getRandomName();
  }

  public terminateSocket(client: Client) {
    client.lobby?.removeClient(client);
  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private cleanLobbies(): void
  {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = Date.now();
      const lobbyLifetime = now - lobby.createdAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.broadcast('Game timed out', 'blue');
        this.lobbies.delete(lobby.id);
      }
      if (lobby.clients.size == 0) {
        this.lobbies.delete(lobby.id);
      }
    }
  }
}