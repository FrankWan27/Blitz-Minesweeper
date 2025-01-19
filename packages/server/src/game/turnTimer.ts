import { ClientId } from '@shared/Payloads';
import { getRandomInt } from '@shared/Utils';
import { Lobby } from 'network/lobby';

interface PlayerStatus {
  //in milliseconds
  timeRemaining: number;
  lastMove: number | null;
  alive: boolean;
}

const TIMER_INTERVAL = 100;

export class TurnTimer {
  public readonly playerStatus: Map<ClientId, PlayerStatus> = new Map<
    ClientId,
    PlayerStatus
  >();

  public currentPlayer = null;
  private timeStopped = false;
  private emitTimer;

  private clientIdArray = [];

  constructor(
    private readonly lobby: Lobby,
    private readonly baseTime: number,
    private readonly penalty: number,
  ) {}

  startGame() {
    this.lobby.clients.forEach((client) => {
      this.playerStatus.set(client.id, {
        alive: true,
        lastMove: null,
        timeRemaining: this.baseTime,
      });
    });
    this.clientIdArray = Array.from(this.lobby.clients.keys());
    this.currentPlayer =
      this.clientIdArray[getRandomInt(this.clientIdArray.length)];
  }

  isCurrentPlayer(clientId: string) {
    if (this.currentPlayer == clientId) {
      return true;
    }
    return false;
  }

  nextPlayer() {
    if (this.timeStopped) {
      return;
    }
    if (!this.emitTimer) {
      this.emitTimer = setInterval(() => {
        this.updatePlayerStatus(Date.now());
        this.lobby.emitLobbyState();
      }, TIMER_INTERVAL);
    }
    const date = Date.now();
    this.updatePlayerStatus(date);
    this.currentPlayer =
      this.clientIdArray[
        (this.clientIdArray.indexOf(this.currentPlayer) + 1) %
          this.clientIdArray.length
      ];
    const nextPlayer = this.playerStatus.get(this.currentPlayer);
    nextPlayer.lastMove = date;
  }

  bomb(clientId: ClientId) {
    const player = this.playerStatus.get(clientId);
    player.timeRemaining -= this.penalty;
    if (player.timeRemaining <= 0) {
      player.alive = false;
      this.checkGameOver();
    }
  }

  updatePlayerStatus(date: number) {
    console.log('updating player status');
    const curStatus = this.playerStatus.get(this.currentPlayer);
    if (curStatus.lastMove) {
      curStatus.timeRemaining =
        curStatus.timeRemaining - (date - curStatus.lastMove);
      curStatus.lastMove = date;
    }
    if (curStatus.timeRemaining <= 0) {
      curStatus.alive = false;
      this.checkGameOver();
    }
  }

  checkGameOver() {
    console.log('Checking for gaemover');
    let winner;
    let deadCount = 0;
    this.playerStatus.forEach((client, clientId) => {
      if (client.alive) {
        winner = clientId;
      } else {
        deadCount++;
      }
    });
    if (deadCount >= this.clientIdArray.length - 1) {
      this.lobby.gameOver(winner);
      this.stop();
    }
  }

  stop() {
    clearInterval(this.emitTimer);
    this.timeStopped = true;
  }

  getMostTime() {
    let id;
    let time;
    this.playerStatus.forEach((client, clientId) => {
      if (!time || client.timeRemaining > time) {
        id = clientId;
        time = client.timeRemaining;
      }
    });
    return id;
  }
}
