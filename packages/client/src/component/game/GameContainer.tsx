import { GameStatus, GameStatusProps } from "./GameStatus";
import Gameboard, { GameboardProps } from "./Gameboard"

export const GameContainer: React.FC<GameContainerProps> = (props) => {
  // if (Object.keys(props.lobbyState.playerStatus).length == 0) {
  //   return <div />
  // }
  return (<div>
    <GameStatus lobbyState={props.lobbyState} clientId={props.clientId}/>
    <Gameboard board={props.board} width={props.width} height={props.height} />
  </div>);
}

type GameContainerProps = GameboardProps & GameStatusProps;