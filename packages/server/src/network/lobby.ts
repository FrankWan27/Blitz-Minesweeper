import { nanoid } from "nanoid"
import { Server } from "socket.io"
import { Client, ClientId } from "./client";
import { Minesweeper } from "game/minesweeper";
import { ServerEvents } from "@shared/Events";
import { Payloads } from "@shared/Payloads";
import { ServerException } from "./server.exception";

export class Lobby {
  public readonly id: LobbyId = nanoid(5);

  public readonly createdAt: Date = new Date();

  public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

  private readonly game: Minesweeper = new Minesweeper(this, 10, 10, 13);

  private readonly maxClients = 2;

  constructor(private readonly server: Server) {
  }

  public addClient(client: Client) {
    if (client.lobby != null) {
      throw new ServerException("You are already in a lobby!")
    }
    this.clients.set(client.id, client);
    client.join(this.id);
    client.lobby = this;
    if (this.clients.size >= this.maxClients) {
      this.game.startGame();
    }
  }

  public removeClient(client: Client) {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.lobby = null;
  }

  public clientMove(move: Payloads.ClientMove) {

    if (this.game.validateMove(move)) {
      console.log("moving validated")

      this.game.executeMove(move);
      this.emitGameState();
    }
  }

  public emitGameState(clientId?: ClientId) {
    console.log("emitting state to " + clientId)
    if (clientId) {
      this.clients.get(clientId).emit(ServerEvents.GameboardState, this.game.getGameboardState(clientId));
    } else {
      this.clients.forEach(client => {
        client.emit(ServerEvents.GameboardState, this.game.getGameboardState(client.id));
      });
    }
  }

  public emitGameStart() {
    this.clients.forEach(client => {
      client.emit(ServerEvents.GameStart);
    });
  }
}

export type LobbyId = string;