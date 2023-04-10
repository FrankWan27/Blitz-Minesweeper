import { ClientId } from '@shared/Payloads';
import { getRandomInt } from '@shared/Utils';
import { Lobby } from 'network/lobby';

interface PlayerStatus {
  //in milliseconds
  timeRemaining: number;
  lastMove: number | null;
  timeout: NodeJS.Timeout | null;
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

  constructor(private readonly lobby: Lobby, private readonly baseTime: number, private readonly penalty: number) {}

  startGame() {
    this.lobby.clients.forEach((client) => {
      this.playerStatus.set(client.id, {
        alive: true,
        timeout: null,
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
    nextPlayer.timeout = setTimeout(() => {
      nextPlayer.alive = false;
      this.checkGameOver();
    }, nextPlayer.timeRemaining);
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
    const curStatus = this.playerStatus.get(this.currentPlayer);
    if (curStatus.timeout) {
      clearTimeout(curStatus.timeout);
    }
    if (curStatus.lastMove) {
      curStatus.timeRemaining =
        curStatus.timeRemaining - (date - curStatus.lastMove);
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
    });
    if (deadCount >= this.clientIdArray.length - 1) {
      this.lobby.gameOver(winner);
      this.stop();
    }
  }

  stop() {
    this.playerStatus.forEach((client) => {
      clearTimeout(client.timeout);
    });
    clearInterval(this.emitTimer);
    this.timeStopped = true;
  }
}
