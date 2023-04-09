import JoinLobby from "./JoinLobby";
import { Payloads } from "shared/Payloads";
import WaitLobby from "./WaitLobby";
import socketManager from "component/websocket/SocketManager";
import { useState } from "react";
import './Lobby.css'

const sm = socketManager;
const Lobby: React.FC<LobbyProps> = (props) => {
  const[lobbySettings, setLobbySettings] = useState({lobbyId: props.lobbyId});
  sm.onLobbySettings((data) => {
    setLobbySettings(data);
    console.log(data);
  });
  return (
    <div className="lobby">
    { props.lobbyId === "" ?
      <JoinLobby setLobbyId={props.setLobbyId} /> :
      <WaitLobby lobbyState={props.lobbyState} lobbySettings={lobbySettings} /> }
    </div>
  );
}

type LobbyProps = {
  lobbyId: string,
  setLobbyId: (s: string) => void,
  lobbyState: Payloads.LobbyState,
}

export default Lobby