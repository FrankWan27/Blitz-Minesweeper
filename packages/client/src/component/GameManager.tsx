import { io } from "socket.io-client";
import socketManager from "./websocket/SocketManager";
import Gameboard from "./Gameboard";
import { useState } from "react";
import JoinLobby from "./JoinLobby";
import { TileState } from "shared/Payloads";

const socket = io();
const sm = socketManager;

export default function GameManager() {
  const [lobby, setLobby] = useState("");
  const [gameStart, setGameStart] = useState(false);
  const [board, setBoard] = useState<TileState[][]>([]);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);

  sm.onJoinLobby((data) => {
    updateURL(data.lobbyId);
    setLobby(data.lobbyId);
  })

  sm.onGameboardState((data) => {
    setBoard(data.tiles);
    setWidth(data.width);
    setHeight(data.height);
    setGameStart(true)
  })

  sm.onGameStart(() => {
    sm.getGameState();
  })

  const updateURL = (str: string) => {
    window.history.replaceState("", "", "/" + str);
  }

  return (
    <div className="game">
      In Lobby: {lobby}
      {gameStart ? <Gameboard board={board} width={width} height={height} /> : <JoinLobby />}
    </div>
  );
}
function timeout(delay: number) {
  return new Promise(res => setTimeout(res, delay));
}



