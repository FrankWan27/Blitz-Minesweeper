// import { Button } from "@mantine/core";
import React from "react";
import { TileState } from "shared/Payloads";
import "./Gameboard.css"
import socketManager from "../websocket/SocketManager";

const sm = socketManager;
const Tile: React.FC<TileProps> = (props) => {
  const getText = () => {
    switch (props.state) {
      case 'bomb':
        return '💣';
      case 'flag':
        return '🚩';
      case 'hidden':
      case 'blank':
        return ' ';
      default:
        return props.state;
    }
  }
  const tileClick = () => {
    if (props.state != 'hidden') {
      return;
    }
    sm.move(props.x, props.y);
  }

  return (
    <td>
      <div
        style={{ width: `${props.tileWidth}vw` }}
        className={`tile ${props.state === 'hidden' ? 'hidden' : 'revealed'}`}
        onClick={tileClick} >
        {getText()}
      </div>
    </td>
  )
}

export interface GameboardProps {
  board: TileState[][],
  width: number,
  height: number,
}

interface TileProps {
  state: TileState,
  tileWidth: number,
  x: number,
  y: number
}

export const Gameboard: React.FC<GameboardProps> = (props) => {
  const grid = [];
  // ratio to view
  const tableWidth = 60;
  for (let y = 0; y < props.height; y++) {
    const row = [];
    for (let x = 0; x < props.width; x++) {
      row.push(<Tile state={props.board[x][y]} tileWidth={tableWidth / props.width} x={x} y={y} key={`${x}-${y}`} />);
    }
    grid.push(<tr key={y}>{row}</tr>);
  }

  return <table style={{width: `${tableWidth}vw`}}><tbody>{grid}</tbody></table>;
}

export default Gameboard;
