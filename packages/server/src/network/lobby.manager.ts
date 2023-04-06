import { Server } from "socket.io";
import { Lobby, LobbyId } from "./lobby";
import { Client } from "./client";
import { ServerEvents } from "@shared/Events";
import { ServerException } from "./server.exception";
import { getRandomName } from "@shared/Utils";

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
      if (lobby.clients.size < lobby.maxClients) {
        this.joinLobby(client, lobby.id);
        return;
      }
    })
    throw new ServerException("There are currently no open lobbies! Please try again later")
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
}