import { useScrollIntoView } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useImperativeHandle } from "react";
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
    return sec.toFixed(1);
  }
  return (<div>
    {showTime(time)}
    <br/>
    CurrentPlayer: {props.lobbyState.clientNames[props.lobbyState.currentPlayer]}
    <br/>
    You are: {props.lobbyState.clientNames[props.clientId]} and it is {active ? "":"NOT"} your turn
    </div>)
}

export const GameStatus: React.FC<GameStatusProps> = (props) => {
  useEffect(() => {
    
  }, [props.lobbyState])
  return (<div>
    <Timer lobbyState={props.lobbyState} clientId={props.clientId}/>
    {/* Number of Players: {props.lobbyState.playerCount}
    CurrentPlayer: {props.lobbyState.currentPlayer}
    You are: {props.clientId} */}
  </div>);
}

export type GameStatusProps = {
  clientId: ClientId;
  lobbyState: Payloads.LobbyState;
}

type TimerProps = {
  clientId: ClientId;
  lobbyState: Payloads.LobbyState;
}