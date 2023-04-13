import React, { useEffect, useState } from "react";
import { ClientId, Payloads } from "shared/Payloads";
import { getName } from "shared/Utils";
import useSound from "use-sound";
import ping from "../../assets/ping.mp3";

const Timer: React.FC<TimerProps> = (props) => {
  const [time, setTime] = useState(30 * 1000);
  const [active, setActive] = useState(false);
  const [sound] = useSound(ping, { volume: 0.5 });
  useEffect(() => {
    setActive(props.lobbyState.currentPlayer === props.clientId);
    setTime(props.lobbyState.playerStatus[props.clientId].timeRemaining);
  }, [props.lobbyState, props.clientId]);

  useEffect(() => {
    if (props.isPlayer && active) {
      sound();
    }
  }, [active, sound, props.isPlayer])

  const showTime = (ms: number) => {
    let sec = ms / 1000;
    return sec > 0 ? sec.toFixed(1) : 0;
  };
  return (
    <div className={`timer ${active ? "active" : ""}`}>
      <div className="time">{showTime(time)}</div>
      <div className="name">
        {getName(props.clientId)} {props.isPlayer ? "(You)" : ""}
      </div>
    </div>
  );
};

export const GameStatus: React.FC<GameStatusProps> = (props) => {
  const timers = [];
  for (const clientId of props.lobbyState.players) {
    timers.push(
      <Timer
        lobbyState={props.lobbyState}
        clientId={clientId}
        isPlayer={clientId === props.clientId}
      />
    );
  }

  return <div className="status">{timers}</div>;
};

export type GameStatusProps = {
  clientId: ClientId;
  lobbyState: Payloads.LobbyState;
};

type TimerProps = {
  clientId: ClientId;
  isPlayer: boolean;
  lobbyState: Payloads.LobbyState;
};
