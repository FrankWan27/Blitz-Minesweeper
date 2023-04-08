import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import { Client } from './client';
import { Minesweeper } from 'game/minesweeper';
import { ServerEvents } from '@shared/Events';
import { ClientId, Payloads, PlayerStatus } from '@shared/Payloads';
import { ServerException } from './server.exception';
import { TurnTimer } from 'game/turnTimer';

export class Lobby {
  public readonly id: LobbyId = nanoid(5);

  public readonly createdAt: number = Date.now();

  public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

  public gameStarted: boolean = false;
  public gameEnded: boolean = false;
  public gamePaused: boolean = false;

  private readonly game: Minesweeper = new Minesweeper(this, 16, 16, 40);

  public maxClients = 2;

  private readonly turnTimer = new TurnTimer(this);

  constructor(private readonly server: Server) {}

  public addClient(client: Client) {
    if (client.lobby != null) {
      throw new ServerException('You are already in a lobby!');
    }
    // if (this.gameStarted) {
    //   throw new ServerException("This lobby already has a game in progress!")
    // }
    this.clients.set(client.id, client);
    client.join(this.id);
    client.lobby = this;
    this.emitLobbyState();
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
    this.emitLobbyState();
    this.broadcast(client.name + ' has left the game!', 'orange');
  }

  public setMaxClients(maxSize: number) {
    this.maxClients = maxSize;
    this.emitLobbyState();
  }

  public clientMove(clientId: ClientId, move: Payloads.ClientMove) {
    if (!this.gameStarted || this.gamePaused || this.gameEnded) {
      return;
    }
    if (!this.turnTimer.isCurrentPlayer(clientId)) {
      return;
    }
    if (!this.game.validateMove(move)) {
      return;
    }
    this.game.executeMove(clientId, move);
    this.turnTimer.nextPlayer();
    this.emitGameState();
  }

  public emitGameState(clientId?: ClientId) {
    this.emitLobbyState(clientId);
    if (clientId) {
      this.clients
        .get(clientId)
        .emit(
          ServerEvents.GameboardState,
          this.game.getGameboardState(clientId),
        );
    } else {
      this.clients.forEach((client) => {
        client.emit(
          ServerEvents.GameboardState,
          this.game.getGameboardState(client.id),
        );
      });
    }
  }

  public emitLobbyState(clientId?: ClientId) {
    if (clientId) {
      this.clients
        .get(clientId)
        .emit(ServerEvents.LobbyState, this.getLobbyState());
    } else {
      this.clients.forEach((client) => {
        client.emit(ServerEvents.LobbyState, this.getLobbyState());
      });
    }
  }

  private getLobbyState(): Payloads.LobbyState {
    const playerStatus = {};
    this.turnTimer.playerStatus.forEach((player, clientId) => {
      playerStatus[clientId] = {
        alive: player.alive,
        timeRemaining: player.timeRemaining,
      };
    });
    const clientNames = {};
    this.clients.forEach((client, clientId) => {
      clientNames[clientId] = client.name;
    });
    return {
      lobbyId: this.id,
      gameStarted: this.gameStarted,
      gamePaused: this.gamePaused,
      gameEnded: this.gameEnded,
      playerCount: this.clients.size,
      maxPlayers: this.maxClients,
      clientNames: clientNames,
      currentPlayer: this.turnTimer.currentPlayer,
      playerStatus: playerStatus,
    };
  }

  public emitGameStart() {
    this.clients.forEach((client) => {
      console.log(client.name, client.id);
      client.emit(ServerEvents.GameStart);
    });
  }

  public gameOver(clientId: ClientId) {
    this.gameEnded = true;
    this.game.revealBoard();
    this.emitGameState();
    this.broadcast('GAMEOVER WINNER IS ' + clientId);
    this.clients.forEach((client) => {
      client.emit(ServerEvents.GameOver, {winnerId: clientId, winnerName: client.name, isWinner: clientId === client.id});
    });
  }

  public bomb(clientId: ClientId) {
    this.turnTimer.bomb(clientId);
  }

  public broadcast(message: string, color?: string) {
    const data: Payloads.ServerMessage = {
      message,
      color,
    };

    this.clients.forEach((client) => {
      client.emit(ServerEvents.ServerMessage, data);
    });
  }
}

export type LobbyId = string;
