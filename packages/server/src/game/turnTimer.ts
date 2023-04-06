import { ClientId } from "@shared/Payloads";
import { Lobby } from "network/lobby";

interface PlayerStatus {
  //in milliseconds
  timeRemaining: number,
  lastMove: number | null, 
  timeout: NodeJS.Timeout | null,
  alive: boolean
}

const BASE_TIME = 30 * 1000;
const TIMER_INTERVAL = 100;
const BOMB_PENALTY = 15 * 1000;

export class TurnTimer {
  public readonly playerStatus: Map<ClientId, PlayerStatus> = new Map<ClientId, PlayerStatus>();

  public currentPlayer = null;
  private emitTimer;

  private clientIdArray = [];
  
  constructor(private readonly lobby: Lobby) { }
  
  startGame() {
    this.lobby.clients.forEach(client => {
      this.playerStatus.set(client.id, {alive: true, timeout: null, lastMove: null, timeRemaining: BASE_TIME})
    })
    this.clientIdArray = Array.from(this.lobby.clients.keys());
    this.currentPlayer = this.clientIdArray[Math.floor(Math.random() * this.clientIdArray.length)];
  }

  isCurrentPlayer(clientId: string) {
    if (this.currentPlayer == clientId) {
      return true;
    }
    return false;
  }

  nextPlayer() {
    if (!this.emitTimer) {
      this.emitTimer = setInterval(() => {
        this.updatePlayerStatus(Date.now());
        this.lobby.emitLobbyState();
      }, TIMER_INTERVAL)
    }
    const date = Date.now();
    this.updatePlayerStatus(date);
    this.currentPlayer = this.clientIdArray[(this.clientIdArray.indexOf(this.currentPlayer) + 1) % this.clientIdArray.length];
    const nextPlayer = this.playerStatus.get(this.currentPlayer);
    nextPlayer.lastMove = date;
    nextPlayer.timeout = setTimeout(() => {nextPlayer.alive = false; this.checkGameOver()}, nextPlayer.timeRemaining);
  }

  bomb(clientId: ClientId) {
    this.playerStatus.get(clientId).timeRemaining -= BOMB_PENALTY;
  }
  updatePlayerStatus(date: number) {
    const curStatus = this.playerStatus.get(this.currentPlayer);
    if (curStatus.timeout) {
      clearTimeout(curStatus.timeout);
    }
    if (curStatus.lastMove) {
      curStatus.timeRemaining = curStatus.timeRemaining - (date - curStatus.lastMove);
      curStatus.lastMove = date;
    }
  }

  checkGameOver() {
    let winner;
    let deadCount = 0;
    this.playerStatus.forEach((client, clientId) => {
      if (client.alive) {
        winner = clientId;
      } else {
        deadCount++;
      }
    })
    if (deadCount >= this.clientIdArray.length - 1) {
      this.lobby.gameOver(winner);
    }
  }

}