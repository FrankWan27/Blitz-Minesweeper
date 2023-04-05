import { ClientId } from "network/client";
import { Lobby } from "network/lobby";

interface PlayerStatus {
  //in milliseconds
  timeRemaining: number,
  lastMove: number | null, 
  timeout: NodeJS.Timeout | null,
  alive: boolean
}
export class TurnTimer {

  private readonly BASE_TIME = 30 * 1000;

  public readonly playerStatus: Map<ClientId, PlayerStatus> = new Map<ClientId, PlayerStatus>();

  public currentPlayer = null;

  private clientIdArray = [];
  
  constructor(private readonly lobby: Lobby) { }
  
  startGame() {
    this.lobby.clients.forEach(client => {
      this.playerStatus.set(client.id, {alive: true, timeout: null, lastMove: null, timeRemaining: this.BASE_TIME})
    })
    console.log(this.playerStatus);
    this.clientIdArray = Array.from(this.lobby.clients.keys());
    this.currentPlayer = this.clientIdArray[Math.floor(Math.random() * this.clientIdArray.length)];
  }

  isCurrentPlayer(clientId: string) {
    console.log("current player is", this.currentPlayer)
    if (this.currentPlayer == clientId) {
      return true;
    }
    return false;
  }

  nextPlayer() {
    const curStatus = this.playerStatus.get(this.currentPlayer);
    const date = Date.now();
    if (curStatus.timeout) {
      clearTimeout(curStatus.timeout);
    }
    if (curStatus.lastMove) {
      curStatus.timeRemaining = curStatus.timeRemaining - (date - curStatus.lastMove);
    }
    this.currentPlayer = this.clientIdArray[(this.clientIdArray.indexOf(this.currentPlayer) + 1) % this.clientIdArray.length];
    const nextPlayer = this.playerStatus.get(this.currentPlayer);
    nextPlayer.lastMove = date;
    nextPlayer.timeout = setTimeout(() => {nextPlayer.alive = false; this.checkGameOver()}, nextPlayer.timeRemaining);
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