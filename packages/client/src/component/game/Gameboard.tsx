import React from "react";
import { TileState } from "shared/Payloads";
import socketManager from "../websocket/SocketManager";
import { Grid } from "@mantine/core";

const sm = socketManager;
const Tile: React.FC<TileProps> = (props) => {
  const getText = () => {
    switch (props.state) {
      case "bomb":
        return "💣";
      case "flag":
        return "🚩";
      case "hidden":
      case "blank":
        return " ";
      default:
        return props.state;
    }
  };

  const tileClick = () => {
    if (props.state !== "hidden") return;
    sm.move(props.x, props.y);
  };

  return (
    <Grid.Col span={1} onClick={tileClick}>
      <div
        className={`tile ${props.state === "hidden" ? "hidden" : "revealed"}`}
      >
        {getText()}
      </div>
    </Grid.Col>
  );
};

export interface GameboardProps {
  board: TileState[][];
  width: number;
  height: number;
}

interface TileProps {
  state: TileState;
  x: number;
  y: number;
}

export const Gameboard: React.FC<GameboardProps> = (props) => {
  const grid = [];
  const rowSize = props.width;

  for (let y = 0; y < props.height; y++) {
    for (let x = 0; x < props.width; x++) {
      grid.push(
        <Tile state={props.board[x][y]} x={x} y={y} key={`${x}-${y}`} />
      );
    }
  }

  return (
    <Grid className="board" gutter={4} columns={rowSize}>
      {grid}
    </Grid>
  );
};

export default Gameboard;
