import JoinLobby from "./JoinLobby";
import { Payloads } from "shared/Payloads";
import WaitLobby from "./WaitLobby";

const Lobby: React.FC<LobbyProps> = (props) => {
  
  return (
    <div>
    { props.lobbyId === "" ?
      <JoinLobby setLobbyId={props.setLobbyId} /> :
      <WaitLobby lobbyState={props.lobbyState} /> }
    </div>
  );
}

type LobbyProps = {
  lobbyId: string,
  setLobbyId: (s: string) => void,
  lobbyState: Payloads.LobbyState,
}

export default Lobby