import React, { useEffect, useState } from "react";
import { ClientId, Payloads } from "shared/Payloads";

const Timer: React.FC<TimerProps> = (props) => {
  const[time, setTime] = useState(30 * 1000);
  const[active, setActive] = useState(false);
  useEffect(() => {
    setActive(props.lobbyState.currentPlayer == props.clientId);
    setTime(props.lobbyState.playerStatus[props.clientId].timeRemaining);
  }, [props.lobbyState])

  const showTime = (ms: number) => {
    let sec = ms / 1000;
    return sec > 0 ? sec.toFixed(1) : 0;
  }
  return (
    <div className={`timer ${active ? "active" : ""}`}>
      <div className='time'>{showTime(time)}</div>
      <div className='name'>{props.lobbyState.clientNames[props.clientId]} {props.isPlayer? "(You)":""}</div>
    </div>
  )
}

export const GameStatus: React.FC<GameStatusProps> = (props) => {
  const timers = []
  for (const clientId of Object.keys(props.lobbyState.clientNames)) {
    timers.push(<Timer lobbyState={props.lobbyState} clientId={clientId} isPlayer={clientId == props.clientId}/>)
  }

  return (<div className="status">{timers}</div>);
}

export type GameStatusProps = {
  clientId: ClientId;
  lobbyState: Payloads.LobbyState;
}

type TimerProps = {
  clientId: ClientId;
  isPlayer: boolean;
  lobbyState: Payloads.LobbyState;
}