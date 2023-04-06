import { GameStatus, GameStatusProps } from "./GameStatus";
import Gameboard, { GameboardProps } from "./Gameboard";
import './GameContainer.css';

export const GameContainer: React.FC<GameContainerProps> = (props) => {
  return (<div className='container'>
    <GameStatus lobbyState={props.lobbyState} clientId={props.clientId} />
    <Gameboard board={props.board} width={props.width} height={props.height} />
    {/* <div style={{flex: 1}} /> */}
  </div>);
}

type GameContainerProps = GameboardProps & GameStatusProps;