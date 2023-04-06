import socketManager from "./websocket/SocketManager";
import Gameboard from "./game/Gameboard";
import { useEffect, useState } from "react";
import JoinLobby from "./JoinLobby";
import { Payloads, TileState } from "shared/Payloads";
import { GameContainer } from "./game/GameContainer";

const sm = socketManager;

export default function GameManager() {
  const [lobby, setLobby] = useState("");
  const [gameStart, setGameStart] = useState(false);
  const [board, setBoard] = useState<TileState[][]>([]);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [lobbyState, setLobbyState] = useState(defaultLobbyState);

  useEffect(() => {
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

    sm.onLobbyState((data) => {
      setLobbyState(data);
    })

    const updateURL = (str: string) => {
      window.history.replaceState("", "", "/" + str);
    }
  }, []);

  return (
    <div className="game">
      In Lobby: {lobby}
      {gameStart ? <GameContainer board={board} width={width} height={height} lobbyState={lobbyState} clientId={sm.getId()}/>: <JoinLobby />}
    </div>
  );
}

const defaultLobbyState : Payloads.LobbyState = {
  currentPlayer: "N/A",
  lobbyId: "",
  gameStarted: false,
  gamePaused: false,
  gameEnded: false,
  playerCount: 0,
  playerStatus: {}
}
