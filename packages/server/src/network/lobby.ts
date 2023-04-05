import { nanoid } from "nanoid"
import { Server } from "socket.io"
import { Client, ClientId } from "./client";
import { Minesweeper } from "game/minesweeper";
import { ServerEvents } from "@shared/Events";
import { Payloads, PlayerStatus } from "@shared/Payloads";
import { ServerException } from "./server.exception";
import { TurnTimer } from "game/turnTimer";

export class Lobby {
  public readonly id: LobbyId = nanoid(5);

  public readonly createdAt: Date = new Date();

  public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

  public gameStarted: boolean = false;
  public gameEnded: boolean = false;
  public gamePaused: boolean = false;

  private readonly game: Minesweeper = new Minesweeper(this, 16, 16, 40);

  private readonly maxClients = 2;

  private readonly turnTimer = new TurnTimer(this);

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
      this.gameStarted = true;
      this.game.startGame();
      this.turnTimer.startGame();
    }
  }

  public removeClient(client: Client) {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.lobby = null;
  }

  public clientMove(clientId: ClientId, move: Payloads.ClientMove) {
    if (!this.turnTimer.isCurrentPlayer(clientId)) {
      return;
    }
    if (!this.game.validateMove(move)) {
      return;
    }
    this.game.executeMove(move);
    this.turnTimer.nextPlayer();
    this.emitGameState();
  }

  public emitGameState(clientId?: ClientId) {
    this.emitLobbyState(clientId);
    if (clientId) {
      this.clients.get(clientId).emit(ServerEvents.GameboardState, this.game.getGameboardState(clientId));
    } else {
      this.clients.forEach(client => {
        client.emit(ServerEvents.GameboardState, this.game.getGameboardState(client.id));
      });
    }
  }

  public emitLobbyState(clientId?: ClientId) {
    if (clientId) {
      this.clients.get(clientId).emit(ServerEvents.LobbyState, this.getLobbyState());
    } else {
      this.clients.forEach(client => {
        client.emit(ServerEvents.LobbyState, this.getLobbyState());
      });
    }
  }

  private getLobbyState() : Payloads.LobbyState{
    const playerStatus = new Map<ClientId, PlayerStatus>();
    this.turnTimer.playerStatus.forEach((player, clientId) => {
      playerStatus.set(clientId, {alive: player.alive, timeRemaining: player.timeRemaining})
    })
    return {
      lobbyId: this.id,
      gameStarted: this.gameStarted,
      gamePaused: this.gamePaused,
      gameEnded: this.gameEnded,
      playerCount: this.clients.size,
      currentPlayer: this.turnTimer.currentPlayer,
      playerStatus: playerStatus,
    }
  }

  public emitGameStart() {
    this.clients.forEach(client => {
      client.emit(ServerEvents.GameStart);
    });
  }

  public gameOver(clientId: ClientId) {
    console.log("GAMEOVER WINNER IS ", clientId)
    this.gameEnded = true;
  }
}

export type LobbyId = string;