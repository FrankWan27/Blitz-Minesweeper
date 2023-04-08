import socketManager from "./websocket/SocketManager";
import { useEffect, useState } from "react";
import { Payloads, TileState } from "shared/Payloads";
import { GameContainer } from "./game/GameContainer";
import Lobby from "./lobby/Lobby";

const sm = socketManager;

export default function GameManager() {
  const [lobbyId, setLobbyId] = useState("");
  const [gameStart, setGameStart] = useState(false);
  const [board, setBoard] = useState<TileState[][]>([]);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [lobbyState, setLobbyState] = useState(defaultLobbyState);

  useEffect(() => {
    sm.onJoinLobby((data) => {
      updateURL(data.lobbyId);
      setLobbyId(data.lobbyId);
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
      In Lobby: {lobbyId}
      {gameStart ? <GameContainer board={board} width={width} height={height} lobbyState={lobbyState} clientId={sm.getId()}/>: <Lobby lobbyId={lobbyId} setLobbyId={setLobbyId} lobbyState={lobbyState}/>}
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
  clientNames: {},
  playerStatus: {}
}
