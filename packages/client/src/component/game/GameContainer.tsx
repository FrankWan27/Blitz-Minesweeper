import { GameStatus, GameStatusProps } from "./GameStatus";
import Gameboard, { GameboardProps } from "./Gameboard";
import "./GameContainer.css";
import socketManager from "component/websocket/SocketManager";
import { Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Payloads } from "shared/Payloads";
import { useEffect, useState } from "react";
import { getName } from "shared/Utils";

const sm = socketManager;
export const GameContainer: React.FC<GameContainerProps> = (props) => {


  return (
    <div className="container">
      <GameStatus lobbyState={props.lobbyState} clientId={props.clientId} />
      <Gameboard
        board={props.board}
        width={props.width}
        height={props.height}
      />
      <PostGame lobbyState={props.lobbyState}/>
    </div>
  );
};

const PostGame: React.FC<{lobbyState: Payloads.LobbyState}> = (props) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [isWinner, setIsWinner] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  sm.onGameOver((data) => {
    setIsWinner(sm.getId() === data.winnerId);
    setWinnerName(getName(data.winnerId));
    open();
  })

  useEffect(() => {
    close();
  }, [props.lobbyState.gameEnded, close])

  return (
  <><Modal opened={opened} onClose={close} title="Game Over" centered>
      You {isWinner? "Win" : "Lose"}
      <br/>
      The winner is {winnerName}
      <Group>
        <Button onClick={() => (sm.backToLobby(props.lobbyState.lobbyId))}>Back To Lobby</Button>
        <Button onClick={() => {sm.restartGame(props.lobbyState.lobbyId); close();}}>Play Again</Button>
      </Group>
    </Modal>
    </>
  )
}

type GameContainerProps = GameboardProps & GameStatusProps;