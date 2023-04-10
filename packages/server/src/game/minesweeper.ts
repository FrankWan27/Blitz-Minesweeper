import { ClientId, Payloads, TileState } from '@shared/Payloads';
import { getRandomInt } from '@shared/Utils';
import { Lobby } from 'network/lobby';

export class Minesweeper {
  private board: Tile[][];
  private first: boolean = true;

  constructor(
    private readonly lobby: Lobby,
    private width,
    private height,
    private bombs,
  ) {
    this.initializeBoard();
  }

  public startGame() {
    this.lobby.emitGameStart();
  }

  initializeBoard() {
    this.board = [];
    for (let x = 0; x < this.width; x++) {
      this.board.push([]);
      for (let y = 0; y < this.height; y++) {
        this.board[x][y] = new Tile(x, y);
      }
    }
  }

  firstMove(x: number, y: number) {
    this.first = false;
    this.plantBombs(this.board, x, y);
    this.updateHints(this.board);
  }

  plantBombs(board: Tile[][], x: number, y: number): void {
    let bombsPlanted = 0;
    let safeTiles = this.getNeighbors(board, x, y);
    safeTiles.push(board[x][y]);

    while (bombsPlanted < this.bombs) {
      let randX = getRandomInt(this.width);
      let randY = getRandomInt(this.height);
      if (!board[randX][randY].isBomb && !safeTiles.includes(board[randX][randY])) {
        board[randX][randY].isBomb = true;
        bombsPlanted++;
      }
    }
  }

  updateHints(board: Tile[][]): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let bombs = 0;
        this.getNeighbors(board, x, y).map((tile) => {
          if (tile.isBomb) {
            bombs++;
          }
        });
        board[x][y].hint = bombs;
      }
    }
  }

  getNeighbors(board: Tile[][], x: number, y: number): Tile[] {
    let neighbors = [];
    if (this.inBounds(x - 1, y - 1)) {
      neighbors.push(board[x - 1][y - 1]);
    }
    if (this.inBounds(x - 1, y)) {
      neighbors.push(board[x - 1][y]);
    }
    if (this.inBounds(x - 1, y + 1)) {
      neighbors.push(board[x - 1][y + 1]);
    }
    if (this.inBounds(x, y + 1)) {
      neighbors.push(board[x][y + 1]);
    }
    if (this.inBounds(x + 1, y + 1)) {
      neighbors.push(board[x + 1][y + 1]);
    }
    if (this.inBounds(x + 1, y)) {
      neighbors.push(board[x + 1][y]);
    }
    if (this.inBounds(x + 1, y - 1)) {
      neighbors.push(board[x + 1][y - 1]);
    }
    if (this.inBounds(x, y - 1)) {
      neighbors.push(board[x][y - 1]);
    }
    return neighbors;
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public getGameboardState(clientId: ClientId): Payloads.GameboardState {
    const state = [];
    for (let x = 0; x < this.width; x++) {
      state.push([]);
      for (let y = 0; y < this.height; y++) {
        state[x][y] = this.tileToTileState(clientId, this.board[x][y]);
      }
    }

    return {
      tiles: state,
      height: this.height,
      width: this.width,
    };
  }

  private tileToTileState(clientId: ClientId, tile: Tile): TileState {
    
    if (tile.isHidden) {
      if (tile.isFlagged(clientId)) {
        return 'flag';
      }
      return 'hidden';
    }
    if (tile.isBomb) {
      return 'bomb';
    }
    if (tile.hint == 0) {
      return 'blank';
    }
    return tile.hint;
  }

  validateMove(move: Payloads.ClientMove): boolean {
    if (!this.inBounds(move.x, move.y)) {
      return false;
    }
    let tile = this.board[move.x][move.y];
    switch (move.type) {
      case 'reveal':
        if (!tile.isHidden) {
          return false;
        }
        break;
      case 'flag':
        if (!tile.isHidden) {
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  }

  executeMove(clientId: ClientId, move: Payloads.ClientMove): void {
    switch (move.type) {
      case 'reveal':
        if (this.first) {
          this.firstMove(move.x, move.y);
        }
        this.revealTile(clientId, move.x, move.y);
        break;
      case 'flag':
        this.flagTile(clientId, move.x, move.y);
      default:
        break;
    }
  }

  revealTile(clientId: ClientId, x: number, y: number): void {
    const tile = this.board[x][y];
    tile.isHidden = false;
    if (tile.hint == 0 && !tile.isBomb) {
      this.getNeighbors(this.board, x, y).forEach((neighbor) => {
        if (neighbor.isHidden) {
          this.revealTile(clientId, neighbor.x, neighbor.y);
        }
      });
    }
    if (tile.isBomb) {
      this.lobby.bomb(clientId);
    }
  }

  flagTile(clientId: ClientId, x: number, y: number): void {
    this.board[x][y].toggleFlag(clientId);
    console.log("After", this.board[x][y].flag)
    
  }

  revealBoard(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.board[x][y].isHidden = false;
      }
    }
  }
  
}


class Tile {
  public isHidden = true;
  public isBomb;
  public hint: number;
  public flag: Set<ClientId>;

  constructor(public x: number, public y: number) {
    this.flag = new Set<ClientId>();
  }

  isFlagged(clientId: ClientId) {
    return this.flag.has(clientId);
  }

  toggleFlag(clientId: ClientId) {
    if (this.flag.has(clientId)) {
      this.flag.delete(clientId);
    } else {
      this.flag.add(clientId);
    }
  }
}
