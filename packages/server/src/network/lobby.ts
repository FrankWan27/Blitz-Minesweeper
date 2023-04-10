import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import { Client } from './client';
import { Minesweeper } from 'game/minesweeper';
import { ServerEvents } from '@shared/Events';
import { ClientId, Payloads, PlayerStatus } from '@shared/Payloads';
import { ServerException } from './server.exception';
import { TurnTimer } from 'game/turnTimer';
import { getRandomInt } from '@shared/Utils';

const SECONDS_TO_MS = 1000;

export class Lobby {
  public readonly id: LobbyId = nanoid(5);

  public readonly createdAt: number = Date.now();

  public readonly clients: Map<ClientId, Client> = new Map<ClientId, Client>();

  public gameStarted: boolean = false;
  public gameEnded: boolean = false;
  public gamePaused: boolean = false;

  private game: Minesweeper;
  private turnTimer: TurnTimer;

  public host : ClientId;
  public maxClients = 2;
  private time = 30;
  private penalty = 15;
  private width = 16;
  private height = 16;
  private bombs = 40;


  constructor(private readonly server: Server, client: Client) {
    this.host = client.id;
    this.addClient(client);
  }

  startGame() {
    if (this.bombs > this.width * this.height - 9) {
      throw new ServerException("Unable to start game! Too many bombs for board size!");
    }
    console.log("starting game");
    this.game = new Minesweeper(this, this.width, this.height, this.bombs);
    this.turnTimer = new TurnTimer(this, this.time * SECONDS_TO_MS, this.penalty * SECONDS_TO_MS);
    this.gameStarted = true;
    this.game.startGame();
    this.turnTimer.startGame();
  }

  restartGame() {
    this.gameEnded = false;
    this.startGame();
  }

  public addClient(client: Client) {
    if (client.lobby != null) {
      throw new ServerException('You are already in a lobby!');
    }
    if (this.gameStarted) {
      throw new ServerException("This lobby already has a game in progress!")
    }
    if (this.clients.size >= this.maxClients) {
      throw new ServerException("This lobby has reached the maximum player count!")
    }
    this.clients.set(client.id, client);
    client.join(this.id);
    client.lobby = this;
    client.emit(ServerEvents.ClientJoinLobby, { lobbyId: this.id });
    this.emitLobbyState();
    this.emitPlayerNames();
    this.emitLobbySettings();
    
  }

  public removeClient(client: Client) {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.lobby = null;
    if (client.id === this.host) {
      this.host = Array.from(this.clients.keys())[getRandomInt(this.clients.size)];
      this.emitLobbySettings();
    }
    this.emitLobbyState();
    this.broadcast(client.name + ' has left the game!', 'orange');
  }

  public setLobbySettings(settings: Payloads.LobbySettings) {
    console.log("before", this.host);
    this.host = settings.host || this.host;
    console.log("after", this.host);
    this.maxClients = settings.maxPlayers || this.maxClients;
    this.time = settings.time || this.time;
    this.penalty = settings.penalty || this.penalty;
    this.width = settings.width || this.width;
    this.height = settings.height || this.height;
    this.bombs = settings.bombs || this.bombs;
    this.emitLobbySettings();
  }

  public clientMove(clientId: ClientId, move: Payloads.ClientMove) {
    if (!this.gameStarted || this.gamePaused || this.gameEnded) {
      return;
    }
    if (move.type != 'flag' && !this.turnTimer.isCurrentPlayer(clientId)) {
      return;
    }
    if (!this.game.validateMove(move)) {
      return;
    }
    this.game.executeMove(clientId, move);
    if (move.type != 'flag') {
      this.turnTimer.nextPlayer();
    }
    this.emitGameState();
  }

  public emitGameState(clientId?: ClientId) {
    this.emitLobbyState();
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

  public emitPlayerNames(): void {
    this.server.to(this.id).emit(ServerEvents.ClientNamesMap, this.getPlayerNames());
  
  }

  public getPlayerNames(): Payloads.ClientNamesMap {
    const clientNames = {};
    this.clients.forEach((client, clientId) => {
      clientNames[clientId] = client.name;
    });
    return clientNames;
  }

  public emitLobbyState() {
    this.server.to(this.id).emit(ServerEvents.LobbyState, this.getLobbyState());
  }

  private getLobbyState(): Payloads.LobbyState {
    const playerStatus = {};
    if (this.gameStarted) {
      this.turnTimer.playerStatus.forEach((player, clientId) => {
        playerStatus[clientId] = {
          alive: player.alive,
          timeRemaining: player.timeRemaining,
        };
      });
    }
    
    return {
      lobbyId: this.id,
      gameStarted: this.gameStarted,
      gamePaused: this.gamePaused,
      gameEnded: this.gameEnded,
      players: Array.from(this.clients.keys()),
      currentPlayer: this.turnTimer?.currentPlayer || this.host,
      playerStatus: playerStatus,
    };
  }

  emitLobbySettings() {
    this.server.to(this.id).emit(ServerEvents.LobbySettings, this.getLobbySettings());
  }

  private getLobbySettings(): Payloads.LobbySettings {
    return {
      lobbyId: this.id,
      host: this.host,
      maxPlayers: this.maxClients,
      time: this.time,
      penalty: this.penalty,
      width: this.width,
      height: this.height,
      bombs: this.bombs,
    }
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
    console.log(clientId);
    console.log(this.clients.get(clientId));
    this.broadcast('GAMEOVER WINNER IS ' + this.clients.get(clientId).name);
    this.server.to(this.id).emit(ServerEvents.GameOver, {winnerId: clientId});
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
